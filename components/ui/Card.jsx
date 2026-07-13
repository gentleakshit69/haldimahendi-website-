'use client'

import { cn } from '@/lib/utils'

const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'bg-card text-card-foreground rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ children, className }) => {
  return <div className={cn('p-6 pb-4', className)}>{children}</div>
}

const CardTitle = ({ children, className }) => {
  return <h3 className={cn('text-2xl font-bold text-foreground', className)}>{children}</h3>
}

const CardContent = ({ children, className }) => {
  return <div className={cn('p-6 pt-2', className)}>{children}</div>
}

const CardFooter = ({ children, className }) => {
  return <div className={cn('p-6 pt-4 border-t border-border flex gap-3', className)}>{children}</div>
}

export { Card, CardHeader, CardTitle, CardContent, CardFooter }
export default Card
