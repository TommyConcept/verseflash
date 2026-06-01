import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'dark' | 'glass' | 'bordered'
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none'
}

export function Card({ className, variant = 'default', padding = 'md', children, ...props }: CardProps) {
  const variants = {
    default: 'bg-white border border-gray-100 shadow-sm',
    dark: 'bg-navy-800 border border-navy-700 text-white',
    glass: 'glass',
    bordered: 'bg-white border-2 border-navy-900',
  }

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  }

  return (
    <div
      className={cn('rounded-2xl', variants[variant], paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  )
}
