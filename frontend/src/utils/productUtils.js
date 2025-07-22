// frontend/src/utils/productUtils.js

/**
 * Utility functions for product management
 */

// Format price in KES currency
export const formatKES = (amount) => {
  if (!amount && amount !== 0) return 'KES 0';
  
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return 'KES 0';
  
  return `KES ${numAmount.toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  })}`;
};

// Format compact currency (e.g., KES 1.2K, KES 2.5M)
export const formatCompactKES = (amount) => {
  if (!amount && amount !== 0) return 'KES 0';
  
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return 'KES 0';
  
  if (numAmount >= 1000000) {
    return `KES ${(numAmount / 1000000).toFixed(1)}M`;
  } else if (numAmount >= 1000) {
    return `KES ${(numAmount / 1000).toFixed(1)}K`;
  } else {
    return `KES ${numAmount.toLocaleString()}`;
  }
};

// Get product status configuration
export const getProductStatusConfig = (status) => {
  const statusMap = {
    active: {
      label: 'Active',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: 'check-circle',
      description: 'Product is live and available for purchase'
    },
    inactive: {
      label: 'Inactive',
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: 'x-circle',
      description: 'Product is hidden from customers'
    },
    draft: {
      label: 'Draft',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: 'clock',
      description: 'Product is being prepared for launch'
    },
    out_of_stock: {
      label: 'Out of Stock',
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: 'package',
      description: 'Product is temporarily unavailable'
    }
  };

  return statusMap[status?.toLowerCase()] || {
    label: status || 'Unknown',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: 'help-circle',
    description: 'Unknown status'
  };
};

// Get stock status configuration
export const getStockStatusConfig = (stock, lowStockThreshold = 10) => {
  if (stock === 0) {
    return {
      label: 'Out of Stock',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: 'x-circle',
      level: 'critical'
    };
  } else if (stock <= lowStockThreshold) {
    return {
      label: 'Low Stock',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      icon: 'alert-triangle',
      level: 'warning'
    };
  } else {
    return {
      label: 'In Stock',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: 'check-circle',
      level: 'good'
    };
  }
};

// Generate product URL slug
export const generateProductSlug = (name) => {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/(^-|-$)/g, ''); // Remove leading/trailing hyphens
};

// Validate product data
export const validateProduct = (product) => {
  const errors = [];

  // Required fields
  if (!product.product_name?.trim()) {
    errors.push('Product name is required');
  }

  if (!product.product_description?.trim()) {
    errors.push('Product description is required');
  }

  if (!product.category) {
    errors.push('Category is required');
  }

  if (!product.product_price || parseFloat(product.product_price) <= 0) {
    errors.push('Valid price is required');
  }

  if (product.stock === undefined || parseInt(product.stock) < 0) {
    errors.push('Valid stock quantity is required');
  }

  // Sale price validation
  if (product.isOnSale && product.salePrice) {
    const regularPrice = parseFloat(product.product_price);
    const salePrice = parseFloat(product.salePrice);
    
    if (salePrice >= regularPrice) {
      errors.push('Sale price must be less than regular price');
    }
  }

  // Meta title length
  if (product.metaTitle && product.metaTitle.length > 60) {
    errors.push('Meta title must be 60 characters or less');
  }

  // Meta description length
  if (product.metaDescription && product.metaDescription.length > 160) {
    errors.push('Meta description must be 160 characters or less');
  }

  return errors;
};

// Calculate discount percentage
export const calculateDiscountPercentage = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice || salePrice >= originalPrice) return 0;
  
  const discount = ((originalPrice - salePrice) / originalPrice) * 100;
  return Math.round(discount);
};

// Get product image URL (with fallback)
export const getProductImageUrl = (product, size = 'medium') => {
  // Size configurations
  const sizeMap = {
    small: { w: 150, h: 150 },
    medium: { w: 400, h: 400 },
    large: { w: 800, h: 800 }
  };

  const dimensions = sizeMap[size] || sizeMap.medium;
  
  // Get primary image
  const imageUrl = product.mainImage || 
                   product.product_image || 
                   (product.images && product.images[0]?.url);

  if (!imageUrl) {
    // Return placeholder image URL
    return `https://via.placeholder.com/${dimensions.w}x${dimensions.h}/f3f4f6/9ca3af?text=No+Image`;
  }

  // If it's a Cloudinary URL, add transformations
  if (imageUrl.includes('cloudinary.com')) {
    const baseUrl = imageUrl.split('/upload/')[0] + '/upload/';
    const imagePath = imageUrl.split('/upload/')[1];
    const transformation = `w_${dimensions.w},h_${dimensions.h},c_fill,q_auto,f_auto/`;
    
    return baseUrl + transformation + imagePath;
  }

  return imageUrl;
};

// Sort products by various criteria
export const sortProducts = (products, sortBy, sortOrder = 'asc') => {
  const sortedProducts = [...products];

  sortedProducts.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'product_name':
        aValue = a.product_name?.toLowerCase() || '';
        bValue = b.product_name?.toLowerCase() || '';
        break;
      
      case 'product_price':
        aValue = parseFloat(a.product_price) || 0;
        bValue = parseFloat(b.product_price) || 0;
        break;
      
      case 'stock':
        aValue = parseInt(a.stock) || 0;
        bValue = parseInt(b.stock) || 0;
        break;
      
      case 'createdAt':
        aValue = new Date(a.createdAt || 0);
        bValue = new Date(b.createdAt || 0);
        break;
      
      case 'rating':
        aValue = parseFloat(a.rating?.average) || 0;
        bValue = parseFloat(b.rating?.average) || 0;
        break;
      
      case 'sales':
        aValue = parseInt(a.salesCount) || 0;
        bValue = parseInt(b.salesCount) || 0;
        break;
      
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sortedProducts;
};

// Filter products
export const filterProducts = (products, filters) => {
  return products.filter(product => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchFields = [
        product.product_name,
        product.product_description,
        product.product_brand,
        product.category?.name,
        ...(product.tags || [])
      ].join(' ').toLowerCase();
      
      if (!searchFields.includes(searchTerm)) {
        return false;
      }
    }

    // Category filter
    if (filters.category && product.category?._id !== filters.category) {
      return false;
    }

    // Status filter
    if (filters.status && product.status !== filters.status) {
      return false;
    }

    // Price range filter
    if (filters.minPrice !== undefined) {
      const price = parseFloat(product.product_price) || 0;
      if (price < filters.minPrice) return false;
    }

    if (filters.maxPrice !== undefined) {
      const price = parseFloat(product.product_price) || 0;
      if (price > filters.maxPrice) return false;
    }

    // Stock filter
    if (filters.stockStatus) {
      const stock = parseInt(product.stock) || 0;
      const threshold = parseInt(product.lowStockThreshold) || 10;
      
      switch (filters.stockStatus) {
        case 'in_stock':
          if (stock <= threshold) return false;
          break;
        case 'low_stock':
          if (stock === 0 || stock > threshold) return false;
          break;
        case 'out_of_stock':
          if (stock > 0) return false;
          break;
      }
    }

    // Featured filter
    if (filters.featured !== undefined && product.isFeatured !== filters.featured) {
      return false;
    }

    // On sale filter
    if (filters.onSale !== undefined && product.isOnSale !== filters.onSale) {
      return false;
    }

    return true;
  });
};

// Get product analytics summary
export const getProductAnalytics = (products) => {
  const analytics = {
    total: products.length,
    active: 0,
    inactive: 0,
    draft: 0,
    outOfStock: 0,
    lowStock: 0,
    featured: 0,
    onSale: 0,
    totalValue: 0,
    averagePrice: 0,
    totalStock: 0
  };

  let totalPrice = 0;
  let totalStock = 0;

  products.forEach(product => {
    const price = parseFloat(product.product_price) || 0;
    const stock = parseInt(product.stock) || 0;
    const threshold = parseInt(product.lowStockThreshold) || 10;

    // Status counts
    switch (product.status) {
      case 'active':
        analytics.active++;
        break;
      case 'inactive':
        analytics.inactive++;
        break;
      case 'draft':
        analytics.draft++;
        break;
    }

    // Stock analysis
    if (stock === 0) {
      analytics.outOfStock++;
    } else if (stock <= threshold) {
      analytics.lowStock++;
    }

    // Feature flags
    if (product.isFeatured) analytics.featured++;
    if (product.isOnSale) analytics.onSale++;

    // Financial calculations
    analytics.totalValue += price * stock;
    totalPrice += price;
    totalStock += stock;
  });

  analytics.averagePrice = products.length > 0 ? totalPrice / products.length : 0;
  analytics.totalStock = totalStock;

  return analytics;
};

// Export date formatters
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Africa/Nairobi'
  };

  return dateObj.toLocaleDateString('en-KE', { ...defaultOptions, ...options });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Nairobi'
  });
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now - dateObj) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(dateObj);
};

export default {
  formatKES,
  formatCompactKES,
  getProductStatusConfig,
  getStockStatusConfig,
  generateProductSlug,
  validateProduct,
  calculateDiscountPercentage,
  getProductImageUrl,
  sortProducts,
  filterProducts,
  getProductAnalytics,
  formatDate,
  formatDateTime,
  formatRelativeTime
};