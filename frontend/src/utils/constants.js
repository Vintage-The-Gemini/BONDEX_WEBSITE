// frontend/src/utils/constants.js

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const PRODUCT_CATEGORIES = {
  HEAD: 'Head Protection',
  EYE: 'Eye Protection', 
  HAND: 'Hand Protection',
  FOOT: 'Foot Protection',
  RESPIRATORY: 'Respiratory Protection'
};

export const INDUSTRIES = {
  CONSTRUCTION: 'Construction',
  MEDICAL: 'Medical',
  MANUFACTURING: 'Manufacturing',
  MINING: 'Mining'
};

export const CURRENCY = 'KSh';

export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};
