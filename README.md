# Samurai Dojo

A modern, minimalist web application built with Next.js 14, featuring an advanced AI system with ELIZA core and multi-model support for autonomous agents.

## 🤖 AI System Architecture

### Core Components

- **ELIZA Core**: Base pattern-matching engine with extensible response templates
- **Multi-Model Support**: 
  - OpenAI (Primary)
  - DeepSeek (Fallback)
  - ELIZA (Final Fallback)
- **Memory System**: Conversation history and context management
- **Command System**: Extensible command handler with built-in commands

### Autonomous Agents

The system is designed to support autonomous agents with:
- State persistence
- Context awareness
- Multi-model switching
- Error recovery
- Memory management

## 🏗 Project Structure

```
samuraidojo/
├── app/                      # Next.js app directory
│   ├── commandcenter/       # Command center pages
│   │   ├── ogsenpai/       # OG Senpai - AI Core
│   │   │   ├── services/   # AI Services
│   │   │   │   ├── elizaCore.ts        # Pattern matching engine
│   │   │   │   ├── elizaService.ts     # Main service coordinator
│   │   │   │   ├── deepSeekService.ts  # DeepSeek integration
│   │   │   │   ├── openaiService.ts    # OpenAI integration
│   │   │   │   └── commandHandler.ts   # Command processing
│   │   │   └── components/ # UI Components
│   │   └── socialsenpai/  # Social Agents Hub
│   ├── components/         # Shared components
│   ├── styles/            # Shared styles
│   └── layout.tsx         # Root layout
├── public/                # Static assets
└── types/                # Shared TypeScript types
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   ```env
   NEXT_PUBLIC_OPENAI_API_KEY=your-openai-key
   NEXT_PUBLIC_DEEPSEEK_API_KEY=your-deepseek-key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

- **Colors**: Monochromatic black and white theme
- **Typography**: System font stack with careful letter-spacing
- **Components**: 
  - Bento Grid Cards with interactive hover effects
  - Minimalist navigation
  - Responsive layouts

## 🤖 AI System Features

### ELIZA Core
- Pattern matching engine
- Extensible response templates
- Fallback system
- Context awareness

### LLM Integration
- OpenAI GPT support
- DeepSeek integration
- Automatic fallback chain
- Conversation history management

### Command System
```typescript
Available commands:
  help         - Show help message
  reset        - Reset conversation
  clear        - Clear terminal
  exit         - End conversation
  mode openai   - Switch to OpenAI
  mode deepseek - Switch to DeepSeek
  mode eliza   - Switch to ELIZA
```

## 🧱 Development Guidelines

### Component Development
- Use TypeScript for all components
- Implement responsive design using mobile-first approach
- Follow atomic design principles
- Maintain consistent styling through CSS modules
- Optimize performance for animations and effects

### AI Development
- Follow modular design patterns
- Implement proper error handling
- Maintain conversation context
- Use TypeScript interfaces for type safety
- Document all AI-related functions

## 📱 Responsive Design

- Mobile: 320px - 480px
- Tablet: 481px - 768px
- Desktop: 769px+

## 🎭 Animation Guidelines

- Use CSS transitions for simple animations
- Implement requestAnimationFrame for complex animations
- Respect user preferences (prefers-reduced-motion)
- Optimize performance with will-change property

## 🧪 Testing

```bash
npm run test        # Run unit tests
npm run e2e        # Run end-to-end tests
```

## 📦 Deployment

The application is configured for deployment on Vercel.

## 🔒 Security

- API keys are managed through environment variables
- Rate limiting implemented for API calls
- Error handling for API failures
- Secure fallback mechanisms

## 📄 License

MIT License - See LICENSE file for details 