import { clsx } from 'clsx'

export const Spinner = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  }

  return (
    <div className={clsx('animate-spin rounded-full border-b-2 border-primary-600', sizes[size], className)} />
  )
}

export const LoadingCard = ({ className }) => {
  return (
    <div className={clsx('animate-pulse', className)}>
      <div className="bg-gray-200 h-48 rounded-t-lg"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  )
}

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner size="xl" />
        <p className="mt-4 text-gray-600">Loading Bondex Safety...</p>
      </div>
    </div>
  )
}