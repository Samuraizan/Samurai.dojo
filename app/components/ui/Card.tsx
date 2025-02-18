interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`rounded-lg border bg-white p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
} 