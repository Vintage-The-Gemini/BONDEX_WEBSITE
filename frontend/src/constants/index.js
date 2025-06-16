export * from './categories'
export * from './industries'
export * from './routes'

export const APP_CONFIG = {
  name: 'Bondex Safety Equipment Store',
  description: 'Professional safety equipment for medical, construction, and manufacturing industries',
  version: '1.0.0',
  author: 'Bondex Safety',
  contact: {
    phone: '1-800-BONDEX',
    email: 'info@bondex.com',
    address: '123 Safety Street, Protection City, PC 12345'
  },
  social: {
    facebook: 'https://facebook.com/bondexsafety',
    twitter: 'https://twitter.com/bondexsafety',
    linkedin: 'https://linkedin.com/company/bondexsafety'
  }
}

export const API_ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  AUTH: '/auth',
  PRODUCTS: '/products',
  ORDERS: '/orders',
  USERS: '/users',
  ADMIN: '/admin',
  CATEGORIES: '/categories',
  INDUSTRIES: '/industries'
}