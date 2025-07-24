// frontend/src/utils/tokenValidator.js

// Utility to decode JWT token (client-side only for debugging)
export const decodeJWT = (token) => {
  try {
    if (!token) return null;
    
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    
    return {
      ...decoded,
      isExpired: decoded.exp ? Date.now() >= decoded.exp * 1000 : false,
      expiresAt: decoded.exp ? new Date(decoded.exp * 1000) : null,
      issuedAt: decoded.iat ? new Date(decoded.iat * 1000) : null
    };
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Check if token is valid format and not expired
export const isTokenValid = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) return false;
  
  return !decoded.isExpired;
};

// Clean invalid tokens from localStorage
export const cleanInvalidTokens = () => {
  const token = localStorage.getItem('adminToken');
  const user = localStorage.getItem('adminUser');
  
  if (token && !isTokenValid(token)) {
    console.log('🧹 Cleaning expired token from localStorage');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    return true; // Token was cleaned
  }
  
  return false; // Token is valid or doesn't exist
};

// Get token info for debugging
export const getTokenInfo = () => {
  const token = localStorage.getItem('adminToken');
  const user = localStorage.getItem('adminUser');
  
  if (!token) {
    return {
      hasToken: false,
      hasUser: !!user,
      message: 'No token found'
    };
  }
  
  const decoded = decodeJWT(token);
  
  return {
    hasToken: true,
    hasUser: !!user,
    isValid: !decoded?.isExpired,
    isExpired: decoded?.isExpired,
    expiresAt: decoded?.expiresAt,
    issuedAt: decoded?.issuedAt,
    userId: decoded?.id,
    tokenPreview: token.substring(0, 20) + '...',
    decoded
  };
};