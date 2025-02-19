# Components Documentation

## Overview

The components in Samurai Dojo are organized following atomic design principles and feature-based architecture. This documentation provides detailed information about each component category and their usage patterns.

## Component Categories

### 1. Agent Components
Located in `app/components/agents/`
```
agents/
├── AgentCard/           # Individual agent display
├── AgentList/          # Agent collection display
├── AgentControls/      # Agent interaction controls
└── AgentStatus/        # Agent state indicators
```

### 2. Chat Components
Located in `app/components/chat/`
```
chat/
├── ChatWindow/         # Main chat interface
├── MessageList/        # Message display
├── InputArea/          # Message input
└── ChatControls/       # Chat functionality controls
```

### 3. Layout Components
Located in `app/components/layout/`
```
layout/
├── Header/            # Application header
├── Footer/            # Application footer
├── Sidebar/           # Navigation sidebar
└── MainContent/       # Content wrapper
```

### 4. Skills Components
Located in `app/components/skills/`
```
skills/
├── SkillCard/         # Individual skill display
├── SkillTree/         # Skill hierarchy view
├── SkillProgress/     # Progress tracking
└── SkillActions/      # Skill interaction
```

### 5. UI Components
Located in `app/components/ui/`
```
ui/
├── Button/            # Button variants
├── Input/             # Input elements
├── Card/              # Card containers
├── Modal/             # Modal dialogs
└── Typography/        # Text elements
```

## Component Guidelines

### 1. Component Structure
Each component should follow this structure:
```typescript
// Component.tsx
import { FC } from 'react'
import styles from './Component.module.css'

interface ComponentProps {
  // Props definition
}

export const Component: FC<ComponentProps> = ({
  // Props destructuring
}) => {
  // Component logic
  return (
    // JSX
  )
}
```

### 2. Styling Approach
- Tailwind CSS for utility-first styling
- CSS Modules for component-specific styles
- Global styles for theme variables

### 3. State Management
- Local state using useState
- Complex state using useReducer
- Global state using Context API
- Side effects using useEffect

### 4. Props Interface
- Clear prop interfaces
- Required vs optional props
- Proper TypeScript types
- Default prop values

### 5. Performance Optimization
- Memoization (useMemo, useCallback)
- Code splitting
- Lazy loading
- Performance monitoring

## Best Practices

1. **Component Organization**
   - One component per file
   - Clear file naming
   - Consistent directory structure
   - Index files for exports

2. **Code Style**
   - Consistent formatting
   - Clear variable names
   - Proper commenting
   - Type safety

3. **Testing**
   - Unit tests
   - Integration tests
   - Snapshot tests
   - Performance tests

4. **Documentation**
   - Component description
   - Props documentation
   - Usage examples
   - Edge cases

## Component Examples

### Basic Component
```typescript
import { FC } from 'react'

interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

export const Button: FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary'
}) => {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
```

### Complex Component
```typescript
import { FC, useEffect, useState } from 'react'

interface DataDisplayProps {
  fetchData: () => Promise<any>
  renderItem: (item: any) => JSX.Element
}

export const DataDisplay: FC<DataDisplayProps> = ({
  fetchData,
  renderItem
}) => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData()
        setData(result)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [fetchData])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="data-display">
      {data.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
    </div>
  )
}
```

## Related Documentation

- [UI Components](./ui.md)
- [Layout System](./layout.md)
- [Agents](./agents.md)
- [Chat System](./chat.md)
- [Skills Framework](./skills.md) 