'use client'

import { cn } from '@/lib/utils'
import React from 'react'

const Button = React.forwardRef(
  ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    disabled = false,
    asChild = false,
    ...props
  }, ref) => {
    const baseClasses =
      'font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary inline-flex items-center justify-center'

    const variants = {
      primary: 'bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20',
      secondary: 'bg-secondary text-secondary-foreground hover:shadow-lg hover:shadow-secondary/20',
      outline:
        'border-2 border-primary text-primary hover:bg-primary/10 hover:border-primary/80',
      ghost: 'text-foreground hover:bg-muted/50',
      danger: 'bg-destructive text-white hover:shadow-lg hover:shadow-destructive/20',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''
    const classes = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      disabledClasses,
      className
    )

    if (asChild) {
      return React.cloneElement(children, {
        className: cn(classes, children.props.className),
        ...props,
      })
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
