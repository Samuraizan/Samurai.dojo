import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow',
        className
      )}
      {...props}
    />
  )
} 