# Samurai Dojo Documentation

## Table of Contents

1. [Architecture Overview](./architecture/README.md)
   - [System Design](./architecture/system-design.md)
   - [Data Flow](./architecture/data-flow.md)
   - [Security Model](./architecture/security.md)

2. [Components](./components/README.md)
   - [Agents](./components/agents.md)
   - [Chat System](./components/chat.md)
   - [Skills Framework](./components/skills.md)
   - [UI Components](./components/ui.md)
   - [Layout System](./components/layout.md)

3. [Core Libraries](./lib/README.md)
   - [Authentication](./lib/auth.md)
   - [Database Integration](./lib/supabase.md)
   - [Custom Hooks](./lib/hooks.md)
   - [State Management](./lib/state.md)
   - [Type System](./lib/types.md)
   - [Utilities](./lib/utils.md)

4. [API Reference](./api/README.md)
   - [Endpoints](./api/endpoints.md)
   - [Middleware](./api/middleware.md)
   - [Error Handling](./api/errors.md)

5. [Development Guide](./development/README.md)
   - [Getting Started](./development/getting-started.md)
   - [Environment Setup](./development/environment.md)
   - [Docker Setup](./development/docker.md)
   - [Testing Strategy](./development/testing.md)
   - [Deployment](./development/deployment.md)

6. [Contributing](./contributing/README.md)
   - [Code Style Guide](./contributing/style-guide.md)
   - [Git Workflow](./contributing/git-workflow.md)
   - [Pull Request Process](./contributing/pull-requests.md)

7. [Security](./security/README.md)
   - [Authentication Flow](./security/auth-flow.md)
   - [Authorization](./security/authorization.md)
   - [Environment Variables](./security/env-variables.md)

8. [Performance](./performance/README.md)
   - [Optimization Guidelines](./performance/optimization.md)
   - [Monitoring](./performance/monitoring.md)
   - [Benchmarks](./performance/benchmarks.md)

## Quick Links

- [Installation Guide](./development/getting-started.md)
- [API Documentation](./api/README.md)
- [Contributing Guidelines](./contributing/README.md)
- [Security Policy](./security/README.md)
- [Change Log](./CHANGELOG.md)

## Project Overview

Samurai Dojo is a sophisticated platform that combines AI capabilities, real-time communication, and skill-based functionality. This documentation provides comprehensive information about the system architecture, development guidelines, and operational procedures.

## Documentation Structure

Each section of this documentation is organized to provide both high-level overviews and detailed technical specifications. The documentation follows a modular structure that mirrors the codebase organization.

## Overview
Samurai.Dojo is a modern web application built with Next.js 14, featuring a minimalist design philosophy and smooth animations. The application serves as an interface for advanced AI interactions and command center operations.

## Project Structure
```
samuraidojo/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   └── commandcenter/     # Command center module
├── public/                # Static assets
│   └── assets/           
│       └── Samurai Slice 960x540.gif  # Hero animation
└── docs/                  # Documentation
```

## Landing Page (`/app/page.tsx`)

### Purpose
The landing page serves as the main entry point to the application, designed to provide an immersive and engaging user experience through three distinct sections.

### Technical Implementation

#### 1. Core Technologies
- **Next.js 14**: Server-side rendering and routing
- **Framer Motion**: Animation library for smooth transitions
- **Tailwind CSS**: Utility-first styling
- **TypeScript**: Type-safe development

#### 2. Component Structure

##### Hero Section
- Full-screen section featuring a samurai animation
- Implements fade and scale animations on scroll
- Uses Next.js Image component for optimized image loading
```typescript
<Image
  src="/assets/Samurai Slice 960x540.gif"
  alt="Samurai Animation"
  width={960}
  height={540}
  priority
  className="mx-auto"
/>
```

##### Title Section
- Displays "samurai.dojo" text
- Implements fade-in animation when scrolled into view
- Responsive typography with Tailwind CSS

##### Command Center Link
- Minimalist design with hover effects
- Links to `/commandcenter` route
- Lowercase styling for aesthetic consistency

#### 3. Animation Implementation

##### Scroll Progress Tracking
```typescript
const containerRef = useRef<HTMLDivElement>(null)
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start", "end"]
})
```

##### Transform Effects
```typescript
const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])
const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.95, 0.9])
```

### Styling Philosophy
- Black background (`bg-black`) with white text for high contrast
- Full-height sections (`h-screen`) for immersive scrolling experience
- Centered content using Flexbox
- Smooth transitions for all interactive elements

### Performance Considerations
1. Image Optimization
   - Uses Next.js Image component with priority loading
   - Proper image dimensions specified
   - GIF optimized for web delivery

2. Animation Performance
   - Hardware-accelerated animations using Framer Motion
   - Efficient scroll-based transforms
   - Lazy loading of animations using `whileInView`

### Accessibility
- Semantic HTML structure
- Proper alt text for images
- Keyboard-navigable links
- High contrast color scheme

## Next Steps
1. Implement `/commandcenter` page
2. Add error boundaries
3. Implement loading states
4. Add meta tags for SEO
5. Implement analytics tracking

## Development Guidelines
1. Maintain minimalist design approach
2. Ensure responsive behavior across devices
3. Optimize for performance
4. Follow TypeScript best practices
5. Document all new features extensively 

## Command Center Page (`/app/commandcenter/page.tsx`)

### Purpose
The Command Center serves as a hub for managing and interacting with AI agents. It provides a modern, card-based interface for accessing different AI agents and their capabilities.

### Technical Implementation

#### 1. Component Structure

##### Agent Data Model
```typescript
interface Agent {
  id: string
  name: string
  role: 'chief' | 'agent'
  description: string
  image: string
  status: 'active' | 'inactive'
}
```

##### Layout Components
- Responsive grid layout (1 column on mobile, 2 columns on desktop)
- Header with title
- Agent cards with hover effects
- Status indicators for each agent

#### 2. Interactive Features

##### Agent Cards
- Hover animations using Framer Motion
- Status indicator (green dot for active agents)
- Role badges with contextual styling
- Dynamic routing to individual agent pages
- Smooth scale and border animations on hover

##### Responsive Design
- Mobile-first approach
- Grid layout adapts to screen size
- Consistent spacing and typography
- Optimized touch targets for mobile

#### 3. Styling Details
- Dark theme with zinc color palette
- Consistent border radiuses
- Subtle hover transitions
- High contrast for accessibility
- Status indicators with semantic colors

### State Management
- Local hover state using React useState
- Framer Motion for animation states
- Route state handled by Next.js

### Directory Structure
```
commandcenter/
├── page.tsx           # Main command center view
└── [agentId]/        # Dynamic routes for individual agents
    └── page.tsx      # Individual agent pages
```

### Performance Optimizations
1. Client-side Component
   - Uses 'use client' directive
   - Optimized for interactivity
   - Smooth animations

2. Image Optimization
   - Next.js Image component
   - Proper sizing for avatars
   - Rounded corners for performance

### Future Enhancements
1. Real-time agent status updates
2. Agent search functionality
3. Filtering by role/status
4. Activity logs
5. Agent configuration interface 