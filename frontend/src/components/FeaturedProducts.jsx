// frontend/src/components/FeaturedProducts.jsx
import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Eye, Heart, ArrowRight, Shield, Truck, Award } from 'lucide-react';

const FeaturedProducts = ({ onOpenProductModal, onAddToCart }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch featured products from your backend
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products?isFeatured=true&limit=8&status=active');
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured products');
        }

        const result = await response.json();
        if (result.success) {
          setFeaturedProducts(result.data || []);
        } else {
          throw new Error(result.message || 'Failed to load products');
        }
      } catch (err) {
        console.error('Featured products fetch error:', err);
        setError(err.message);
        // Fallback to sample data if API fails
        setFeaturedProducts(getSampleProducts());
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Sample products as fallback
  const getSampleProducts = () => [
    {
      _id: 'sample-1',
      product_name: 'Professional Safety Helmet',
      product_description: 'Heavy-duty construction helmet with adjustable suspension',
      product_price: 2500,
      category: 'Head Protection',
      product_brand: 'SafeGuard Pro',
      product_images: ['https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop'],
      averageRating: 4.8,
      reviewCount: 24,
      stock: 45,
      isFeatured: true,
      isOnSale: false
    },
    {
      _id: 'sample-2',
      product_name: 'Medical Face Masks N95',
      product_description: 'CDC approved N95 respirator masks for medical use',
      product_price: 150,
      category: 'Face Protection', 
      product_brand: 'MedSafe',
      product_images: ['https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=300&h=300&fit=crop'],
      averageRating: 4.9,
      reviewCount: 156,
      stock: 200,
      isFeatured: true,
      isOnSale: true,
      originalPrice: 200
    },
    {
      _id: 'sample-3',
      product_name: 'Steel Toe Safety Boots',
      product_description: 'Waterproof steel toe boots with slip-resistant sole',
      product_price: 4500,
      category: 'Foot Protection',
      product_brand: 'ToughStep',
      product_images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop'],
      averageRating: 4.7,
      reviewCount: 89,
      stock: 30,
      isFeatured: true,
      isOnSale: false
    },
    {
      _id: 'sample-4',
      product_name: 'Safety Goggles Clear',
      product_description: 'Anti-fog safety goggles with UV protection',
      product_price: 800,
      category: 'Eye Protection',
      product_brand: 'ClearVision',
      product_images: ['https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=300&h=300&fit=crop'],
      averageRating: 4.6,
      reviewCount: 67,
      stock: 85,
      isFeatured: true,
      isOnSale: true,
      originalPrice: 1000
    },
    {
      _id: 'sample-5',
      product_name: 'High-Vis Safety Vest',
      product_description: 'Reflective safety vest with multiple pockets',
      product_price: 1200,
      category: 'Body Protection',
      product_brand: 'VisiSafe',
      product_images: ['https://images.unsplash.com/photo-1594608661623-4b64b4de8e63?w=300&h=300&fit=crop'],
      averageRating: 4.5,
      reviewCount: 43,
      stock: 60,
      isFeatured: true,
      isOnSale: false
    },
    {
      _id: 'sample-6',
      product_name: 'Work Gloves Heavy Duty',
      product_description: 'Cut-resistant work gloves with grip coating',
      product_price: 350,
      category: 'Hand Protection',
      product_brand: 'GripMaster',
      product_images: ['https://images.unsplash.com/photo-1559226947-8cffc3a59d82?w=300&h=300&fit=crop'],
      averageRating: 4.4,
      reviewCount: 78,
      stock: 120,
      isFeatured: true,
      isOnSale: true,
      originalPrice: 450
    }
  ];

  // Get default image based on category
  const getDefaultImage = (category, productName) => {
    const categoryLower = (typeof category === 'object' ? category.name : category)?.toLowerCase() || '';
    
    if (categoryLower.includes('head') || categoryLower.includes('helmet')) {
      return 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop&auto=format';
    } else if (categoryLower.includes('face') || categoryLower.includes('mask')) {
      return 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=300&h=300&fit=crop&auto=format';
    } else if (categoryLower.includes('foot') || categoryLower.includes('boot')) {
      return 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&auto=format';
    } else if (categoryLower.includes('eye') || categoryLower.includes('goggle')) {
      return 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=300&h=300&fit=crop&auto=format';
    } else if (categoryLower.includes('hand') || categoryLower.includes('glove')) {
      return 'https://images.unsplash.com/photo-1559226947-8cffc3a59d82?w=300&h=300&fit=crop&auto=format';
    } else if (categoryLower.includes('body') || categoryLower.includes('vest')) {
      return 'https://images.unsplash.com/photo-1594608661623-4b64b4de8e63?w=300&h=300&fit=crop&auto=format';
    } else {
      // Default safety equipment image
      return 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=300&h=300&fit=crop&auto=format';
    }
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Render star rating
  const renderStars = (rating, reviewCount) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 fill-yellow-400/50 text-yellow-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return (
      <div className="flex items-center space-x-1">
        <div className="flex">{stars}</div>
        <span className="text-sm text-gray-500">({reviewCount})</span>
      </div>
    );
  };

  // Handle add to cart
  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart({
        id: product._id,
        name: product.product_name,
        price: product.product_price,
        image: product.product_images?.[0],
        brand: product.product_brand,
        quantity: 1
      });
    }
  };

  // Handle product view
  const handleViewProduct = (product) => {
    if (onOpenProductModal) {
      onOpenProductModal(product);
    }
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && featuredProducts.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 mb-8">
            Unable to load featured products at the moment. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our most popular safety equipment, trusted by professionals across Kenya. 
            Quality gear that doesn't compromise on protection.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 cursor-pointer group"
              onClick={() => handleViewProduct(product)}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={product.product_images?.[0] || getDefaultImage(product.category, product.product_name)}
                  alt={product.product_name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback to default image if original fails to load
                    e.target.src = getDefaultImage(product.category, product.product_name);
                  }}
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  {product.isFeatured && (
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                  {product.isOnSale && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Sale
                    </span>
                  )}
                  {product.stock < 10 && (
                    <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      Low Stock
                    </span>
                  )}
                </div>

                {/* Hover Actions */}
                <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewProduct(product);
                    }}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title="Quick View"
                  >
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title="Add to Wishlist"
                  >
                    <Heart className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Stock Level Indicator */}
                {product.stock < 5 && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-red-500/90 text-white text-xs px-2 py-1 rounded text-center">
                      Only {product.stock} left!
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-6">
                {/* Brand */}
                <div className="text-sm text-gray-500 mb-1">{product.product_brand}</div>
                
                {/* Product Name */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.product_name}
                </h3>

                {/* Category */}
                <div className="text-sm text-blue-600 mb-2">
                  {typeof product.category === 'object' ? product.category.name : product.category}
                </div>

                {/* Rating */}
                {product.averageRating && (
                  <div className="mb-3">
                    {renderStars(product.averageRating, product.reviewCount || 0)}
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-gray-900">
                      {formatPrice(product.product_price)}
                    </span>
                    {product.isOnSale && product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.isOnSale && product.originalPrice && (
                    <span className="text-sm font-medium text-red-600">
                      Save {Math.round(((product.originalPrice - product.product_price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart(product, e)}
                  disabled={product.stock === 0}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center">
          <a
            href="/products"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <span>View All Products</span>
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>

        {/* Trust Signals */}
        <div className="mt-16 bg-white rounded-xl p-8 shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Certified Quality</h3>
              <p className="text-gray-600">
                All products meet international safety standards and certifications
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Free delivery within Nairobi, nationwide shipping available
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-yellow-100 p-4 rounded-full mb-4">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600">
                Professional guidance to help you choose the right equipment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;