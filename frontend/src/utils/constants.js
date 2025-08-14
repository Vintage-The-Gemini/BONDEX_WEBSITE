// File Path: frontend/src/utils/constants.js

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// App Constants
export const APP_NAME = 'Bondex Safety'
export const CURRENCY = 'KSh'

// Protection Types
export const PROTECTION_TYPES = [
  'Head Protection',
  'Foot Protection',
  'Eye Protection', 
  'Hand Protection',
  'Breathing Protection',
  'Body Protection'
]

// Industries
export const INDUSTRIES = [
  'Construction',
  'Manufacturing',
  'Healthcare',
  'Mining',
  'Oil & Gas',
  'Agriculture'
]

// Colors
export const COLORS = {
  primary: '#f97316',
  secondary: '#facc15',
  dark: '#0f172a',
  success: '#22c55e',
  error: '#ef4444'
}
