// frontend/src/utils/formatters.js

export const formatPrice = (price) => {
  return KSh ;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatPhoneNumber = (phone) => {
  // Format to +254 XXX XXX XXX
  if (phone.startsWith('0')) {
    return +254   ;
  }
  return phone;
};

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
