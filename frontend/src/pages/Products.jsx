// frontend/src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);

  // Mock product data - replace with API call
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: "Safety Hard Hat - ANSI Approved",
        description: "Professional hard hat with adjustable suspension system",
        price: 1250,
        category: "head",
        industry: "construction",
        image: "/images/products/hardhat.jpg",
        inStock: true,
        features: ["ANSI Z89.1 certified", "4-point suspension", "Ratchet adjustment"]
      },
      {
        id: 2,
        name: "Safety Goggles - Anti-Fog",
        description: "Clear anti-fog safety goggles with UV protection",
        price: 650,
        category: "eye",
        industry: "manufacturing",
        image: "/images/products/goggles.jpg",
        inStock: true,
        features: ["Anti-fog coating", "UV protection", "Adjustable strap"]
      },
      {
        id: 3,
        name: "Cut-Resistant Work Gloves",
        description: "Level 3 cut-resistant gloves with grip coating",
        price: 450,
        category: "hand",
        industry: "manufacturing",
        image: "/images/products/gloves.jpg",
        inStock: true,
        features: ["Level 3 cut resistance", "Palm grip coating", "Breathable back"]
      },
      {
        id: 4,
        name: "Steel Toe Safety Boots",
        description: "Waterproof steel toe boots with slip-resistant sole",
        price: 3200,
        category: "foot",
        industry: "construction",
        image: "/images/products/boots.jpg",
        inStock: true,
        features: ["Steel toe cap", "Waterproof", "Slip-resistant sole"]
      },
      {
        id: 5,
        name: "N95 Respirator Mask",
        description: "NIOSH approved N95 filtering facepiece respirator",
        price: 85,
        category: "respiratory",
        industry: "healthcare",
        image: "/images/products/respirator.jpg",
        inStock: true,
        features: ["NIOSH approved", "95% filtration", "Comfortable fit"]
      },
      {
        id: 6,
        name: "High-Visibility Safety Vest",
        description: "Class 2 high-visibility safety vest with reflective tape",
        price: 890,
        category: "body",
        industry: "construction",
        image: "/images/products/vest.jpg",
        inStock: true,
        features: ["Class 2 visibility", "Reflective tape", "Breathable mesh"]
      },
      {
        id: 7,
        name: "Safety Face Shield",
        description: "Clear polycarbonate face shield with adjustable headband",
        price: 320,
        category: "eye",
        industry: "healthcare",
        image: "/images/products/faceshield.jpg",
        inStock: true,
        features: ["Polycarbonate lens", "Anti-fog", "Adjustable headband"]
      },
      {
        id: 8,
        name: "Hearing Protection Earmuffs",
        description: "Noise reduction rating 30dB hearing protection",
        price: 750,
        category: "hearing",
        industry: "manufacturing",
        image: "/images/products/earmuffs.jpg",
        inStock: true,
        features: ["30dB NRR", "Comfortable padding", "Adjustable headband"]
      }
    ];
    setProducts(mockProducts);
  }, []);

  // Filter products based on search params and filters
  useEffect(() => {
    let filtered = [...products];
    
    // Search filter
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    const categoryParam = searchParams.get('category') || selectedCategory;
    if (categoryParam) {
      filtered = filtered.filter(product => product.category === categoryParam);
      setSelectedCategory(categoryParam);
    }

    // Industry filter
    const industryParam = searchParams.get('industry') || selectedIndustry;
    if (industryParam) {
      filtered = filtered.filter(product => product.industry === industryParam);
      setSelectedIndustry(industryParam);
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredProducts(filtered);
  }, [products, searchParams, selectedCategory, selectedIndustry, priceRange, sortBy, sortOrder]);

  const categories = [
    { id: 'head', name: 'Head Protection', count: products.filter(p => p.category === 'head').length },
    { id: 'eye', name: 'Eye Protection', count: products.filter(p => p.category === 'eye').length },
    { id: 'hand', name: 'Hand Protection', count: products.filter(p => p.category === 'hand').length },
    { id: 'foot', name: 'Foot Protection', count: products.filter(p => p.category === 'foot').length },
    { id: 'respiratory', name: 'Respiratory Protection', count: products.filter(p => p.category === 'respiratory').length },
    { id: 'body', name: 'Body Protection', count: products.filter(p => p.category === 'body').length },
    { id: 'hearing', name: 'Hearing Protection', count: products.filter(p => p.category === 'hearing').length }
  ];

  const industries = [
    { id: 'construction', name: 'Construction' },
    { id: 'manufacturing', name: 'Manufacturing' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'mining', name: 'Mining' }
  ];

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedIndustry('');
    setPriceRange([0, 10000]);
    setSortBy('name');
    setSortOrder('asc');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li>
                <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              </li>
              <li>
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-gray-900 font-medium">Products</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button 
                  onClick={clearFilters}
                  className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {category.name} ({category.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Industries */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Industries</h4>
                <div className="space-y-2">
                  {industries.map(industry => (
                    <label key={industry.id} className="flex items-center">
                      <input
                        type="radio"
                        name="industry"
                        value={industry.id}
                        checked={selectedIndustry === industry.id}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="w-4 h-4 text-yellow-600 border-gray-300 focus:ring-yellow-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{industry.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-yellow-500 focus:border-yellow-500"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Safety Products</h1>
                <p className="text-gray-600">{filteredProducts.length} products found</p>
              </div>
              
              {/* Sort Options */}
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <label className="text-sm text-gray-700">Sort by:</label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="price-asc">Price Low to High</option>
                  <option value="price-desc">Price High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    {/* Product Image Placeholder */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    
                    {/* Stock Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        product.inStock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-2 right-2">
                      <span className="bg-yellow-400 text-gray-900 px-2 py-1 text-xs font-bold rounded">
                        {categories.find(c => c.id === product.category)?.name}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    {/* Features */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {product.features.slice(0, 2).map((feature, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                        {product.features.length > 2 && (
                          <span className="text-gray-500 text-xs">+{product.features.length - 2} more</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xl font-bold text-yellow-600">
                        KSh {product.price.toLocaleString()}
                      </div>
                      <Link
                        to={`/products/${product.id}`}
                        className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Products Found */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m8-4v4m-4-4v4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <button 
                  onClick={clearFilters}
                  className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;