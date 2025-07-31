// frontend/src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingCart,
  Share2,
  ArrowLeft,
  Check,
  X,
  Plus,
  Minus,
  Shield,
  Truck,
  RotateCcw,
  Award,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import api from '../utils/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State Management
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Fetch product details
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get(`/products/${id}`);
      
      if (response.data.success) {
        setProduct(response.data.product);
        // Fetch related products
        if (response.data.product.category) {
          fetchRelatedProducts(response.data.product.category, id);
        }
      } else {
        setError('Product not found');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  // Fetch related products
  const fetchRelatedProducts = async (categoryId, excludeId) => {
    try {
      const response = await api.get(`/products?category=${categoryId}&limit=8&status=active`);
      if (response.data.success) {
        const filtered = response.data.products.filter(p => p._id !== excludeId);
        setRelatedProducts(filtered.slice(0, 4));
      }
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Helper function to get fallback image
  const getFallbackImage = (product) => {
    if (product?.product_images?.length > 0) {
      return typeof product.product_images[0] === 'string' 
        ? product.product_images[0] 
        : product.product_images[0].url;
    }
    if (product?.product_image) {
      return product.product_image;
    }
    return 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=500&h=500&fit=crop&auto=format';
  };

  // Format price in KES
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Render star rating
  const renderStars = (rating, reviewCount = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-5 w-5 fill-yellow-400/50 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
    }

    return (
      <div className="flex items-center space-x-1">
        <div className="flex">{stars}</div>
        <span className="text-sm text-gray-600 ml-2">
          {rating.toFixed(1)} ({reviewCount} reviews)
        </span>
      </div>
    );
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      // Add your cart API call here
      console.log('Adding to cart:', { productId: product._id, quantity });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message or redirect
      alert('Product added to cart successfully!');
    } catch (err) {
      console.error('Error adding to cart:', err);
      alert('Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    setIsInWishlist(!isInWishlist);
    // Add your wishlist API call here
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.product_name,
        text: product.product_description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  // Get product images array
  const getProductImages = () => {
    if (product?.product_images?.length > 0) {
      return product.product_images.map(img => 
        typeof img === 'string' ? img : img.url
      );
    }
    if (product?.product_image) {
      return [product.product_image];
    }
    return [getFallbackImage(product)];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading product details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-20">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h3>
            <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const images = getProductImages();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 truncate">{product.product_name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={images[selectedImageIndex]}
                alt={product.product_name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index 
                        ? 'border-blue-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.product_name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Product Header */}
            <div>
              <div className="text-sm text-gray-500 mb-2">{product.product_brand}</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.product_name}</h1>
              
              <div className="text-sm text-blue-600 mb-4">
                {typeof product.category === 'object' ? product.category.name : product.category}
              </div>

              {/* Rating */}
              {product.averageRating && (
                <div className="mb-4">
                  {renderStars(product.averageRating, product.reviewCount)}
                </div>
              )}
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-200 py-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {formatPrice(product.product_price)}
              </div>
              {product.originalPrice && product.originalPrice > product.product_price && (
                <div className="flex items-center gap-2">
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                    {Math.round(((product.originalPrice - product.product_price) / product.originalPrice) * 100)}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3">
              {product.stock === 0 ? (
                <span className="flex items-center gap-2 text-red-600">
                  <X className="h-5 w-5" />
                  Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="flex items-center gap-2 text-yellow-600">
                  <AlertCircle className="h-5 w-5" />
                  Only {product.stock} left in stock
                </span>
              ) : (
                <span className="flex items-center gap-2 text-green-600">
                  <Check className="h-5 w-5" />
                  In Stock ({product.stock} available)
                </span>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <label className="text-sm font-medium text-gray-700 mr-3">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-3 text-gray-900 min-w-[4rem] text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || addingToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
                >
                  {addingToCart ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleWishlistToggle}
                  className={`p-4 border rounded-lg transition-colors ${
                    isInWishlist
                      ? 'border-red-300 bg-red-50 text-red-600'
                      : 'border-gray-300 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-4 border border-gray-300 text-gray-600 rounded-lg hover:border-gray-400 transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <Truck className="h-6 w-6 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">Free Delivery</div>
                  <div className="text-sm text-gray-600">On orders over KES 5,000</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <RotateCcw className="h-6 w-6 text-blue-600" />
                <div>
                  <div className="font-medium text-gray-900">Easy Returns</div>
                  <div className="text-sm text-gray-600">30-day return policy</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
                <div>
                  <div className="font-medium text-gray-900">Quality Assured</div>
                  <div className="text-sm text-gray-600">Certified safety standards</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specifications', label: 'Specifications' },
                { id: 'features', label: 'Features' },
                { id: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {showFullDescription 
                    ? product.product_description 
                    : `${product.product_description?.substring(0, 300)}${product.product_description?.length > 300 ? '...' : ''}`
                  }
                </p>
                {product.product_description?.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-600 hover:text-blue-700 font-medium mt-2"
                  >
                    {showFullDescription ? 'Show Less' : 'Read More'}
                  </button>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-4">
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600 capitalize font-medium">
                          {key.replace('_', ' ')}
                        </span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No specifications available for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'features' && (
              <div>
                {product.features && product.features.length > 0 ? (
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No features listed for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="text-center py-8">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-600">Be the first to review this product</p>
                  <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Write a Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/products/${relatedProduct._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group"
                >
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={getFallbackImage(relatedProduct)}
                      alt={relatedProduct.product_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-1">{relatedProduct.product_brand}</div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {relatedProduct.product_name}
                    </h3>
                    <div className="text-lg font-bold text-blue-600">
                      {formatPrice(relatedProduct.product_price)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;