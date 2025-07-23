// frontend/src/pages/admin/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  Package,
  Star,
  Eye,
  Edit,
  Search,
  Filter,
  Grid3X3,
  List,
  Image as ImageIcon,
  Shield,
  Copy,
  Archive,
  Zap,
  Clock
} from 'lucide-react';

const ProductList = () => {
  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  // Bulk action states
  const [bulkAction, setBulkAction] = useState('');
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  
  const navigate = useNavigate();
  const limit = 12;

  // Utility functions
  const formatPrice = (price) => {
    if (!price) return 'KES 0';
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? 'KES 0' : `KES ${numPrice.toLocaleString()}`;
  };

  const getStatusConfig = (status) => {
    const configs = {
      active: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', text: 'Active', dot: 'bg-emerald-500' },
      inactive: { color: 'bg-red-100 text-red-700 border-red-200', text: 'Inactive', dot: 'bg-red-500' },
      draft: { color: 'bg-amber-100 text-amber-700 border-amber-200', text: 'Draft', dot: 'bg-amber-500' },
      archived: { color: 'bg-gray-100 text-gray-700 border-gray-200', text: 'Archived', dot: 'bg-gray-500' },
      out_of_stock: { color: 'bg-gray-100 text-gray-700 border-gray-200', text: 'Out of Stock', dot: 'bg-gray-500' }
    };
    return configs[status?.toLowerCase()] || configs.draft;
  };

  const getStockStatus = (stock, lowStockThreshold = 10) => {
    if (stock === 0) return { color: 'text-red-600', text: 'Out of Stock', level: 'critical' };
    if (stock <= lowStockThreshold) return { color: 'text-amber-600', text: 'Low Stock', level: 'warning' };
    return { color: 'text-emerald-600', text: 'In Stock', level: 'good' };
  };

  // API functions
  const fetchProducts = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) setRefreshing(true);
      else setLoading(true);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(searchTerm && { search: searchTerm.trim() }),
        ...(filterCategory && { category: filterCategory }),
        ...(filterStatus && { status: filterStatus })
      });

      if (sortBy) {
        const sortMap = {
          product_price: sortOrder === 'asc' ? 'price_low' : 'price_high',
          stock: sortOrder === 'desc' ? 'stock_high' : 'stock_low',
          product_name: 'name',
          createdAt: sortOrder === 'desc' ? 'newest' : 'oldest'
        };
        queryParams.append('sort', sortMap[sortBy] || 'newest');
      }

      const response = await fetch(`/api/admin/products?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
          return;
        }
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setProducts(data.data || []);
        setTotalPages(data.pagination?.total || 1);
        setTotalProducts(data.pagination?.totalProducts || 0);
        setError('');
      } else {
        setError(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      setError(`Failed to fetch products: ${error.message}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        if (data.success) setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Enhanced delete with typed confirmation
  const handleDeleteProduct = async (productId) => {
    if (deleteConfirmText.toLowerCase() !== 'delete permanently') {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setProducts(products.filter(p => p._id !== productId));
        setSelectedProducts(selectedProducts.filter(id => id !== productId));
        setShowDeleteConfirm(false);
        setProductToDelete(null);
        setDeleteConfirmText('');
        setSuccess('Product deleted permanently!');
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(data.message || 'Failed to delete product');
      }
    } catch (error) {
      setError('Failed to delete product. Please try again.');
    }
  };

  // Enhanced bulk actions
  const handleBulkAction = async () => {
    if (!bulkAction || selectedProducts.length === 0) return;

    setBulkActionLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      let updateData = {};

      switch (bulkAction) {
        case 'activate':
          updateData = { status: 'active' };
          break;
        case 'deactivate':
          updateData = { status: 'inactive' };
          break;
        case 'archive':
          updateData = { status: 'archived' };
          break;
        case 'feature':
          updateData = { isFeatured: true };
          break;
        case 'unfeature':
          updateData = { isFeatured: false };
          break;
        case 'delete':
          // Handle bulk delete
          for (const productId of selectedProducts) {
            await fetch(`/api/admin/products/${productId}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
          }
          setProducts(products.filter(p => !selectedProducts.includes(p._id)));
          setSelectedProducts([]);
          setSuccess(`${selectedProducts.length} products deleted successfully!`);
          setTimeout(() => setSuccess(''), 4000);
          return;
        default:
          return;
      }

      // For non-delete bulk actions
      const response = await fetch('/api/admin/products/bulk-update', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productIds: selectedProducts,
          updateData
        })
      });

      if (response.ok) {
        // Update local state
        setProducts(products.map(product => 
          selectedProducts.includes(product._id) 
            ? { ...product, ...updateData }
            : product
        ));
        setSelectedProducts([]);
        setBulkAction('');
        setSuccess(`Bulk action applied to ${selectedProducts.length} products!`);
        setTimeout(() => setSuccess(''), 4000);
      } else {
        throw new Error('Bulk update failed');
      }
    } catch (error) {
      setError('Bulk action failed. Please try again.');
    } finally {
      setBulkActionLoading(false);
      setShowBulkConfirm(false);
    }
  };

  // Event handlers
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder(['product_price', 'stock'].includes(field) ? 'desc' : 'asc');
    }
    setCurrentPage(1);
  };

  const handleProductSelect = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === products.length ? [] : products.map(p => p._id)
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterStatus('');
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
  };

  // Calculate stats
  const stats = {
    total: totalProducts,
    active: products.filter(p => p.status === 'active').length,
    lowStock: products.filter(p => p.stock <= (p.lowStockThreshold || 10) && p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    featured: products.filter(p => p.isFeatured).length,
    onSale: products.filter(p => p.isOnSale).length
  };

  // Effects
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, sortBy, sortOrder, searchTerm, filterCategory, filterStatus]);

  // Loading state
  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-8"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Products</h2>
          <p className="text-gray-600">Please wait while we fetch your inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Product Inventory
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Manage your safety equipment catalog • {totalProducts} total products
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => fetchProducts(true)}
                disabled={refreshing}
                className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                Refresh
              </button>
              
              <Link
                to="/admin/products/create"
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
              >
                <Plus size={18} />
                Add Product
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Products</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 border border-emerald-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600">Active</p>
                <p className="text-3xl font-bold text-emerald-900">{stats.active}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-6 border border-amber-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600">Low Stock</p>
                <p className="text-3xl font-bold text-amber-900">{stats.lowStock}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Out of Stock</p>
                <p className="text-3xl font-bold text-red-900">{stats.outOfStock}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Featured</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.featured}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">On Sale</p>
                <p className="text-3xl font-bold text-purple-900">{stats.onSale}</p>
              </div>
              <Package className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products by name, brand, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 min-w-[160px]"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 min-w-[140px]"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              <div className="flex bg-gray-50 rounded-xl border border-gray-200">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-4 transition-all duration-200 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-4 transition-all duration-200 border-l border-gray-200 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Grid3X3 size={18} />
                </button>
              </div>
              {(searchTerm || filterCategory || filterStatus) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-4 bg-red-50 text-red-700 border border-red-200 rounded-xl hover:bg-red-100 transition-all duration-200 flex items-center gap-2"
                >
                  <XCircle size={16} />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-bold text-blue-900 text-lg">
                    {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                  </h3>
                  <p className="text-blue-700">Choose an action to apply to selected items</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={bulkAction}
                  onChange={(e) => setBulkAction(e.target.value)}
                  className="py-2 px-3 border border-blue-200 rounded-lg bg-white text-sm min-w-[150px]"
                >
                  <option value="">Choose action...</option>
                  <option value="activate">✅ Activate</option>
                  <option value="deactivate">❌ Deactivate</option>
                  <option value="archive">📦 Archive</option>
                  <option value="feature">⭐ Mark Featured</option>
                  <option value="unfeature">Remove Featured</option>
                  <option value="delete">🗑️ Delete</option>
                </select>
                
                <button
                  onClick={() => setShowBulkConfirm(true)}
                  disabled={!bulkAction || bulkActionLoading}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  {bulkActionLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  Apply Action
                </button>
                
                <button
                  onClick={() => setSelectedProducts([])}
                  className="px-6 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <Package className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
                <p className="text-gray-600 mb-8">Start by adding your first product</p>
                <Link
                  to="/admin/products/create"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200"
                >
                  <Plus size={18} />
                  Add Product
                </Link>
              </div>
            ) : (
              products.map((product) => {
                const statusConfig = getStatusConfig(product.status);
                const stockStatus = getStockStatus(product.stock, product.lowStockThreshold);
                
                return (
                  <div key={product._id} className={`bg-white rounded-2xl shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300 ${
                    selectedProducts.includes(product._id) 
                      ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105' 
                      : 'border-gray-100 hover:border-gray-200 hover:-translate-y-1'
                  }`}>
                    <div className="relative h-56 bg-gray-50">
                      {product.mainImage || product.product_image ? (
                        <img
                          src={product.mainImage || product.product_image}
                          alt={product.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon size={32} className="text-gray-400" />
                        </div>
                      )}
                      
                      {/* Selection checkbox */}
                      <div className="absolute top-4 left-4">
                        <div className={`
                          w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 cursor-pointer
                          ${selectedProducts.includes(product._id)
                            ? 'bg-blue-600 border-blue-600' 
                            : 'bg-white border-gray-300 hover:border-gray-400'
                          }
                        `} onClick={() => handleProductSelect(product._id)}>
                          {selectedProducts.includes(product._id) && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {product.isFeatured && (
                          <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                            <Star size={12} className="fill-current" />
                            Featured
                          </span>
                        )}
                        {product.isOnSale && (
                          <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                            Sale
                          </span>
                        )}
                      </div>

                      {/* Stock status badge */}
                      <div className="absolute bottom-4 right-4">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${stockStatus.level === 'good' ? 'bg-emerald-100 text-emerald-700' :
                            stockStatus.level === 'warning' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }
                        `}>
                          {stockStatus.text}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.product_name}</h3>
                      <p className="text-sm text-gray-500 mb-4">{product.category?.name || 'No category'}</p>
                      
                      <div className="mb-4">
                        {product.isOnSale && product.salePrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-emerald-600">
                              {formatPrice(product.salePrice)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.product_price)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-gray-900">
                            {formatPrice(product.product_price)}
                          </span>
                        )}
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">Stock</span>
                          <span className={`text-sm font-bold ${stockStatus.color}`}>
                            {product.stock || 0} units
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              stockStatus.level === 'good' ? 'bg-emerald-500' :
                              stockStatus.level === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min((product.stock / (product.lowStockThreshold || 10)) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
                          {statusConfig.text}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                        <Clock className="w-3 h-3" />
                        Created {new Date(product.createdAt).toLocaleDateString('en-KE', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/admin/products/${product._id}`}
                          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-all duration-200 text-sm font-medium"
                        >
                          <Eye size={14} />
                          View
                        </Link>
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 text-sm font-medium"
                        >
                          <Edit size={14} />
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            setProductToDelete(product);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          // Table View
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === products.length && products.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Price (KES)</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Created</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-20 text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
                        <Link
                          to="/admin/products/create"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                        >
                          <Plus size={16} />
                          Add Product
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => {
                      const statusConfig = getStatusConfig(product.status);
                      const stockStatus = getStockStatus(product.stock, product.lowStockThreshold);
                      
                      return (
                        <tr key={product._id} className={`hover:bg-gray-50 transition-colors ${
                          selectedProducts.includes(product._id) ? 'bg-blue-50' : ''
                        }`}>
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product._id)}
                              onChange={() => handleProductSelect(product._id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16">
                                {product.mainImage || product.product_image ? (
                                  <img
                                    src={product.mainImage || product.product_image}
                                    alt={product.product_name}
                                    className="w-16 h-16 rounded-xl object-cover"
                                  />
                                ) : (
                                  <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                                    <ImageIcon size={24} className="text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-gray-900 truncate">{product.product_name}</h3>
                                <p className="text-sm text-gray-600 truncate">{product.product_brand} • {product.category?.name || 'No category'}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {product.isFeatured && (
                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  )}
                                  {product.isOnSale && (
                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                      Sale
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              {product.isOnSale && product.salePrice ? (
                                <>
                                  <div className="font-semibold text-emerald-600">
                                    {formatPrice(product.salePrice)}
                                  </div>
                                  <div className="text-gray-500 line-through">
                                    {formatPrice(product.product_price)}
                                  </div>
                                </>
                              ) : (
                                <div className="font-semibold text-gray-900">
                                  {formatPrice(product.product_price)}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <div className="font-semibold text-gray-900">{product.stock || 0}</div>
                              <div className={`text-xs ${stockStatus.color}`}>{stockStatus.text}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                              <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
                              {statusConfig.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(product.createdAt).toLocaleDateString('en-KE', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/admin/products/${product._id}`}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View details"
                              >
                                <Eye size={16} />
                              </Link>
                              <Link
                                to={`/admin/products/${product._id}/edit`}
                                className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                title="Edit product"
                              >
                                <Edit size={16} />
                              </Link>
                              <button
                                onClick={() => {
                                  setProductToDelete(product);
                                  setShowDeleteConfirm(true);
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete product"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-12 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 px-8 py-6">
            <div className="text-gray-700 font-medium">
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalProducts)} of {totalProducts} products
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                Previous
              </button>
              
              {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = index + 1;
                } else if (currentPage <= 3) {
                  pageNum = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + index;
                } else {
                  pageNum = currentPage - 2 + index;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-3 font-medium rounded-xl transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-6 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Delete Confirmation Modal */}
      {showDeleteConfirm && productToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Permanent Deletion</h3>
                <p className="text-red-600 font-medium mt-1">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                You are about to permanently delete:
              </p>
              <div className="bg-gray-50 rounded-2xl p-4 border-l-4 border-red-500">
                <div className="flex items-center gap-3">
                  {(productToDelete.mainImage || productToDelete.product_image) ? (
                    <img
                      src={productToDelete.mainImage || productToDelete.product_image}
                      alt={productToDelete.product_name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package size={20} className="text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{productToDelete.product_name}</p>
                    <p className="text-sm text-gray-600">Stock: {productToDelete.stock || 0} units</p>
                    <p className="text-sm text-gray-600">{formatPrice(productToDelete.product_price)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="bg-gray-100 px-2 py-1 rounded font-mono text-red-600">delete permanently</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                autoFocus
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setProductToDelete(null);
                  setDeleteConfirmText('');
                }}
                className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(productToDelete._id)}
                disabled={deleteConfirmText.toLowerCase() !== 'delete permanently'}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
              >
                <Trash2 size={16} />
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Action Confirmation Modal */}
      {showBulkConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Bulk Action Confirmation</h3>
                <p className="text-gray-600 mt-1">Apply action to selected products</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to <strong>{bulkAction}</strong> {selectedProducts.length} selected product{selectedProducts.length > 1 ? 's' : ''}?
              </p>
              
              {bulkAction === 'delete' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold">Warning: This action cannot be undone!</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkConfirm(false)}
                className="flex-1 px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkAction}
                disabled={bulkActionLoading}
                className={`flex-1 px-6 py-3 text-white rounded-xl font-medium flex items-center justify-center gap-2 ${
                  bulkAction === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                {bulkActionLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Confirm Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {(success || error) && (
        <div className={`fixed bottom-6 right-6 max-w-md p-6 rounded-2xl shadow-2xl border z-50 transform transition-all duration-300 ${
          success 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center gap-3">
            {success ? (
              <CheckCircle size={24} className="text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle size={24} className="text-red-600 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="font-semibold">{success || error}</p>
            </div>
            <button
              onClick={() => {
                setSuccess('');
                setError('');
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;