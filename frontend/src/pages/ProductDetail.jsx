// frontend/src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Minus,
  Plus,
  Shield,
  Truck,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // API Base URL
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch product details
  useEffect(() => {
    if (id) {
      fetchProductDetail();
    }
  }, [id]);

  // Fetch related products when product is loaded
  useEffect(() => {
    if (product && product.category) {
      fetchRelatedProducts();
    }
  }, [product]);

  const fetchProductDetail = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE}/products/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Product detail response:', data);
      
      if (data.success) {
        setProduct(data.data || data.product);
      } else {
        throw new Error(data.message || 'Product not found');
      }
      
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(`Failed to load product: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      // Get category ID for related products query
      let categoryId = '';
      if (typeof product.category === 'object') {
        categoryId = product.category._id || product.category.name;
      } else {
        categoryId = product.category;
      }
      
      if (categoryId) {
        const response = await fetch(`${API_BASE}/products?category=${categoryId}&limit=4&exclude=${id}`);
        const data = await response.json();
        
        if (data.success) {
          setRelatedProducts(data.data || data.products || []);
        }
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  // Extract product data
  const productName = product?.product_name || product?.name;
  const productDescription = product?.product_description || product?.description;
  const productPrice = product?.product_price || product?.price;
  const productBrand = product?.product_brand || product?.brand;
  const rating = product?.average_rating || product?.rating || 0;
  const reviews = product?.total_reviews || product?.reviews || 0;
  const stock = product?.stock_quantity || product?.stock || 0;
  
  // Handle category - it might be an object or string
  const category = (() => {
    if (product?.category) {
      // If category is an object, get the name property
      if (typeof product.category === 'object') {
        return product.category.name || product.category._id || '';
      }
      // If category is a string, use it directly
      return product.category;
    }
    // Fallback to primaryCategory
    if (product?.primaryCategory) {
      if (typeof product.primaryCategory === 'object') {
        return product.primaryCategory.name || product.primaryCategory._id || '';
      }
      return product.primaryCategory;
    }
    return '';
  })();

  // Get product images
  const getProductImages = () => {
    let images = [];
    
    console.log('=== IMAGE DEBUG FOR PRODUCT ===');
    console.log('Product Name:', productName);
    console.log('Full Product Object:', product);
    console.log('product.product_images:', product?.product_images);
    console.log('product.images:', product?.images);
    console.log('product.image:', product?.image);
    console.log('product.product_image:', product?.product_image);
    console.log('product.imageUrl:', product?.imageUrl);
    
    // Check different possible image field names
    if (product?.product_images) {
      if (Array.isArray(product.product_images) && product.product_images.length > 0) {
        images = product.product_images;
        console.log('✅ Using product_images array:', images);
      } else if (typeof product.product_images === 'string' && product.product_images.trim()) {
        images = [product.product_images];
        console.log('✅ Using product_images string:', images);
      } else if (typeof product.product_images === 'object' && product.product_images.url) {
        images = [product.product_images.url];
        console.log('✅ Using product_images object URL:', images);
      }
    } else if (product?.images) {
      if (Array.isArray(product.images) && product.images.length > 0) {
        images = product.images;
        console.log('✅ Using images array:', images);
      } else if (typeof product.images === 'string' && product.images.trim()) {
        images = [product.images];
        console.log('✅ Using images string:', images);
      }
    } else if (product?.image) {
      if (typeof product.image === 'string' && product.image.trim()) {
        images = [product.image];
        console.log('✅ Using image string:', images);
      } else if (typeof product.image === 'object' && product.image.url) {
        images = [product.image.url];
        console.log('✅ Using image object URL:', images);
      }
    } else if (product?.product_image) {
      if (typeof product.product_image === 'string' && product.product_image.trim()) {
        images = [product.product_image];
        console.log('✅ Using product_image string:', images);
      }
    } else if (product?.imageUrl) {
      if (typeof product.imageUrl === 'string' && product.imageUrl.trim()) {
        images = [product.imageUrl];
        console.log('✅ Using imageUrl string:', images);
      }
    }
    
    // Clean up images - ensure they're all valid strings
    images = images
      .filter(img => {
        if (typeof img === 'string' && img.trim()) {
          return true;
        } else if (typeof img === 'object' && (img.url || img.secure_url)) {
          return true;
        }
        console.log('❌ Filtered out invalid image:', img);
        return false;
      })
      .map(img => {
        if (typeof img === 'string') {
          return img.trim();
        } else if (typeof img === 'object') {
          return img.secure_url || img.url || img.path;
        }
        return img;
      });
    
    console.log('Final processed images:', images);
    
    // If no valid images found, use fallback
    if (images.length === 0) {
      const fallback = getFallbackImageByCategory(category);
      console.log('⚠️ No valid images found, using fallback:', fallback);
      images = [fallback];
    }
    
    console.log('=== END IMAGE DEBUG ===');
    return images;
  };

  const getFallbackImageByCategory = (categoryName) => {
    const fallbacks = {
      'Head Protection': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=600&fit=crop',
      'Eye Protection': 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=600&h=600&fit=crop',
      'Hand Protection': 'https://images.unsplash.com/photo-1559226947-8cffc3a59d82?w=600&h=600&fit=crop',
      'Foot Protection': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
      'Breathing Protection': 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=600&h=600&fit=crop',
      'High-Vis Clothing': 'https://images.unsplash.com/photo-1594608661623-4b64b4de8e63?w=600&h=600&fit=crop'
    };
    return fallbacks[categoryName] || 'https://images.unsplash.com/photo-1581594549595-35f6edc7b762?w=600&h=600&fit=crop';
  };

  const productImages = product ? getProductImages() : [];

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= stock) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    const cartProduct = {
      ...product,
      quantity: quantity
    };
    onAddToCart(cartProduct);
    
    // Show success message (you can replace with toast notification)
    alert(`Added ${quantity} ${productName} to cart!`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 rounded-lg h-96"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
        <Link 
          to="/products"
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-orange-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{category}</span>
          <span>/</span>
          <span className="text-gray-900 truncate">{productName}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
            <img
              src={productImages[selectedImageIndex]}
              alt={productName}
              className="w-full h-full object-cover"
            />
            
            {/* Image Navigation */}
            {productImages.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === 0 ? productImages.length - 1 : prev - 1
                  )}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex(prev => 
                    prev === productImages.length - 1 ? 0 : prev + 1
                  )}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          
          {/* Thumbnail Images */}
          {productImages.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    index === selectedImageIndex 
                      ? 'border-orange-500' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productName} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          
          {/* Product Header */}
          <div>
            {/* Category & Brand */}
            <div className="flex items-center space-x-4 mb-3">
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {category}
              </span>
              {productBrand && (
                <span className="text-gray-500 text-sm">by {productBrand}</span>
              )}
            </div>
            
            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {productName}
            </h1>
            
            {/* Rating */}
            {rating > 0 && (
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.floor(rating) ? 'fill-current' : ''}`} 
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {rating.toFixed(1)} ({reviews} review{reviews !== 1 ? 's' : ''})
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Price Section */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-3xl font-bold text-orange-600">
                  KES {productPrice?.toLocaleString()}
                </span>
                <p className="text-gray-600 mt-1">Price includes VAT</p>
              </div>
              
              {/* Stock Status */}
              <div className="text-right">
                {stock > 10 ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    <span className="font-medium">In Stock</span>
                  </div>
                ) : stock > 0 ? (
                  <div className="flex items-center text-orange-600">
                    <AlertCircle className="h-5 w-5 mr-1" />
                    <span className="font-medium">Only {stock} left</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="h-5 w-5 mr-1" />
                    <span className="font-medium">Out of Stock</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4 mb-6">
              <span className="text-gray-700 font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-2 border-x border-gray-300 font-medium min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= stock}
                  className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {stock} available
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={stock === 0}
                className="flex-1 bg-orange-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>{stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
              </button>
              
              <button className="bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                <Heart className="h-5 w-5" />
              </button>
              
              <button className="bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Product Description */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {productDescription || 'No description available for this product.'}
            </p>
          </div>

          {/* Product Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <Shield className="h-6 w-6 text-green-600" />
              <div>
                <h4 className="font-medium text-gray-900">Certified Quality</h4>
                <p className="text-sm text-gray-600">International standards</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600" />
              <div>
                <h4 className="font-medium text-gray-900">Fast Delivery</h4>
                <p className="text-sm text-gray-600">Free in Nairobi</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
              <RotateCcw className="h-6 w-6 text-purple-600" />
              <div>
                <h4 className="font-medium text-gray-900">Easy Returns</h4>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>

          {/* Product Specifications */}
          {productBrand && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Specifications</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Brand:</span>
                    <span className="text-gray-700 ml-2">{productBrand}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Category:</span>
                    <span className="text-gray-700 ml-2">{category || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Stock:</span>
                    <span className="text-gray-700 ml-2">{stock} units</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Product ID:</span>
                    <span className="text-gray-700 ml-2">{product._id}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <Link
                key={relatedProduct._id}
                to={`/products/${relatedProduct._id}`}
                className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow group"
              >
                <img 
                  src={relatedProduct.product_images?.[0] || getFallbackImageByCategory(
                    typeof relatedProduct.category === 'object' 
                      ? relatedProduct.category.name 
                      : relatedProduct.category
                  )}
                  alt={relatedProduct.product_name || relatedProduct.name}
                  className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {relatedProduct.product_name || relatedProduct.name}
                  </h4>
                  <span className="text-lg font-bold text-orange-600">
                    KES {(relatedProduct.product_price || relatedProduct.price)?.toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back to Products Button */}
      <div className="mt-12 text-center">
        <Link 
          to="/products"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Products
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;