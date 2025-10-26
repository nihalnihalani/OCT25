// src/components/ChatInterface.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Message } from '@/types/chat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

import VoiceWelcomeScreen from './VoiceWelcomeScreen';
import { useChatApi } from '../hooks/useChatApi';
import { useVoice } from '../contexts/VoiceContext';
import { useFirestore } from '../hooks/useFirestore';
import { useAuth } from '../contexts/AuthContext';

const ChatInterface: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const { sendMessage, isLoading } = useChatApi();
  const firestore = useFirestore();
  const { user } = useAuth();

  // Add state for financial profile and voice welcome
  const [financialProfile, setFinancialProfile] = useState<any>(null);
  const [hasSeenVoiceWelcome, setHasSeenVoiceWelcome] = useState(() => {
    return localStorage.getItem('hasSeenVoiceWelcome') === 'true';
  });
  const [isManualClear, setIsManualClear] = useState(false);

  const {
    isSessionActive,
    isConnecting,
    startVoiceSession,
    stopVoiceSession,
    events
  } = useVoice();

  // Add useEffect to load financial profile
  useEffect(() => {
    const loadFinancialProfile = async () => {
      try {
        // First try to get the full profile
        if (firestore.isAuthenticated) {
          const profile = await firestore.getProfile();
          if (profile) {
            setFinancialProfile(profile);
            return;
          }
        }

        // Fallback to progressive profile
        const progressiveProfile = localStorage.getItem('quickFinancialProfile');
        if (progressiveProfile) {
          setFinancialProfile(JSON.parse(progressiveProfile));
        }
      } catch (error) {
        console.error('Error loading financial profile:', error);
      }
    };

    loadFinancialProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore]);

  // Cleanup voice session when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      if (isSessionActive) {
        console.log('🚪 ChatInterface unmounting, stopping active voice session');
        stopVoiceSession();
      }
    };
  }, [isSessionActive, stopVoiceSession]);

  // Load chat history on component mount and auto-start voice for new users
  useEffect(() => {
    const loadChatHistory = async () => {
      // Don't run if this is a manual clear
      if (isManualClear) return;
      
      let isNewUser = false;

      if (firestore.isAuthenticated) {
        const firestoreChat = await firestore.getChat();
        if (firestoreChat && firestoreChat.length > 0 && firestoreChat[0].messages) {
          setMessages(firestoreChat[0].messages);
          return;
        }
      }

      // Fallback to localStorage
      const savedMessages = localStorage.getItem('chatHistory');
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(parsedMessages);
        } catch (error) {
          console.error('Error loading chat history:', error);
        }
      } else {
        isNewUser = true;
      }

      // If no chat history exists, auto-start voice session for verbal welcome
      const chatHistory = firestore.isAuthenticated ? await firestore.getChat() : [];
      if (isNewUser && (!firestore.isAuthenticated || !chatHistory.length || !chatHistory[0]?.messages?.length)) {
        // Show a brief text message while starting voice session
        const preparingMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: "🎤 Starting voice introduction... Please allow microphone access when prompted!",
          timestamp: new Date(),
          isVoice: false
        };
        setMessages([preparingMessage]);

        // Auto-start voice session - the hook will handle the verbal welcome
        setTimeout(async () => {
          try {
            await startVoiceSession();
          } catch (error) {
            console.error('Failed to start voice session for welcome:', error);
            // Fallback to text welcome if voice fails
            const fallbackMessage: Message = {
              id: crypto.randomUUID(),
              role: 'assistant',
              content: `Hey there! 👋 I'm your BUD-DY Advisor, and I'm genuinely excited to help you make smarter money decisions.

You know that feeling when you're about to buy something and you're not quite sure if it's the right move? That's exactly where I come in. I'm here to be your financial wingman - whether you're debating a big purchase, trying to figure out your budget, or just want to chat about money stuff.

Here's the cool part - we can talk in two ways:

💬 **Just type away** - Ask me anything! "Should I buy this?" "How much emergency fund do I need?" "Is this a good deal?" I love these conversations.

🎤 **Or let's actually talk** - Hit that voice button and we can have a real conversation. It's like having a financially savvy friend right there with you.

I'm not here to judge your spending (we've all been there with impulse buys 😅). I'm here to help you think through decisions so you feel confident about your choices.

So... what's on your mind? Got a purchase you're considering? Want to talk budgets? Or maybe you just want to see what I'm all about? I'm all ears! 🎧`,
              timestamp: new Date(),
              isVoice: false
            };
            setMessages([fallbackMessage]);
          }
        }, 500);
      }
    };

    loadChatHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firestore, startVoiceSession, isManualClear]);

  // Save messages whenever they change - only save the latest message
  useEffect(() => {
    const saveMessages = async () => {
      if (messages.length > 0) {
        const latestMessage = messages[messages.length - 1];
        if (firestore.isAuthenticated) {
          await firestore.saveChat(latestMessage.role, latestMessage.content);
        } else {
          localStorage.setItem('chatHistory', JSON.stringify(messages));
        }
      }
    };

    saveMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, firestore]);

  // Process voice session events and add them to chat history
  useEffect(() => {
    if (events.length > 0) {
      setIsManualClear(false);
      const latestEvent = events[0];

      // Handle different types of voice events
      if (latestEvent.type === 'conversation.item.input_audio_transcription.completed') {
        const userMessage: Message = {
          id: crypto.randomUUID(),
          role: 'user',
          content: latestEvent.transcript,
          timestamp: new Date(),
          isVoice: true
        };
        setMessages(prev => [...prev, userMessage]);
      } else if (latestEvent.type === 'response.audio_transcript.done') {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: latestEvent.transcript,
          timestamp: new Date(),
          isVoice: true
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else if (latestEvent.type === 'ui.show_navigation_prompt') {
        // Show navigation prompt as a special message
        const navigationMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: latestEvent.data.message,
          timestamp: new Date(),
          isVoice: true
        };
        setMessages(prev => [...prev, navigationMessage]);

        // Add navigation button
        setTimeout(() => {
          const buttonMessage: Message = {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: `<button onclick="window.location.href='/';" style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; margin: 8px 0;">Go to Purchase Analyzer →</button>`,
            timestamp: new Date(),
            isVoice: true
          };
          setMessages(prev => [...prev, buttonMessage]);
        }, 500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, navigate]);

  const handleSendMessage = async (messageContent: string) => {
    setIsManualClear(false);
    if (isSessionActive) {
      const event = {
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: messageContent }],
        },
      };
      // Voice events now handled by global voice context
    } else {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: messageContent,
        timestamp: new Date(),
        isVoice: false
      };
      setMessages(prev => [...prev, userMessage]);

      const response = await sendMessage(messageContent, [...messages, userMessage]);

      if (response) {
        const assistantMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
          isVoice: false
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    }
  };

  const clearChatHistory = async () => {
    setIsManualClear(true);
    setMessages([]);
    // Clear chat history in localStorage for now
    // TODO: Implement proper chat clearing in firestore
    localStorage.removeItem('chatHistory');
  };

  // Update the handleStartSession function to include financial context
  const handleStartSessionWithContext = async () => {
    await startVoiceSession();

    // Send financial context to the voice session
    if (isSessionActive && financialProfile) {
      const contextMessage = {
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "system",
          content: [{
            type: "input_text",
            text: `User's Financial Context: Monthly income: $${financialProfile.monthlyIncome || 'not provided'}. Monthly expenses: $${financialProfile.monthlyExpenses || 'not provided'}. Savings: $${financialProfile.currentSavings || 'not provided'}. Emergency fund: ${financialProfile.hasEmergencyFund ? 'Yes' : 'No'}. Primary goal: ${financialProfile.financialGoal || 'not specified'}. Use this context to provide personalized financial advice.`
          }]
        }
      };
      // Context now handled by global voice provider
    }

    // Add welcome message with personalized greeting
    const welcomeMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `🎤 Voice session started! ${financialProfile ? `I have your financial profile loaded and ready to give you personalized advice.` : 'I\'m listening...'} Feel free to ask me about any purchase you're considering!`,
      timestamp: new Date(),
      isVoice: true
    };
    setMessages(prev => [...prev, welcomeMessage]);
  };

  // Enhanced start session with greeting (keep for backward compatibility)
  const handleStartSession = async () => {
    await startVoiceSession();
  };

  const VoiceControlButton = () => {
    if (isConnecting) {
      return (
        <button disabled className="btn btn-secondary btn-sm">
          <span className="loading-spinner"></span>
          Connecting...
        </button>
      );
    }
    if (isSessionActive) {
      return (
        <button
          onClick={stopVoiceSession}
          className="btn btn-danger btn-sm"
          title="Click to stop microphone and end voice session"
        >
          🔴 Stop Microphone
        </button>
      );
    }
    return (
      <button
        onClick={handleStartSession}
        className="btn btn-primary btn-sm"
        title="Click to start voice session with microphone"
      >
        🎤 Start Voice Session
      </button>
    );
  };

  return (
    <div className="chat-page-container">
      <div className={`chat-interface-centered ${isSessionActive ? 'voice-active' : ''}`}>
        {/* Show welcome screen for new users */}
        {messages.length === 0 && !hasSeenVoiceWelcome && !isManualClear && (
          <VoiceWelcomeScreen
            onDismiss={() => {
              setHasSeenVoiceWelcome(true);
              localStorage.setItem('hasSeenVoiceWelcome', 'true');
            }}
            onStartVoice={() => {
              setHasSeenVoiceWelcome(true);
              localStorage.setItem('hasSeenVoiceWelcome', 'true');
              startVoiceSession();
            }}
          />
        )}

        {/* Existing chat header - simplified */}
        <div className="chat-header">
          <div className="chat-header-content">
            <h2 className="chat-title">
              <span className="chat-icon">💬</span>
              <span className="chat-title-text">
                BUD-DY Advisor
                {isSessionActive && <span className="voice-indicator">🎤 Live</span>}
              </span>
            </h2>
            <div className="chat-controls">
              {messages.length > 0 && (
                <button onClick={clearChatHistory} className="btn btn-secondary btn-sm clear-history-btn">
                  <span className="btn-icon-only">🗑️</span>
                  <span className="btn-text-desktop">Clear</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <MessageList messages={messages} />

        <MessageInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading || isSessionActive}
          placeholder={isSessionActive ? "Voice session active - speak to BUD-DY Advisor!" : "Ask about a purchase or financial advice..."}
        />

        {/* Quick Actions */}
        <div className="quick-actions">
          <button onClick={() => navigate('/')} className="quick-action-btn">
            <span className="quick-action-icon">🛒</span>
            <span className="quick-action-text">Analyze Purchase</span>
          </button>
          <button onClick={() => navigate('/profile')} className="quick-action-btn">
            <span className="quick-action-icon">👤</span>
            <span className="quick-action-text">Profile</span>
          </button>
        </div>
      </div>


    </div>
  );
}

export default ChatInterface;