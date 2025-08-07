// frontend/src/pages/admin/AdminProductDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import {
  ArrowLeft,
  Edit,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Package,
  DollarSign,
  Globe,
  Target,
  Building,
  Shield,
  Award,
  Tag,
  Settings,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Download,
  Share2,
  Zap
} from 'lucide-react';

const AdminProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analytics, setAnalytics] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load product data
  useEffect(() => {
    if (id) {
      fetchProductDetails();
    }
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/admin/products/${id}`, {
        credentials: 'include'
      });
      
      const result = await response.json();
      
      if (result.success) {
        setProduct(result.data);
        setAnalytics(result.analytics || {});
        console.log('📦 Product loaded:', result.data);
      } else {
        setError(result.message || 'Failed to load product');
      }
    } catch (err) {
      console.error('❌ Error loading product:', err);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  // Handle product status toggle
  const handleStatusToggle = async () => {
    try {
      const newStatus = product.status === 'active' ? 'inactive' : 'active';
      
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setProduct(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('❌ Error updating status:', err);
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      const result = await response.json();
      
      if (result.success) {
        navigate('/admin/products');
      } else {
        setError(result.message || 'Failed to delete product');
      }
    } catch (err) {
      console.error('❌ Error deleting product:', err);
      setError('Failed to delete product');
    }
    
    setShowDeleteModal(false);
  };

  // Copy product URL
  const copyProductURL = () => {
    const productURL = `${window.location.origin}/products/${product.slug}`;
    navigator.clipboard.writeText(productURL);
  };

  // Export product data as JSON
  const exportJSON = () => {
    const dataStr = JSON.stringify(product, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `product-${product._id}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Export product data as CSV
  const exportCSV = () => {
    const csvContent = [
      'Field,Value',
      `Product Name,${product.product_name}`,
      `Brand,${product.product_brand}`,
      `Price,KES ${product.product_price}`,
      `Stock,${product.stock}`,
      `Status,${product.status}`,
      `Primary Category,${product.primaryCategory?.name || ''}`,
      `Secondary Categories,"${product.secondaryCategories?.map(c => c.name).join('; ') || ''}"`,
      `Created Date,${new Date(product.createdAt).toLocaleDateString()}`,
      `Product ID,${product._id}`
    ].join('\n');
    
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const exportFileDefaultName = `product-${product._id}.csv`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {error ? 'Error Loading Product' : 'Product Not Found'}
          </h2>
          <p className="text-gray-600 mb-4">
            {error || 'The requested product could not be found.'}
          </p>
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Package },
    { id: 'categories', label: 'Categories', icon: Target },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'details', label: 'Details', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/products')}
              className="p-3 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-white shadow-sm transition-all"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{product.product_name}</h1>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : product.status === 'draft'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.status.toUpperCase()}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>by {product.product_brand}</span>
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
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-all"
            >
              <Copy size={16} />
              Copy URL
            </button>
            
            <button
              onClick={() => window.open(`/products/${product.slug}`, '_blank')}
              className="px-4 py-2 text-blue-700 border border-blue-300 rounded-lg hover:bg-blue-50 flex items-center gap-2 transition-all"
            >
              <ExternalLink size={16} />
              View Live
            </button>
            
            <button
              onClick={() => navigate(`/admin/products/${id}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all"
            >
              <Edit size={16} />
              Edit Product
            </button>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition-all"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        {/* Product Hero Section */}
        <div className="bg-white rounded-xl shadow-lg border p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Product Images */}
            <div>
              {product.images && product.images.length > 0 ? (
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={product.images[0].url}
                      alt={product.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.slice(1).map((image, index) => (
                        <div key={index} className="aspect-square rounded-md overflow-hidden bg-gray-100">
                          <img
                            src={image.url}
                            alt={`${product.product_name} ${index + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
                  <Package className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              
              {/* Price & Status */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  {product.isOnSale && product.salePrice ? (
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-red-600">
                        KES {parseInt(product.salePrice).toLocaleString()}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        KES {parseInt(product.product_price).toLocaleString()}
                      </span>
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                        SALE
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-blue-600">
                      KES {parseInt(product.product_price).toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      product.stock > 20 ? 'bg-green-500' :
                      product.stock > 5 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium">
                      {product.stock > 0 
                        ? `${product.stock} units in stock` 
                        : 'Out of stock'
                      }
                    </span>
                  </div>
                  
                  {product.isFeatured && (
                    <div className="flex items-center gap-1 text-purple-600">
                      <Star className="h-4 w-4" />
                      <span className="text-sm font-medium">Featured</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Multi-Category Display */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">🎯 Multi-Category Classification</h3>
                <div className="space-y-3">
                  
                  {/* Primary Category */}
                  {product.primaryCategory && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Protection Type:</label>
                      <div className="mt-1">
                        <span className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
                          <Target className="h-4 w-4" />
                          {product.primaryCategory.name}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Secondary Categories */}
                  {product.secondaryCategories && product.secondaryCategories.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Industries/Sectors ({product.secondaryCategories.length}):
                      </label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {product.secondaryCategories.map(category => (
                          <span
                            key={category._id}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg font-medium"
                          >
                            <Building className="h-4 w-4" />
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleStatusToggle}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    product.status === 'active'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {product.status === 'active' ? (
                    <>
                      <EyeOff className="h-4 w-4 inline mr-2" />
                      Make Inactive
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 inline mr-2" />
                      Make Active
                    </>
                  )}
                </button>
                
                <button 
                  onClick={exportJSON}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                >
                  <Download className="h-4 w-4 inline mr-2" />
                  Export Data
                </button>
                
                <button 
                  onClick={copyProductURL}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all"
                >
                  <Share2 className="h-4 w-4 inline mr-2" />
                  Share Product
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-lg border mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-2 border-b-2 font-medium text-sm transition-all ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 inline mr-2" />
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
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{product.stock}</div>
                    <div className="text-sm text-gray-600">Stock Level</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {product.secondaryCategories?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Sectors</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {product.images?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Images</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {new Date(product.createdAt).getFullYear()}
                    </div>
                    <div className="text-sm text-gray-600">Added</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="space-y-6">
                
                {/* Category Overview */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    🎯 Multi-Category Analysis
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-blue-600">1</div>
                      <div className="text-sm text-gray-600">Protection Type</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-green-600">
                        {product.secondaryCategories?.length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Industries</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-purple-600">
                        {(product.secondaryCategories?.length || 0) + 1}
                      </div>
                      <div className="text-sm text-gray-600">Discovery Paths</div>
                    </div>
                  </div>
                </div>

                {/* Detailed Category Info */}
                <div className="space-y-4">
                  {product.primaryCategory && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Target className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Primary Protection Type</h4>
                          <p className="text-sm text-gray-600">Main category classification</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-gray-900">{product.primaryCategory.name}</h5>
                            <p className="text-sm text-gray-600">{product.primaryCategory.description}</p>
                          </div>
                          <span className="text-2xl">{product.primaryCategory.icon}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {product.secondaryCategories && product.secondaryCategories.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Building className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Target Industries</h4>
                          <p className="text-sm text-gray-600">Applicable industry sectors</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.secondaryCategories.map(category => (
                          <div key={category._id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium text-gray-900">{category.name}</h5>
                                <p className="text-sm text-gray-600">{category.description}</p>
                              </div>
                              <span className="text-2xl">{category.icon}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                
                {/* SEO Score */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-green-600" />
                    SEO Performance
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-green-600">
                        {product.metaTitle ? 85 : 45}%
                      </div>
                      <div className="text-sm text-gray-600">SEO Score</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-blue-600">
                        {product.keywords?.split(',').length || 0}
                      </div>
                      <div className="text-sm text-gray-600">Target Keywords</div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl font-bold text-purple-600">
                        {(product.secondaryCategories?.length || 0) + 1}
                      </div>
                      <div className="text-sm text-gray-600">SEO Paths</div>
                    </div>
                  </div>
                </div>

                {/* SEO Fields */}
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Meta Title</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">
                      {product.metaTitle || product.product_name}
                    </p>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500">
                        {(product.metaTitle || product.product_name).length} characters
                      </span>
                      <span className={`${
                        (product.metaTitle || product.product_name).length >= 30 && 
                        (product.metaTitle || product.product_name).length <= 60
                          ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {(product.metaTitle || product.product_name).length >= 30 && 
                         (product.metaTitle || product.product_name).length <= 60
                          ? '✅ Optimal' : '⚠️ Needs optimization'
                        }
                      </span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Meta Description</h4>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded">
                      {product.metaDescription || product.product_description?.substring(0, 160)}
                    </p>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-500">
                        {(product.metaDescription || product.product_description || '').length} characters
                      </span>
                      <span className={`${
                        (product.metaDescription || product.product_description || '').length >= 120 && 
                        (product.metaDescription || product.product_description || '').length <= 160
                          ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {(product.metaDescription || product.product_description || '').length >= 120 && 
                         (product.metaDescription || product.product_description || '').length <= 160
                          ? '✅ Optimal' : '⚠️ Needs optimization'
                        }
                      </span>
                    </div>
                  </div>

                  {product.keywords && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Target Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.keywords.split(',').map((keyword, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                          >
                            {keyword.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.slug && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Product URL</h4>
                      <code className="text-sm bg-gray-50 p-3 rounded block">
                        /products/{product.slug}
                      </code>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                
                {/* Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Eye className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {analytics.views || 0}
                        </div>
                        <div className="text-sm text-gray-600">Total Views</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          {analytics.conversions || 0}
                        </div>
                        <div className="text-sm text-gray-600">Conversions</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {analytics.similarProducts || 0}
                        </div>
                        <div className="text-sm text-gray-600">Similar Products</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <DollarSign className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          KES {analytics.totalRevenue?.toLocaleString() || 0}
                        </div>
                        <div className="text-sm text-gray-600">Revenue</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Multi-Category Performance */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-yellow-600" />
                    🎯 Multi-Category Performance
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h5 className="font-medium text-gray-900 mb-2">Discovery Advantage</h5>
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-blue-600">
                          {(product.secondaryCategories?.length || 0) + 1}x
                        </div>
                        <div className="text-sm text-gray-600">
                          More discoverable than single-category products
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <h5 className="font-medium text-gray-900 mb-2">Cross-Category Reach</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.primaryCategory && (
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                            <span className="text-sm text-gray-700">
                              {product.primaryCategory.name}: 100% relevance
                            </span>
                          </div>
                        )}
                        {product.secondaryCategories?.map((category, index) => (
                          <div key={category._id} className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            <span className="text-sm text-gray-700">
                              {category.name}: 85% relevance
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Insights */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">📊 Performance Insights</h4>
                  
                  <div className="space-y-3">
                    {analytics.multiCategoryAdvantage && (
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-800">Multi-Category Advantage Active</p>
                          <p className="text-sm text-green-700">
                            This product benefits from cross-category visibility and broader customer reach.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">SEO Performance</p>
                        <p className="text-sm text-blue-700">
                          Optimized for {(product.keywords?.split(',').length || 0)} target keywords across multiple categories.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <Zap className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-purple-800">Conversion Optimization</p>
                        <p className="text-sm text-purple-700">
                          Product appeals to {(product.secondaryCategories?.length || 0) + 1} different customer segments.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6">
                
                {/* Technical Specifications */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Settings className="h-5 w-5 text-gray-600" />
                      Technical Specifications
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="bg-gray-50 p-4 rounded-lg">
                          <dt className="font-medium text-gray-900">{key}</dt>
                          <dd className="text-gray-700 mt-1">{value}</dd>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Tag className="h-5 w-5 text-orange-600" />
                      Product Tags
                    </h3>
                    
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {product.certifications && product.certifications.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      Certifications
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {product.certifications.map((cert, index) => (
                        <div key={index} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-purple-600" />
                            <span className="font-medium text-purple-900">{cert}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compliance Standards */}
                {product.complianceStandards && product.complianceStandards.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-600" />
                      Compliance Standards
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {product.complianceStandards.map((standard, index) => (
                        <div key={index} className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-red-600" />
                            <span className="font-medium text-red-900">{standard}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* System Information */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    System Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <dt className="font-medium text-gray-900">Created Date</dt>
                      <dd className="text-gray-700 mt-1">
                        {new Date(product.createdAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </dd>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <dt className="font-medium text-gray-900">Last Modified</dt>
                      <dd className="text-gray-700 mt-1">
                        {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Not modified'}
                      </dd>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <dt className="font-medium text-gray-900">Product ID</dt>
                      <dd className="text-gray-700 mt-1 font-mono text-sm">{product._id}</dd>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <dt className="font-medium text-gray-900">Low Stock Alert</dt>
                      <dd className="text-gray-700 mt-1">
                        {product.lowStockThreshold || 10} units
                      </dd>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <dt className="font-medium text-gray-900">Created By</dt>
                      <dd className="text-gray-700 mt-1">
                        {product.createdBy?.name || 'System Admin'}
                      </dd>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <dt className="font-medium text-gray-900">Total Categories</dt>
                      <dd className="text-gray-700 mt-1">
                        {(product.secondaryCategories?.length || 0) + 1} categories
                      </dd>
                    </div>
                  </div>
                </div>

                {/* Multi-Category Performance Analysis */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-yellow-600" />
                    🎯 Multi-Category Performance
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h5 className="font-medium text-gray-900 mb-2">Discovery Advantage</h5>
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-blue-600">
                          {(product.secondaryCategories?.length || 0) + 1}x
                        </div>
                        <div className="text-sm text-gray-600">
                          More discoverable than single-category products
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border">
                      <h5 className="font-medium text-gray-900 mb-2">Cross-Category Reach</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {product.primaryCategory && (
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                            <span className="text-sm text-gray-700">
                              {product.primaryCategory.name}: 100% relevance
                            </span>
                          </div>
                        )}
                        {product.secondaryCategories?.map((category, index) => (
                          <div key={category._id} className="flex items-center gap-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                            <span className="text-sm text-gray-700">
                              {category.name}: 85% relevance
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Insights */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">📊 Performance Insights</h4>
                  
                  <div className="space-y-3">
                    {analytics.multiCategoryAdvantage && (
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-800">Multi-Category Advantage Active</p>
                          <p className="text-sm text-green-700">
                            This product benefits from cross-category visibility and broader customer reach.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">SEO Performance</p>
                        <p className="text-sm text-blue-700">
                          Optimized for {(product.keywords?.split(',').length || 0)} target keywords across multiple categories.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <Zap className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-purple-800">Conversion Optimization</p>
                        <p className="text-sm text-purple-700">
                          Product appeals to {(product.secondaryCategories?.length || 0) + 1} different customer segments.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Export Section */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Download className="h-5 w-5 text-gray-600" />
                    Data Export & Analytics
                  </h3>
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    <button 
                      onClick={exportJSON}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export JSON
                    </button>
                    
                    <button 
                      onClick={exportCSV}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export CSV
                    </button>
                    
                    <button 
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Print Details
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Export product data for reporting, backup, or integration with external systems.
                  </p>
                </div>

                {/* Product History Timeline */}
                <div className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    Product History
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-green-800">Product Created</p>
                        <p className="text-sm text-green-700">
                          {new Date(product.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })} by {product.createdBy?.name || 'System Admin'}
                        </p>
                      </div>
                    </div>
                    
                    {product.updatedAt && product.updatedAt !== product.createdAt && (
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-blue-800">Last Modified</p>
                          <p className="text-sm text-blue-700">
                            {new Date(product.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })} by {product.lastModifiedBy?.name || 'System Admin'}
                          </p>
                        </div>
                      </div>
                    )}

                    {product.isFeatured && (
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-purple-800">Featured Product</p>
                          <p className="text-sm text-purple-700">
                            Product is currently featured and gets priority display
                          </p>
                        </div>
                      </div>
                    )}

                    {product.isOnSale && (
                      <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="font-medium text-orange-800">Sale Active</p>
                          <p className="text-sm text-orange-700">
                            Product is currently on sale
                            {product.saleEndDate && ` until ${new Date(product.saleEndDate).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border-2 border-red-200 rounded-lg p-6 bg-red-50">
                  <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Danger Zone
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Permanently Delete Product</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Once deleted, this product and all its data will be permanently removed. This action cannot be undone.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 ml-4"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Product
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Action Button for Mobile */}
        <div className="fixed bottom-6 right-6 lg:hidden">
          <button
            onClick={() => navigate(`/admin/products/${id}/edit`)}
            className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center"
          >
            <Edit size={20} />
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Product</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg mb-6 border border-red-200">
                <p className="text-red-800 font-medium mb-2">
                  You are about to permanently delete:
                </p>
                <p className="text-red-700 text-sm">
                  <span className="font-medium">Product:</span> {product.product_name}
                </p>
                <p className="text-red-700 text-sm">
                  <span className="font-medium">Brand:</span> {product.product_brand}
                </p>
                <p className="text-red-700 text-sm">
                  <span className="font-medium">ID:</span> {product._id}
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <p className="text-gray-700 text-sm">
                  ⚠️ This will permanently delete:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Product information and description</li>
                  <li>• All product images from Cloudinary</li>
                  <li>• SEO data and analytics</li>
                  <li>• Category associations</li>
                  <li>• Customer reviews and ratings</li>
                </ul>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductDetails;