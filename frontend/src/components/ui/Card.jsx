import { clsx } from 'clsx'

export const Card = ({ children, variant = 'default', className, ...props }) => {
  const variants = {
    default: 'bg-white border-gray-200',
    green: 'bg-white border-primary-200 shadow-green-glow',
    yellow: 'bg-white border-secondary-200 shadow-yellow-glow',
    black: 'bg-gray-900 border-gray-700 text-white'
  }

  return (
    <div 
      className={clsx(
        'rounded-lg shadow-soft border overflow-hidden',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader = ({ children, variant = 'default', className, ...props }) => {
  const variants = {
    default: 'bg-gray-50 border-gray-200',
    green: 'bg-primary-50 border-primary-200 text-primary-800',
    yellow: 'bg-secondary-50 border-secondary-200 text-secondary-800',
    black: 'bg-gray-800 border-gray-600 text-white'
  }

  return (
    <div 
      className={clsx(
        'px-6 py-4 border-b',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardBody = ({ children, className, ...props }) => {
  return (
    <div 
      className={clsx('px-6 py-4', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardFooter = ({ children, variant = 'default', className, ...props }) => {
  const variants = {
    default: 'bg-gray-50 border-gray-200',
    green: 'bg-primary-50 border-primary-200',
    yellow: 'bg-secondary-50 border-secondary-200',
    black: 'bg-gray-800 border-gray-600'
  }

  return (
    <div 
      className={clsx(
        'px-6 py-4 border-t',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}