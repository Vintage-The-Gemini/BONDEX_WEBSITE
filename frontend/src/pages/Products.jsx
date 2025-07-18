// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Grid, List, ChevronDown, Star, ShoppingCart, 
  Eye, Heart, SlidersHorizontal, X, ArrowUpDown, MapPin 
} from 'lucide-react';
import ProductFilters from '../components/ProductFilters';

const Products = ({ onOpenProductModal, onAddToCart, defaultCategory, defaultIndustry, defaultFilter }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    selectedCategories: defaultCategory ? [defaultCategory] : [],
    selectedIndustries: defaultIndustry ? [defaultIndustry] : [],
    selectedBrands: [],
    priceRange: [0, 50000],
    selectedRating: 0,
    inStockOnly: false,
    onSaleOnly: defaultFilter === 'onSale' || false,
    freeShipping: false,
    bestSellers: false,
    newArrivals: false,
    premium: false,
    bulkDiscount: false
  });

  // Mock product data - replace with API call
  const mockProducts = [
    {
      id: 1,
      name: "Professional Safety Helmet with Chin Strap",
      category: "Head Protection",
      industry: "Construction",
      brand: "SafetyFirst",
      price: 2500,
      originalPrice: 3000,
      rating: 4.8,
      reviews: 124,
      image: "🪖",
      inStock: 15,
      onSale: true,
      features: ["CE Certified", "Adjustable", "Lightweight", "UV Resistant"],
      description: "High-quality safety helmet designed for construction and industrial use."
    },
    {
      id: 2,
      name: "Steel Toe Safety Boots - Waterproof",
      category: "Foot Protection",
      industry: "Construction",
      brand: "SteelGuard",
      price: 4800,
      originalPrice: null,
      rating: 4.9,
      reviews: 89,
      image: "🥾",
      inStock: 8,
      onSale: false,
      features: ["Steel Toe", "Slip Resistant", "Waterproof", "Oil Resistant"],
      description: "Premium steel toe boots with superior protection and comfort."
    },
    {
      id: 3,
      name: "Anti-Fog Safety Goggles Clear Lens",
      category: "Eye Protection",
      industry: "Manufacturing",
      brand: "VisionSafe",
      price: 800,
      originalPrice: 1200,
      rating: 4.7,
      reviews: 156,
      image: "🥽",
      inStock: 25,
      onSale: true,
      features: ["Anti-Fog", "UV Protection", "Comfortable", "Scratch Resistant"],
      description: "Clear safety goggles with anti-fog coating for optimal visibility."
    },
    {
      id: 4,
      name: "Nitrile Work Gloves - Chemical Resistant",
      category: "Hand Protection",
      industry: "Medical",
      brand: "ChemGuard",
      price: 350,
      originalPrice: null,
      rating: 4.6,
      reviews: 203,
      image: "🧤",
      inStock: 50,
      onSale: false,
      features: ["Chemical Resistant", "Durable", "Comfortable Grip", "Powder Free"],
      description: "High-quality nitrile gloves for medical and industrial applications."
    },
    {
      id: 5,
      name: "High-Visibility Safety Vest Class 2",
      category: "Workwear",
      industry: "Construction",
      brand: "VisiBright",
      price: 1200,
      originalPrice: 1500,
      rating: 4.5,
      reviews: 78,
      image: "🦺",
      inStock: 30,
      onSale: true,
      features: ["Reflective Strips", "Breathable", "Machine Washable", "Class 2 Rated"],
      description: "High-visibility safety vest meeting ANSI Class 2 standards."
    },
    {
      id: 6,
      name: "N95 Respirator Masks (50 Pack)",
      category: "Breathing Protection",
      industry: "Medical",
      brand: "BreatheSafe",
      price: 2800,
      originalPrice: null,
      rating: 4.9,
      reviews: 312,
      image: "😷",
      inStock: 100,
      onSale: false,
      features: ["FDA Approved", "Comfortable Fit", "95% Filtration", "Individually Wrapped"],
      description: "FDA approved N95 respirator masks for medical professionals."
    },
    {
      id: 7,
      name: "Cut-Resistant Work Gloves Level 5",
      category: "Hand Protection",
      industry: "Manufacturing",
      brand: "CutShield",
      price: 650,
      originalPrice: 850,
      rating: 4.8,
      reviews: 92,
      image: "🧤",
      inStock: 20,
      onSale: true,
      features: ["Level 5 Cut Resistance", "Puncture Resistant", "Machine Washable", "Touchscreen Compatible"],
      description: "Maximum cut protection for handling sharp materials."
    },
    {
      id: 8,
      name: "Full Face Respirator with P100 Filter",
      category: "Breathing Protection",
      industry: "Manufacturing",
      brand: "AirGuard",
      price: 3500,
      originalPrice: null,
      rating: 4.7,
      reviews: 45,
      image: "😷",
      inStock: 12,
      onSale: false,
      features: ["P100 Filter", "Full Face Protection", "Anti-Fog Lens", "Comfortable Seal"],
      description: "Professional full face respirator for hazardous environments."
    },
    {
      id: 9,
      name: "Leather Work Gloves Heavy Duty",
      category: "Hand Protection",
      industry: "Construction",
      brand: "ToughGrip",
      price: 450,
      originalPrice: 600,
      rating: 4.4,
      reviews: 67,
      image: "🧤",
      inStock: 35,
      onSale: true,
      features: ["Genuine Leather", "Reinforced Palm", "Breathable", "Durable"],
      description: "Heavy-duty leather gloves for construction and manual work."
    },
    {
      id: 10,
      name: "Safety Glasses with Side Shields",
      category: "Eye Protection",
      industry: "Manufacturing",
      brand: "ClearVision",
      price: 250,
      originalPrice: null,
      rating: 4.3,
      reviews: 134,
      image: "🥽",
      inStock: 60,
      onSale: false,
      features: ["Impact Resistant", "Side Shields", "Anti-Scratch", "Lightweight"],
      description: "Comfortable safety glasses with comprehensive eye protection."
    }
  ];

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' },
    { value: 'name', label: 'Name A-Z' }
  ];

  useEffect(() => {
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, filters, searchTerm, sortBy]);

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter(product => filters.selectedCategories.includes(product.category));
    }

    // Industry filter
    if (filters.selectedIndustries.length > 0) {
      filtered = filtered.filter(product => filters.selectedIndustries.includes(product.industry));
    }

    // Brand filter
    if (filters.selectedBrands.length > 0) {
      filtered = filtered.filter(product => filters.selectedBrands.includes(product.brand));
    }

    // Price range filter
    filtered = filtered.filter(product => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]);

    // Rating filter
    if (filters.selectedRating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.selectedRating);
    }

    // Stock filter
    if (filters.inStockOnly) {
      filtered = filtered.filter(product => product.inStock > 0);
    }

    // Sale filter
    if (filters.onSaleOnly) {
      filtered = filtered.filter(product => product.onSale);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return b.id - a.id; // Assuming higher ID = newer
        default:
          return 0; // Featured
      }
    });

    setFilteredProducts(filtered);
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      selectedCategories: [],
      selectedIndustries: [],
      selectedBrands: [],
      priceRange: [0, 50000],
      selectedRating: 0,
      inStockOnly: false,
      onSaleOnly: false,
      freeShipping: false,
      bestSellers: false,
      newArrivals: false,
      premium: false,
      bulkDiscount: false
    });
    setSearchTerm('');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(price);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {defaultCategory ? `${defaultCategory} Products` :
                 defaultIndustry ? `${defaultIndustry} Safety Equipment` :
                 'Safety Equipment Catalog'}
              </h1>
              <p className="text-gray-600 mt-2">
                Professional safety equipment for all industries - {filteredProducts.length} products found
              </p>
            </div>
            
            {/* View Toggle & Mobile Filter Button */}
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
                {Object.values(filters).some(f => Array.isArray(f) ? f.length > 0 : f) && (
                  <span className="bg-primary-500 text-white rounded-full px-2 py-1 text-xs">
                    Active
                  </span>
                )}
              </button>

              {/* View Mode Toggle */}
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search and Sort Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products, features, or brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-8 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <ArrowUpDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar - Always Visible */}
          <div className="hidden md:block w-80">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearAllFilters}
              productCount={filteredProducts.length}
            />
          </div>

          {/* Mobile Filters - Toggle Visibility */}
          {showMobileFilters && (
            <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
              <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4">
                  <ProductFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearAllFilters}
                    productCount={filteredProducts.length}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Products Grid/List */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearAllFilters}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 
                'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 
                'space-y-4'
              }>
                {filteredProducts.map(product => (
                  <div key={product.id} className={`bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow group ${
                    viewMode === 'list' ? 'flex items-center p-4' : 'overflow-hidden'
                  }`}>
                    {viewMode === 'grid' ? (
                      // Grid View
                      <>
                        <div className="relative p-6 text-center bg-gray-50">
                          <div className="text-6xl mb-4">{product.image}</div>
                          
                          {product.onSale && (
                            <span className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              Sale
                            </span>
                          )}

                          <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => onOpenProductModal(product)}
                              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
                            >
                              <Eye className="h-4 w-4 text-gray-600" />
                            </button>
                            <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50">
                              <Heart className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="mb-2">
                            <span className="text-xs text-primary-600 font-medium">{product.category}</span>
                            <span className="text-xs text-gray-500 ml-2">• {product.industry}</span>
                          </div>
                          
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {product.name}
                          </h3>

                          <div className="flex items-center mb-2">
                            {renderStars(product.rating)}
                            <span className="ml-1 text-sm text-gray-600">({product.reviews})</span>
                          </div>

                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <span className="text-lg font-bold text-gray-900">
                                {formatPrice(product.price)}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  {formatPrice(product.originalPrice)}
                                </span>
                              )}
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              product.inStock > 10 ? 'bg-green-100 text-green-800' :
                              product.inStock > 0 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {product.inStock > 0 ? `${product.inStock} in stock` : 'Out of stock'}
                            </span>
                          </div>

                          <button
                            onClick={() => onAddToCart(product)}
                            disabled={product.inStock === 0}
                            className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            <span>{product.inStock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      // List View
                      <>
                        <div className="text-4xl mr-4">{product.image}</div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-sm text-primary-600 font-medium">{product.category}</span>
                                <span className="text-sm text-gray-500">• {product.industry}</span>
                                <span className="text-sm text-gray-500">• {product.brand}</span>
                              </div>
                              
                              <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                              
                              <div className="flex items-center space-x-4 mb-2">
                                <div className="flex items-center">
                                  {renderStars(product.rating)}
                                  <span className="ml-1 text-sm text-gray-600">({product.reviews})</span>
                                </div>
                                
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  product.inStock > 10 ? 'bg-green-100 text-green-800' :
                                  product.inStock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {product.inStock > 0 ? `${product.inStock} in stock` : 'Out of stock'}
                                </span>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                              
                              <div className="flex flex-wrap gap-1">
                                {product.features.slice(0, 3).map((feature, index) => (
                                  <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="text-right ml-4">
                              <div className="mb-2">
                                <span className="text-xl font-bold text-gray-900">
                                  {formatPrice(product.price)}
                                </span>
                                {product.originalPrice && (
                                  <div className="text-sm text-gray-500 line-through">
                                    {formatPrice(product.originalPrice)}
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => onOpenProductModal(product)}
                                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 p-2 rounded-lg"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => onAddToCart(product)}
                                  disabled={product.inStock === 0}
                                  className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-semibold px-4 py-2 rounded-lg flex items-center space-x-1"
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                  <span>Add to Cart</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

  