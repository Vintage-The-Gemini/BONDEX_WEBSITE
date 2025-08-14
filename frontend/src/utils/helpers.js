// File Path: frontend/src/utils/helpers.js

// Format price in KES
export const formatPrice = (amount) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0
  }).format(amount)
}

// Format date
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-KE').format(new Date(date))
}

// Generate slug
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

// Truncate text
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}
