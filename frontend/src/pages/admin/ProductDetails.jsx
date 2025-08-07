// frontend/src/pages/admin/ProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Star,
  Package,
  DollarSign,
  Calendar,
  Eye,
  EyeOff,
  Settings,
  Tag,
  Award,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  Image as ImageIcon,
  RefreshCw,
  TrendingUp,
  Users,
  ShoppingCart
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useAdmin();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [analytics, setAnalytics] = useState({
    views: 245,
    orders: 12,
    revenue: 72000,
    conversionRate: 4.9
  });

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchProductAnalytics();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/admin/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setProduct(data.data);
      } else {
        setError(data.message || 'Failed to fetch product');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  const fetchProductAnalytics = async () => {
    try {
      // Simulate analytics data - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // const response = await fetch(`${API_BASE}/admin/products/${id}/analytics`);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        addNotification('Product deleted successfully', 'success');
        navigate('/admin/products');
      } else {
        addNotification(data.message || 'Failed to delete product', 'error');
      }
    } catch (error) {
      addNotification('Failed to delete product', 'error');
    }
    setShowDeleteModal(false);
  };

  const copyProductURL = () => {
    const url = `${window.location.origin}/products/${product.slug || product._id}`;
    navigator.clipboard.writeText(url);
    addNotification('Product URL copied to clipboard', 'success');
  };

  const formatPrice = (price) => {
    if (!price) return 'KES 0';
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? 'KES 0' : `KES ${numPrice.toLocaleString()}`;
  };

  const getStatusConfig = (status) => {
    const configs = {
      active: { color: 'green', icon: CheckCircle, text: 'Active' },
      draft: { color: 'orange', icon: Clock, text: 'Draft' },
      inactive: { color: 'red', icon: AlertTriangle, text: 'Inactive' }
    };
    return configs[status] || configs.draft;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'details', label: 'Details', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'seo', label: 'SEO', icon: Tag }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
        <Link
          to="/admin/products"
          className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(product.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{product.product_name}</h1>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                product.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : product.status === 'draft'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                <StatusIcon size={14} />
                {product.status.toUpperCase()}
              </div>
              {product.isFeatured && (
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                  <Star size={12} className="fill-current" />
                  Featured
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Brand: {product.product_brand}</span>
              <span>•</span>
              <span>Created {new Date(product.createdAt).toLocaleDateString()}</span>
              <span>•</span>
              <span>ID: {product._id}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={copyProductURL}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <Copy size={16} />
            Copy URL
          </button>
          
          <button
            onClick={() => window.open(`/products/${product.slug || product._id}`, '_blank')}
            className="px-4 py-2 text-orange-700 border border-orange-300 rounded-lg hover:bg-orange-50 flex items-center gap-2 transition-colors"
          >
            <ExternalLink size={16} />
            View Live
          </button>
          
          <Link
            to={`/admin/products/${id}/edit`}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2 transition-colors"
          >
            <Edit size={16} />
            Edit Product
          </Link>
          
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Product Hero Section */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Product Images */}
          <div>
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {product.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`${product.product_name} ${index + 2}`}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-80"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <ImageIcon size={48} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            
            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Price</h3>
                <div className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price || product.product_price)}
                </div>
                {product.isOnSale && product.salePrice && (
                  <div className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Stock Level</h3>
                <div className="text-3xl font-bold text-gray-900">{product.stock}</div>
                <div className="text-sm text-gray-500">
                  {product.stock <= (product.lowStockThreshold || 10) ? 'Low Stock' : 'In Stock'}
                </div>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  {product.protectionType || product.category}
                </span>
                {product.secondaryCategories && product.secondaryCategories.map((cat, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <Eye className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{analytics.views}</div>
                <div className="text-xs text-gray-600">Views</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-green-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{analytics.orders}</div>
                <div className="text-xs text-gray-600">Orders</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">KES {analytics.revenue.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Revenue</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                <div className="text-lg font-bold text-gray-900">{analytics.conversionRate}%</div>
                <div className="text-xs text-gray-600">Conversion</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Product Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Description</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {product.product_description}
                  </p>
                </div>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {product.certifications && product.certifications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Certifications</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <Award className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-800 font-medium">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-6">
              
              {/* Technical Specifications */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900 capitalize">
                          {key.replace('_', ' ')}
                        </span>
                        <span className="text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No specifications available</p>
                )}
              </div>

              {/* Product Tags */}
              {product.tags && product.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Compliance Standards */}
              {product.complianceStandards && product.complianceStandards.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Standards</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.complianceStandards.map((standard, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                        <Shield className="h-5 w-5 text-blue-600 flex-shrink-0" />
                        <span className="text-blue-800 font-medium">{standard}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-orange-50 rounded-lg p-6 text-center">
                  <Eye className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{analytics.views}</div>
                  <div className="text-sm text-gray-600">Total Views</div>
                  <div className="text-xs text-green-600 mt-1">+12% this week</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <ShoppingCart className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{analytics.orders}</div>
                  <div className="text-sm text-gray-600">Orders</div>
                  <div className="text-xs text-green-600 mt-1">+3 this week</div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">KES {analytics.revenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Revenue</div>
                  <div className="text-xs text-green-600 mt-1">+8% this month</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">{analytics.conversionRate}%</div>
                  <div className="text-sm text-gray-600">Conversion Rate</div>
                  <div className="text-xs text-green-600 mt-1">Above average</div>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-700">This product has a conversion rate above the store average.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-orange-900">Optimization Opportunity</p>
                      <p className="text-sm text-orange-700">Consider adding more product images to improve engagement.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              
              {/* SEO Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold text-green-700">85</div>
                  <div className="text-sm text-gray-600">SEO Score</div>
                  <div className="text-xs text-green-600 mt-1">Good optimization</div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold text-blue-700">#{product.searchRanking || 12}</div>
                  <div className="text-sm text-gray-600">Search Ranking</div>
                  <div className="text-xs text-blue-600 mt-1">For main keyword</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold text-purple-700">{product.keywords?.length || 5}</div>
                  <div className="text-sm text-gray-600">Target Keywords</div>
                  <div className="text-xs text-purple-600 mt-1">Optimized</div>
                </div>
              </div>

              {/* SEO Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">SEO Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Meta Title</label>
                      <p className="text-gray-900 mt-1">{product.metaTitle || product.product_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Meta Description</label>
                      <p className="text-gray-900 mt-1">{product.metaDescription || 'No meta description set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">URL Slug</label>
                      <p className="text-gray-900 mt-1">/products/{product.slug || product._id}</p>
                    </div>
                  </div>
                </div>

                {/* SEO Recommendations */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-medium text-orange-900 mb-2">SEO Recommendations</h4>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>• Add more specific keywords related to "{product.protectionType}" in Kenya</li>
                    <li>• Include price range keywords like "affordable safety boots"</li>
                    <li>• Add location-based terms like "Nairobi safety equipment"</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Product</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{product.product_name}</strong>?
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;