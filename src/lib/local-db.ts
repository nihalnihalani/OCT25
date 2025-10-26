// src/lib/local-db.ts
// Browser-only localStorage-based database
import { nanoid } from 'nanoid';

// Define database schema
interface DatabaseSchema {
  users: User[];
  purchaseHistory: PurchaseHistoryItem[];
  financialProfiles: FinancialProfileData[];
  chatHistory: ChatHistoryData[];
  proModeAnalyses: ProModeAnalysis[];
}

// User interface
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
  lastUpdated: Date;
}

// Purchase History Item
export interface PurchaseHistoryItem {
  id: string;
  userId: string;
  itemName: string;
  itemDescription?: string;
  price: number;
  category?: string;
  recommendation: 'buy' | 'dontbuy';
  savings?: number;
  alternatives?: Array<{
    name: string;
    price: number;
    url?: string;
  }>;
  location?: string;
  timestamp: Date;
  decisionFactors?: {
    necessity?: string;
    timing?: string;
    affordability?: string;
    value?: string;
  };
}

// Financial Profile Data
export interface FinancialProfileData {
  userId: string;
  income?: number;
  monthlyExpenses?: number;
  debts?: Array<{
    type: string;
    amount: number;
    monthlyPayment: number;
  }>;
  savings?: {
    emergencyFund: number;
    investments: number;
  };
  goals?: Array<{
    type: string;
    amount: number;
    timeline: string;
  }>;
  riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  createdAt: Date;
  lastUpdated: Date;
}

// Chat Message
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isVoice?: boolean;
}

// Chat History Data
export interface ChatHistoryData {
  userId: string;
  messages: ChatMessage[];
  lastUpdated: Date;
}

// Pro Mode Analysis
export interface ProModeAnalysis {
  id: string;
  userId: string;
  itemName: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
  analysis: string;
  recommendation: 'buy' | 'dontbuy';
  confidence?: number;
  createdAt: Date;
}

// Storage keys
const STORAGE_KEY = 'denarii_db';
const DEFAULT_DATA: DatabaseSchema = {
  users: [],
  purchaseHistory: [],
  financialProfiles: [],
  chatHistory: [],
  proModeAnalyses: [],
};

// Get database from localStorage
function getDatabase(): DatabaseSchema {
  if (typeof window === 'undefined') return DEFAULT_DATA;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_DATA,
        ...parsed,
      };
    }
  } catch (error) {
    console.error('Failed to load database from localStorage:', error);
  }
  
  return { ...DEFAULT_DATA };
}

// Save database to localStorage
function saveDatabase(data: DatabaseSchema): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save database to localStorage:', error);
  }
}

// User operations
export async function createUser(userData: Omit<User, 'uid' | 'createdAt' | 'lastUpdated'>): Promise<User> {
  const db = getDatabase();
  const user: User = {
    uid: nanoid(),
    ...userData,
    createdAt: new Date(),
    lastUpdated: new Date(),
  };
  db.users.push(user);
  saveDatabase(db);
  return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = getDatabase();
  const user = db.users.find(u => u.email === email);
  return user || null;
}

export async function getUserById(uid: string): Promise<User | null> {
  const db = getDatabase();
  const user = db.users.find(u => u.uid === uid);
  return user || null;
}

export async function updateUser(uid: string, updates: Partial<User>): Promise<User | null> {
  const db = getDatabase();
  const userIndex = db.users.findIndex(u => u.uid === uid);
  if (userIndex === -1) return null;
  
  db.users[userIndex] = {
    ...db.users[userIndex],
    ...updates,
    lastUpdated: new Date(),
  };
  saveDatabase(db);
  return db.users[userIndex];
}

// Purchase History operations
export async function savePurchaseHistory(item: Omit<PurchaseHistoryItem, 'id' | 'timestamp'>): Promise<PurchaseHistoryItem> {
  const db = getDatabase();
  const purchaseItem: PurchaseHistoryItem = {
    ...item,
    id: nanoid(),
    timestamp: new Date(),
  };
  db.purchaseHistory.push(purchaseItem);
  saveDatabase(db);
  return purchaseItem;
}

export async function getUserPurchaseHistory(userId: string): Promise<PurchaseHistoryItem[]> {
  const db = getDatabase();
  return db.purchaseHistory
    .filter(item => item.userId === userId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Financial Profile operations
export async function saveFinancialProfile(userId: string, profile: Omit<FinancialProfileData, 'userId' | 'createdAt' | 'lastUpdated'>): Promise<FinancialProfileData> {
  const db = getDatabase();
  const existingIndex = db.financialProfiles.findIndex(p => p.userId === userId);
  
  const profileData: FinancialProfileData = {
    userId,
    ...profile,
    createdAt: existingIndex !== -1 ? db.financialProfiles[existingIndex].createdAt : new Date(),
    lastUpdated: new Date(),
  };

  if (existingIndex !== -1) {
    db.financialProfiles[existingIndex] = profileData;
  } else {
    db.financialProfiles.push(profileData);
  }
  
  saveDatabase(db);
  return profileData;
}

export async function getFinancialProfile(userId: string): Promise<FinancialProfileData | null> {
  const db = getDatabase();
  return db.financialProfiles.find(p => p.userId === userId) || null;
}

// Chat History operations - save a single chat message to user's chat history
export async function saveChatMessage(userId: string, role: 'user' | 'assistant', content: string): Promise<ChatHistoryData> {
  const db = getDatabase();
  
  // Find or create chat history for this user
  let chatHistory = db.chatHistory.find(ch => ch.userId === userId);
  
  if (!chatHistory) {
    chatHistory = {
      userId,
      messages: [],
      lastUpdated: new Date(),
    };
    db.chatHistory.push(chatHistory);
  }
  
  // Add the new message
  const newMessage: ChatMessage = {
    id: nanoid(),
    role,
    content,
    timestamp: new Date(),
  };
  
  chatHistory.messages.push(newMessage);
  chatHistory.lastUpdated = new Date();
  
  saveDatabase(db);
  return chatHistory;
}

export async function getChatHistory(userId: string): Promise<ChatHistoryData[]> {
  const db = getDatabase();
  return db.chatHistory.filter(ch => ch.userId === userId);
}

// Pro Mode operations
export async function saveProModeAnalysis(userId: string, analysis: Omit<ProModeAnalysis, 'id' | 'userId' | 'createdAt'>): Promise<ProModeAnalysis> {
  const db = getDatabase();
  const analysisData: ProModeAnalysis = {
    ...analysis,
    userId,
    id: nanoid(),
    createdAt: new Date(),
  };
  db.proModeAnalyses.push(analysisData);
  saveDatabase(db);
  return analysisData;
}

export async function getUserProModeAnalyses(userId: string): Promise<ProModeAnalysis[]> {
  const db = getDatabase();
  return db.proModeAnalyses
    .filter(a => a.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Clear all user data
export async function clearAllUserData(userId: string): Promise<void> {
  const db = getDatabase();
  db.purchaseHistory = db.purchaseHistory.filter(item => item.userId !== userId);
  db.financialProfiles = db.financialProfiles.filter(p => p.userId !== userId);
  db.chatHistory = db.chatHistory.filter(msg => msg.userId !== userId);
  db.proModeAnalyses = db.proModeAnalyses.filter(a => a.userId !== userId);
  saveDatabase(db);
}

// Initialize database
export async function initDatabase(): Promise<void> {
  const db = getDatabase();
  // Ensure all collections exist
  if (!db.users) db.users = [];
  if (!db.purchaseHistory) db.purchaseHistory = [];
  if (!db.financialProfiles) db.financialProfiles = [];
  if (!db.chatHistory) db.chatHistory = [];
  if (!db.proModeAnalyses) db.proModeAnalyses = [];
  saveDatabase(db);
  console.log('✅ Local database initialized with localStorage');
}

// Types are exported individually above
