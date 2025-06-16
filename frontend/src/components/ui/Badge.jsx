import { clsx } from 'clsx'

const Badge = ({ children, variant = 'default', size = 'md', className, ...props }) => {
  const baseClasses = 'inline-flex items-center rounded-full font-medium'
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success-100 text-success-800',
    danger: 'bg-danger-100 text-danger-800',
    warning: 'bg-warning-100 text-warning-800',
    // Safety Equipment Categories
    head: 'bg-primary-100 text-primary-800',
    foot: 'bg-secondary-100 text-secondary-800',
    eye: 'bg-accent-100 text-accent-800',
    hand: 'bg-warning-100 text-warning-800',
    breathing: 'bg-success-100 text-success-800'
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  return (
    <span
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge