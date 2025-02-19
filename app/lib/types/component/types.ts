/**
 * Component Type System
 * Core type definitions for React components
 */

import type { ReactNode } from 'react'

/**
 * Base props for motion components
 */
export interface MotionProps {
  /** Child elements */
  children: ReactNode
  /** Optional className for styling */
  className?: string
  /** Initial animation state */
  initial?: Record<string, number | string>
  /** Animation target state */
  animate?: Record<string, number | string>
  /** Animation transition configuration */
  transition?: Record<string, number | string>
}

/**
 * Props for section components
 */
export interface SectionProps {
  /** Child elements */
  children: ReactNode
  /** Optional className for styling */
  className?: string
  /** Optional section ID */
  id?: string
  /** Whether section is full height */
  fullHeight?: boolean
}

/**
 * Props for layout components
 */
export interface LayoutProps {
  /** Child elements */
  children: ReactNode
  /** Optional className for styling */
  className?: string
  /** Optional header content */
  header?: ReactNode
  /** Optional footer content */
  footer?: ReactNode
  /** Optional sidebar content */
  sidebar?: ReactNode
}

/**
 * Props for card components
 */
export interface CardProps {
  /** Card title */
  title?: string
  /** Card content */
  children: ReactNode
  /** Optional className for styling */
  className?: string
  /** Whether card is clickable */
  clickable?: boolean
  /** Optional click handler */
  onClick?: () => void
  /** Optional hover effect */
  hoverEffect?: boolean
}

/**
 * Props for button components
 */
export interface ButtonProps {
  /** Button label */
  label: string
  /** Click handler */
  onClick: () => void
  /** Optional className for styling */
  className?: string
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost'
  /** Whether button is disabled */
  disabled?: boolean
  /** Whether button is loading */
  loading?: boolean
  /** Optional icon */
  icon?: ReactNode
  /** Whether icon is on the right */
  iconRight?: boolean
}

/**
 * Props for input components
 */
export interface InputProps {
  /** Input value */
  value: string
  /** Change handler */
  onChange: (value: string) => void
  /** Optional className for styling */
  className?: string
  /** Input placeholder */
  placeholder?: string
  /** Whether input is disabled */
  disabled?: boolean
  /** Input type */
  type?: 'text' | 'password' | 'email' | 'number'
  /** Error message */
  error?: string
  /** Helper text */
  helper?: string
  /** Whether input is required */
  required?: boolean
}

/**
 * Props for modal components
 */
export interface ModalProps {
  /** Whether modal is open */
  isOpen: boolean
  /** Close handler */
  onClose: () => void
  /** Modal title */
  title: string
  /** Modal content */
  children: ReactNode
  /** Optional className for styling */
  className?: string
  /** Whether to show close button */
  showClose?: boolean
  /** Whether modal is fullscreen */
  fullscreen?: boolean
  /** Whether to disable background click */
  disableBackgroundClick?: boolean
} 