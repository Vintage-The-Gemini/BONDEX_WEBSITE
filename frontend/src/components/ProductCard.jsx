// frontend/src/components/ProductCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';

const ProductCard = ({ product, viewMode = 'grid', onAddToCart, onViewProduct }) => {
  const [imageError, setImageError] = useState(false);
  
  // Extract product data (handle different field names from your backend)
  const productName = product.product_name || product.name;
  const productDescription = product.product_description || product.description;
  const productPrice = product.product_price || product.price;
  const productBrand = product.product_brand || product.brand;
  const rating = product.average_rating || product.rating || 0;
  const reviews = product.total_reviews || product.reviews || 0;
  const stock = product.stock_quantity || product.stock || 0;
  const category = product.category || product.primaryCategory?.name || '';
  
  // Get image from database (already stored as full Cloudinary URLs)
  const getProductImageUrl = () => {
    // Debug logging for this specific product
    console.log(`🖼️ Image debug for product: ${productName}`);
    console.log('product.product_images:', product.product_images);
    console.log('product.images:', product.images);
    console.log('product.image:', product.image);
    console.log('product.product_image:', product.product_image);
    console.log('product.imageUrl:', product.imageUrl);
    
    // Your images are already stored as full Cloudinary URLs in the database
    let imageUrl = null;
    
    // Check all possible image field names from your database
    if (product.product_images && Array.isArray(product.product_images) && product.product_images.length > 0) {
      imageUrl = product.product_images[0];
      console.log('✅ Found in product_images[0]:', imageUrl);
    } else if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      imageUrl = product.images[0];
      console.log('✅ Found in images[0]:', imageUrl);
    } else if (product.image) {
      imageUrl = product.image;
      console.log('✅ Found in image:', imageUrl);
    } else if (product.product_image) {
      imageUrl = product.product_image;
      console.log('✅ Found in product_image:', imageUrl);
    } else if (product.imageUrl) {
      imageUrl = product.imageUrl;
      console.log('✅ Found in imageUrl:', imageUrl);
    }
    
    // Add type checking and validation
    if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) {
      console.log('✅ Using database image URL:', imageUrl);
      return imageUrl.trim();
    } else if (imageUrl && typeof imageUrl === 'object') {
      // Handle case where image might be an object with url property
      const urlFromObject = imageUrl.url || imageUrl.secure_url || imageUrl.path;
      if (urlFromObject && typeof urlFromObject === 'string' && urlFromObject.trim()) {
        console.log('✅ Using image URL from object:', urlFromObject);
        return urlFromObject.trim();
      }
      console.log('❌ Image object found but no valid URL property:', imageUrl);
    } else {
      console.log('❌ Invalid image URL type:', typeof imageUrl, imageUrl);
    }
    
    // If no valid image found, use category fallback
    console.log('⚠️ No valid image found, using fallback for category:', category);
    return getFallbackImageByCategory(category);
  };
  
  // Fallback images by category (using your orange/yellow theme)
  const getFallbackImageByCategory = (categoryName) => {
    const fallbacks = {
      'Head Protection': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=400&fit=crop',
      'Eye Protection': 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=400&h=400&fit=crop',
      'Hand Protection': 'https://images.unsplash.com/photo-1559226947-8cffc3a59d82?w=400&h=400&fit=crop',
      'Foot Protection': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      'Breathing Protection': 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=400&h=400&fit=crop',
      'High-Vis Clothing': 'https://images.unsplash.com/photo-1594608661623-4b64b4de8e63?w=400&h=400&fit=crop',
      'Workwear & Clothing': 'https://images.unsplash.com/photo-1594608661623-4b64b4de8e63?w=400&h=400&fit=crop'
    };
    return fallbacks[categoryName] || 'https://images.unsplash.com/photo-1581594549595-35f6edc7b762?w=400&h=400&fit=crop';
  };

  const imageUrl = imageError ? getFallbackImageByCategory(category) : getProductImageUrl();

  // List View Layout
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow p-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20 flex-shrink-0">
            <img 
              src={imageUrl}
              alt={productName}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover rounded-lg"
            />
            {stock === 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <span className="text-white text-xs font-semibold">Out</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <Link to={`/products/${product._id}`}>
              <h3 className="font-semibold text-gray-900 mb-1 hover:text-orange-600 transition-colors truncate">
                {productName}
              </h3>
            </Link>
            {productBrand && (
              <p className="text-xs text-gray-500 mb-1">{productBrand}</p>
            )}
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{productDescription}</p>
            
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold text-orange-600">
                KES {productPrice?.toLocaleString()}
              </span>
              
              {rating > 0 && (
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-current' : ''}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-1">({reviews})</span>
                </div>
              )}
            </div>
            
            {stock <= 5 && stock > 0 && (
              <p className="text-sm text-orange-600 mt-1">Only {stock} left in stock</p>
            )}
            {stock === 0 && (
              <p className="text-sm text-red-600 mt-1">Out of stock</p>
            )}
          </div>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={stock === 0}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex-shrink-0"
          >
            {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    );
  }

  // Grid View Layout
  return (
    <div className="bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300 group">
      <div className="relative">
        <Link to={`/products/${product._id}`}>
          <img 
            src={imageUrl}
            alt={productName}
            onError={() => setImageError(true)}
            className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        
        {/* Stock Overlay */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => onViewProduct && onViewProduct(product)}
              className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              title="Quick View"
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </button>
            <button
              className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              title="Add to Wishlist"
            >
              <Heart className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {productName}
          </h3>
        </Link>
        
        {productBrand && (
          <p className="text-xs text-gray-500 mb-2">{productBrand}</p>
        )}
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{productDescription}</p>
        
        {/* Rating */}
        {rating > 0 && (
          <div className="flex items-center mb-3">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-current' : ''}`} 
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">({reviews})</span>
          </div>
        )}

        {/* Stock Status */}
        {stock <= 5 && stock > 0 && (
          <p className="text-sm text-orange-600 mb-3">Only {stock} left in stock</p>
        )}
        
        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-orange-600">
            KES {productPrice?.toLocaleString()}
          </span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={stock === 0}
            className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            title="Add to Cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;