# 🎨 BUD-DY - Smart Purchase Decision Assistant

> Your intelligent financial advisor powered by AI to help you make smarter purchasing decisions and achieve your financial goals.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-green)](https://openai.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Theme System](#theme-system)
- [Development Guide](#development-guide)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Performance](#performance)
- [Security](#security)
- [Accessibility](#accessibility)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Support](#support)
- [FAQ](#faq)

## 🎯 Overview

BUD-DY is a comprehensive financial advisor application that helps users make informed purchasing decisions through AI-powered analysis, voice conversations, and personalized recommendations. Whether you're considering a small purchase or a major investment, BUD-DY provides expert financial guidance tailored to your situation.

### Key Features

- 🤖 **AI-Powered Purchase Analyzer** - Upload images or describe items for instant analysis
- 🎤 **Voice Conversations** - Real-time voice sessions using OpenAI Realtime API
- 📊 **Financial Dashboard** - Visual overview of your financial health with health score
- 🎨 **Custom Theme System** - 5 preset themes plus custom theme builder
- 💡 **Pro Mode** - Advanced analysis with detailed projections and decision matrices
- 📍 **Location-Aware** - Location-based shopping recommendations
- 💾 **Local Database** - Works offline with local storage fallback
- ♿ **Accessible** - WCAG 2.1 AA compliant with full keyboard navigation

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4 + CSS Variables
- **Charts**: Recharts for data visualization
- **Routing**: React Router DOM v7

### Backend & Services
- **API Routes**: Next.js serverless functions
- **Database**: Local storage + Firebase Firestore
- **Authentication**: Local auth + Firebase Auth
- **AI Integration**: 
  - OpenAI GPT-4o for chat and analysis
  - GPT-4 Vision for image recognition
  - OpenAI Realtime API for voice conversations

### Development Tools
- **Testing**: Jest + React Testing Library
- **Build**: Webpack, Babel, PostCSS
- **Linting**: ESLint
- **Type Checking**: TypeScript

## 🏗 Architecture

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── chat/          # Chat API endpoint
│   │   ├── realtime/      # Voice API endpoint
│   │   └── uploads/       # File upload API
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── Dashboard/         # Dashboard widgets
│   └── ...               # Other components
├── contexts/             # React contexts
│   ├── AuthContext.tsx   # Authentication
│   ├── ThemeContext.tsx  # Theme management
│   └── VoiceContext.js   # Voice features
├── hooks/                # Custom React hooks
│   ├── useTheme.ts       # Theme hook
│   ├── useFirestore.ts   # Database hook
│   └── ...
├── lib/                  # Business logic
│   ├── themes/           # Theme system
│   │   ├── generator.ts  # Theme generator
│   │   ├── presets.ts    # Preset themes
│   │   └── utils.ts      # Theme utilities
│   ├── firestore/        # Database operations
│   └── ...
├── styles/               # CSS files
├── types/                # TypeScript definitions
│   ├── theme.ts          # Theme types
│   ├── chat.ts           # Chat types
│   └── index.ts          # Common types
└── utils/                # Utility functions
```

### Data Flow

```
User Input → Component → Hook → API/Context → Local DB/Firestore → Response → UI Update
```

### State Management

The app uses React Context API for global state:
- `AuthContext`: User authentication and profile
- `ThemeContext`: Theme preferences and management
- `VoiceContext`: Voice session state

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- OpenAI API key (get one at [platform.openai.com](https://platform.openai.com))
- (Optional) Firebase account for cloud features

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/nihalnihalani/OCT25.git
cd OCT25
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your-api-key-here

# Application Configuration
NEXT_PUBLIC_APP_NAME=BUD-DY Advisor
NODE_ENV=development

# OpenAI Configuration (optional)
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7
```

4. **Validate configuration**
```bash
npm run check-env
```

5. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🎨 Theme System

BUD-DY features a powerful theme system that allows you to personalize the entire application's appearance.

### Using Preset Themes

```typescript
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { presetThemes, applyTheme } = useTheme();
  
  // Apply Ocean theme
  applyTheme(presetThemes[0]);
}
```

### Creating Custom Themes

```typescript
const { createCustomTheme } = useTheme();

createCustomTheme({
  primaryColor: '#6366f1',
  accentColor: '#10b981',
  mode: 'light',
  backgroundStyle: 'clean'
});
```

### Available Preset Themes

- **Ocean** - Cool blue tones for a calm, professional feel (default)
- **Sunset** - Warm orange and purple gradients for energy
- **Forest** - Natural green tones for growth and prosperity
- **Lavender** - Soft purple and pink for a gentle touch
- **Midnight** - Dark mode with blue accents for night owls

### Theme Architecture

- **CSS Variables**: Dynamic theming using CSS custom properties
- **Automatic Generation**: Complete color palette from 4 simple choices
- **Accessibility**: All themes meet WCAG AA standards (4.5:1 contrast)
- **Persistence**: Theme preferences saved to localStorage
- **Instant Switching**: No page reload required

## 💻 Development Guide

### Project Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Production build
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run check-env        # Validate environment

# Testing
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests
```

### Code Structure

- **Components**: Functional React components with TypeScript
- **Hooks**: Custom hooks for reusable logic (`useTheme`, `useFirestore`, etc.)
- **Contexts**: Global state management (Auth, Theme, Voice)
- **Types**: TypeScript interfaces and types for type safety
- **Styles**: CSS modules and Tailwind utilities

### Adding New Features

1. Create component in `src/components/`
2. Add TypeScript types in `src/types/`
3. Create hooks if needed in `src/hooks/`
4. Add styles in `src/styles/` or use Tailwind classes
5. Update routing in `src/components/App.js`
6. Add tests in `tests/` directory
7. Update documentation

## 📡 API Documentation

### Chat API

**Endpoint**: `POST /api/chat`

**Request**:
```typescript
{
  message: string,
  conversationHistory?: Message[],
  useWebSearch?: boolean,
  image?: string
}
```

**Response**:
```typescript
{
  response: string,
  analysis?: PurchaseAnalysis
}
```

### Realtime Voice API

**Endpoint**: `POST /api/realtime/token`

**Response**:
```typescript
{
  client_secret: string,
  session_id: string
}
```

### File Upload API

**Endpoint**: `POST /api/uploads/[...path]`

**Request**: FormData with file

**Response**: Upload confirmation with file path

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# With coverage
npm run test:coverage

# Verbose output
npm run test:verbose
```

### Test Structure

```
tests/
├── unit/                # Unit tests
│   ├── simple.test.js
│   ├── structuredDecisionModel.test.js
│   └── progressiveFinancialProfile.test.js
├── integration/         # Integration tests
│   ├── edge-cases.test.js
│   └── recommendation-flow.test.js
├── fixtures/            # Test data
│   ├── personas.js
│   └── test-purchases.js
└── setup.js            # Test configuration
```

### Writing Tests

```javascript
import { render, screen } from '@testing-library/react';
import Component from '../src/components/Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deployment Options

#### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

#### Firebase Hosting

```bash
npm run deploy
```

#### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Troubleshooting

### Common Issues

**Port already in use**
```bash
lsof -ti:3000 | xargs kill -9
```

**Environment variables not loading**
```bash
npm run check-env:fix
```

**Build errors**
```bash
rm -rf .next node_modules && npm install && npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file

## ❓ FAQ

**Q: Do I need Firebase?**  
A: No, BUD-DY works with local storage.

**Q: Can I use my own OpenAI key?**  
A: Yes, add it to .env.local

**Q: How do I add a new theme?**  
A: See Theme System Documentation section

**Q: Is this production-ready?**  
A: Yes, with proper environment configuration

---

**Built with ❤️ by the BUD-DY team**
