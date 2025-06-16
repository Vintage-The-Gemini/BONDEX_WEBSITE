import { clsx } from 'clsx'
import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label,
  error,
  helpText,
  className,
  ...props 
}, ref) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={clsx(
          'form-input',
          error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="form-error">{error}</p>
      )}
      {helpText && !error && (
        <p className="form-help">{helpText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input