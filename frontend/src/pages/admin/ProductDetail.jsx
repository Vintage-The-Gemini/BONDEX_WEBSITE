// frontend/src/pages/admin/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Star,
  Package,
  DollarSign,
  Calendar,
  Eye,
  EyeOff,
  ShoppingCart,
  AlertTriangle,
  Image as ImageIcon,
  Tag,
  BarChart3,
  Copy,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  Minus,
  Plus
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [category, setCategory] = useState(null);
  const [copying, setCopying] = useState(false);

  // Fetch product data
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await fetch(`/api/admin/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          setError('Product not found');
          setTimeout(() => navigate('/admin/products'), 2000);
          return;
        }
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      
      if (data.success) {
        setProduct(data.data);
        // Fetch category info if product has category
        if (data.data.category) {
          fetchCategory(data.data.category);
        }
      } else {
        setError(data.message || 'Failed to fetch product');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to fetch product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch category data
  const fetchCategory = async (categoryId) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCategory(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    try {
      setDeleting(true);
      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        navigate('/admin/products');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setError('Failed to delete product. Please try again.');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Copy product URL
  const copyProductUrl = async () => {
    try {
      setCopying(true);
      const productUrl = `${window.location.origin}/products/${product.slug || id}`;
      await navigator.clipboard.writeText(productUrl);
      alert('Product URL copied to clipboard!');
    } catch (error) {
      console.error('Error copying URL:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = `${window.location.origin}/products/${product.slug || id}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Product URL copied to clipboard!');
    } finally {
      setCopying(false);
    }
  };

  // Format currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(price);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'inactive':
        return <XCircle size={16} className="text-red-600" />;
      case 'draft':
        return <Clock size={16} className="text-yellow-600" />;
      default:
        return <Minus size={16} className="text-gray-600" />;
    }
  };

  // Navigate to previous/next image
  const changeImage = (direction) => {
    if (!product.images || product.images.length <= 1) return;
    
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-600 mb-4" />
          <h2 className="text-xl font-semibold text-red-900 mb-2">Error</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Product not found</h2>
          <button
            onClick={() => navigate('/admin/products')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.product_name}</h1>
            <p className="text-gray-600 mt-1">Product details and management</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyProductUrl}
            disabled={copying}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Copy size={16} />
            {copying ? 'Copying...' : 'Copy URL'}
          </button>
          <Link
            to={`/admin/products/${id}/edit`}
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Edit size={16} />
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center gap-2"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Product Status Banner */}
      <div className={`rounded-lg p-4 mb-6 ${
        product.status === 'active' ? 'bg-green-50 border border-green-200' :
        product.status === 'inactive' ? 'bg-red-50 border border-red-200' :
        'bg-yellow-50 border border-yellow-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(product.status)}
            <div>
              <p className="font-semibold text-gray-900">
                Product Status: 
                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                  {product.status}
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {product.status === 'active' && 'This product is live and visible to customers'}
                {product.status === 'inactive' && 'This product is hidden from customers'}
                {product.status === 'draft' && 'This product is a draft and not yet published'}
              </p>
            </div>
          </div>
          {product.isFeatured && (
            <div className="flex items-center gap-2 text-purple-700">
              <Star className="fill-current" size={16} />
              <span className="text-sm font-medium">Featured Product</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Product Images & Basic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Images */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon size={20} />
                Product Images
              </h2>
              
              {product.images && product.images.length > 0 ? (
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative">
                    <img
                      src={typeof product.images[currentImageIndex] === 'string' 
                        ? product.images[currentImageIndex] 
                        : product.images[currentImageIndex].url}
                      alt={product.product_name}
                      className="w-full h-96 object-cover rounded-lg cursor-pointer"
                      onClick={() => setShowImageModal(true)}
                    />
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={() => changeImage('prev')}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                        >
                          <ArrowLeft size={20} />
                        </button>
                        <button
                          onClick={() => changeImage('next')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100 transition-all"
                        >
                          <ArrowLeft size={20} className="rotate-180" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Image Thumbnails */}
                  {product.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentImageIndex 
                              ? 'border-blue-500' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={typeof image === 'string' ? image : image.url}
                            alt={`${product.product_name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <ImageIcon size={48} className="mb-4" />
                  <p>No images uploaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package size={20} />
              Product Information
            </h2>
            
            <div className="space-y-6">
              {/* Basic Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <p className="text-gray-900 text-lg font-medium">{product.product_name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                  <p className="text-gray-900">{product.product_brand || 'No brand specified'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-gray-900">{category ? category.name : 'Loading...'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
                  <p className="text-gray-600 font-mono text-sm">{product._id}</p>
                </div>
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-900 whitespace-pre-wrap">{product.product_description}</p>
                </div>
              </div>
              
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        <Tag size={12} className="mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SEO Information */}
          {(product.metaTitle || product.metaDescription) && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 size={20} />
                SEO Information
              </h2>
              
              <div className="space-y-4">
                {product.metaTitle && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                    <p className="text-gray-900">{product.metaTitle}</p>
                  </div>
                )}
                
                {product.metaDescription && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                    <p className="text-gray-900">{product.metaDescription}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Pricing & Stats */}
        <div className="space-y-6">
          {/* Pricing Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign size={20} />
              Pricing & Stock
            </h2>
            
            <div className="space-y-6">
              {/* Price Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price</label>
                <p className="text-3xl font-bold text-gray-900">{formatPrice(product.product_price)}</p>
                
                {product.isOnSale && product.salePrice && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-red-600">{formatPrice(product.salePrice)}</p>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                        {Math.round(((product.product_price - product.salePrice) / product.product_price) * 100)}% OFF
                      </span>
                    </div>
                    {product.saleEndDate && (
                      <p className="text-sm text-gray-600 mt-1">
                        Sale ends: {formatDate(product.saleEndDate)}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Stock Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Level</label>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">{product.stock}</p>
                  <span className="text-gray-600">units</span>
                  {product.stock <= (product.lowStockThreshold || 10) && (
                    <AlertTriangle className="text-red-500" size={20} />
                  )}
                </div>
                
                {product.stock <= (product.lowStockThreshold || 10) && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="text-red-600" size={16} />
                      <p className="text-red-800 text-sm font-medium">Low Stock Alert</p>
                    </div>
                    <p className="text-red-700 text-sm mt-1">
                      Stock is below threshold of {product.lowStockThreshold || 10} units
                    </p>
                  </div>
                )}
                
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Low Stock Threshold</label>
                  <p className="text-gray-600">{product.lowStockThreshold || 10} units</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 size={20} />
              Statistics
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Total Sales</span>
                </div>
                <span className="font-semibold text-gray-900">{product.salesCount || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Page Views</span>
                </div>
                <span className="font-semibold text-gray-900">{product.viewCount || 0}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Revenue Generated</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatPrice((product.salesCount || 0) * product.product_price)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-600" />
                  <span className="text-sm font-medium text-gray-700">Average Rating</span>
                </div>
                <span className="font-semibold text-gray-900">{product.averageRating || 'No ratings'}</span>
              </div>
            </div>
          </div>

          {/* Product Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            
            <div className="space-y-3">
              <Link
                to={`/products/${product.slug || id}`}
                target="_blank"
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ExternalLink size={16} />
                View on Website
              </Link>
              
              <Link
                to={`/admin/products/${id}/edit`}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit size={16} />
                Edit Product
              </Link>
              
              <button
                onClick={() => {
                  const newStatus = product.status === 'active' ? 'inactive' : 'active';
                  // Here you would implement the status toggle API call
                  console.log('Toggle status to:', newStatus);
                }}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg ${
                  product.status === 'active'
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {product.status === 'active' ? <EyeOff size={16} /> : <Eye size={16} />}
                {product.status === 'active' ? 'Deactivate' : 'Activate'}
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 size={16} />
                Delete Product
              </button>
            </div>
          </div>

          {/* Product Dates */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar size={20} />
              Important Dates
            </h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                <p className="text-gray-900 text-sm">{formatDate(product.createdAt)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Modified</label>
                <p className="text-gray-900 text-sm">{formatDate(product.updatedAt)}</p>
              </div>
              
              {product.isOnSale && product.saleEndDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sale Ends</label>
                  <p className="text-red-600 text-sm font-medium">{formatDate(product.saleEndDate)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && product.images && product.images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 p-2 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 z-10"
            >
              <X size={24} />
            </button>
            
            <img
              src={typeof product.images[currentImageIndex] === 'string' 
                ? product.images[currentImageIndex] 
                : product.images[currentImageIndex].url}
              alt={product.product_name}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => changeImage('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30"
                >
                  <ArrowLeft size={24} />
                </button>
                <button
                  onClick={() => changeImage('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30"
                >
                  <ArrowLeft size={24} className="rotate-180" />
                </button>
                
                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black bg-opacity-50 text-white rounded-full text-sm">
                  {currentImageIndex + 1} of {product.images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{product.product_name}"? This action cannot be undone and will permanently remove:
            </p>
            
            <ul className="text-sm text-gray-600 mb-6 space-y-1">
              <li>• Product information and images</li>
              <li>• Sales history and statistics</li>
              <li>• Customer reviews and ratings</li>
              <li>• Any associated data</li>
            </ul>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 z-50">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;