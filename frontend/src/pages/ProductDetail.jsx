// frontend/src/pages/ProductDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  // Mock product data - replace with API call
  useEffect(() => {
    const mockProduct = {
      id: parseInt(id),
      name: "Safety Hard Hat - ANSI Approved",
      description: "Professional hard hat with adjustable suspension system designed for maximum protection and comfort in construction and industrial environments.",
      price: 1250,
      originalPrice: 1500,
      category: "head",
      industry: "construction",
      inStock: true,
      stockCount: 45,
      images: [
        "/images/products/hardhat-1.jpg",
        "/images/products/hardhat-2.jpg",
        "/images/products/hardhat-3.jpg"
      ],
      features: [
        "ANSI Z89.1 Type I Class C certified",
        "4-point suspension system",
        "Ratchet adjustment mechanism",
        "Lightweight polypropylene shell",
        "Sweat-wicking headband",
        "Accessory slots for attachments"
      ],
      specifications: {
        "Material": "High-density polyethylene (HDPE)",
        "Weight": "350g",
        "Size": "One size fits all (53-61cm)",
        "Color": "White, Yellow, Orange, Blue",
        "Standards": "ANSI Z89.1, CSA Z94.1",
        "Temperature Range": "-30°C to +50°C"
      },
      safetyStandards: [
        {
          name: "ANSI Z89.1",
          description: "American National Standard for Industrial Head Protection",
          icon: "🛡️"
        },
        {
          name: "CSA Z94.1",
          description: "Canadian Standard for Industrial Protective Headwear",
          icon: "✅"
        }
      ],
      relatedProducts: [2, 3, 4] // Product IDs
    };
    setProduct(mockProduct);
  }, [id]);

  const handleAddToCart = () => {
    // Add to cart functionality
    alert(`Added ${quantity} ${product.name} to cart`);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

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
                <Link to="/products" className="text-gray-500 hover:text-gray-700">Products</Link>
              </li>
              <li>
                <span className="text-gray-400 mx-2">/</span>
                <span className="text-gray-900 font-medium">{product.name}</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg border shadow-sm overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <svg className="w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg border-2 overflow-hidden ${
                    selectedImage === index ? 'border-yellow-400' : 'border-gray-200'
                  }`}
                >
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">Image {index + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-yellow-400 text-gray-900 px-2 py-1 text-xs font-bold rounded">
                  HEAD PROTECTION
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded">
                  In Stock
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-yellow-600">
                KSh {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    KSh {product.originalPrice.toLocaleString()}
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 text-sm font-medium rounded">
                    Save KSh {(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Key Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-900">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                    disabled={quantity >= product.stockCount}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stockCount} available
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors shadow-lg"
                >
                  Add to Cart
                </button>
                <button className="flex-1 border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition-colors">
                  Add to Wishlist
                </button>
              </div>
            </div>

            {/* Safety Standards */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Safety Standards</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.safetyStandards.map((standard, index) => (
                  <div key={index} className="bg-white rounded-lg border p-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{standard.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{standard.name}</h4>
                        <p className="text-sm text-gray-600">{standard.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-yellow-400 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === 'description' && (
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Description</h3>
                <div className="prose max-w-none text-gray-700">
                  <p className="mb-4">
                    This professional-grade safety hard hat is designed to provide superior protection in construction, 
                    industrial, and manufacturing environments. Built to exceed ANSI Z89.1 standards, it offers reliable 
                    impact protection while maintaining exceptional comfort for extended wear.
                  </p>
                  <p className="mb-4">
                    The lightweight polypropylene shell is engineered to withstand impacts while the advanced 4-point 
                    suspension system distributes weight evenly across the head. The ratchet adjustment mechanism ensures 
                    a secure, customized fit for head sizes ranging from 53-61cm.
                  </p>
                  <p>
                    Featuring integrated accessory slots, this hard hat is compatible with face shields, hearing protection, 
                    and other safety accessories. The sweat-wicking headband keeps you comfortable during long work shifts, 
                    while the durable construction ensures long-lasting protection.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                      <span className="font-medium text-gray-900">{key}:</span>
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Reviews</h3>
                
                {/* Review Summary */}
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="text-3xl font-bold text-gray-900">4.8</div>
                    <div>
                      <div className="flex items-center space-x-1 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L0 6.91l6.564-.954L10 0l3.436 5.956L20 6.91l-5.245 4.635L15.878 18z"/>
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">Based on 127 reviews</p>
                    </div>
                  </div>
                </div>

                {/* Sample Reviews */}
                <div className="space-y-6">
                  {[
                    {
                      name: "John Kamau",
                      rating: 5,
                      date: "2025-01-15",
                      title: "Excellent quality and comfort",
                      comment: "Been using this hard hat for 3 months on construction sites. Very comfortable and durable. The adjustment system works perfectly."
                    },
                    {
                      name: "Mary Wanjiku",
                      rating: 4,
                      date: "2025-01-10",
                      title: "Good value for money",
                      comment: "Great hard hat for the price. Fits well and feels secure. Would recommend for industrial use."
                    }
                  ].map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{review.name}</span>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg 
                                key={star} 
                                className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`} 
                                viewBox="0 0 20 20"
                              >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L0 6.91l6.564-.954L10 0l3.436 5.956L20 6.91l-5.245 4.635L15.878 18z"/>
                              </svg>
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{review.date}</span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-2">{review.title}</h4>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <button className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors">
                    Write a Review
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { id: 2, name: "Safety Goggles", price: 650, category: "Eye Protection" },
              { id: 3, name: "Work Gloves", price: 450, category: "Hand Protection" },
              { id: 4, name: "Safety Boots", price: 3200, category: "Foot Protection" },
              { id: 5, name: "Respirator Mask", price: 85, category: "Respiratory Protection" }
            ].map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/products/${relatedProduct.id}`}
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="p-4">
                  <div className="text-xs text-yellow-600 font-medium mb-1">{relatedProduct.category}</div>
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <div className="text-lg font-bold text-yellow-600">
                    KSh {relatedProduct.price.toLocaleString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;