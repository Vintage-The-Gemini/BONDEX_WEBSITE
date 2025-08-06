// frontend/src/components/FeaturedProducts.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';

const FeaturedProducts = ({ onOpenProductModal, onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?featured=true&limit=8');
        const data = await response.json();
        setProducts(data.products || getSampleProducts());
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(getSampleProducts());
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Sample products fallback
  const getSampleProducts = () => [
    {
      _id: '1',
      name: 'Professional Safety Helmet',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 24
    },
    {
      _id: '2',
      name: 'N95 Medical Masks (50 Pack)',
      price: 1500,
      image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 156
    },
    {
      _id: '3',
      name: 'Steel Toe Safety Boots',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 89
    },
    {
      _id: '4',
      name: 'Safety Goggles Clear',
      price: 800,
      image: 'https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 67
    },
    {
      _id: '5',
      name: 'High-Vis Safety Vest',
      price: 1200,
      image: 'https://images.unsplash.com/photo-1594608661623-4b64b4de8e63?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 43
    },
    {
      _id: '6',
      name: 'Work Gloves Heavy Duty',
      price: 350,
      image: 'https://images.unsplash.com/photo-1559226947-8cffc3a59d82?w=300&h=300&fit=crop',
      rating: 4.4,
      reviews: 78
    },
    {
      _id: '7',
      name: 'Disposable Face Shields',
      price: 200,
      image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=300&h=300&fit=crop',
      rating: 4.3,
      reviews: 92
    },
    {
      _id: '8',
      name: 'Reflective Traffic Cones',
      price: 600,
      image: 'https://images.unsplash.com/photo-1517260739097-b1a6fc15d0f1?w=300&h=300&fit=crop',
      rating: 4.2,
      reviews: 31
    }
  ];

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600">Top-rated safety equipment trusted by professionals</p>
          </div>
          <Link 
            to="/products"
            className="hidden md:flex items-center text-blue-600 hover:text-blue-700 font-semibold"
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {products.slice(0, 8).map((product) => (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow group"
            >
              {/* Product Image */}
              <Link to={`/products/${product._id}`}>
                <img 
                  src={product.image || product.images?.[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              {/* Product Info */}
              <div className="p-4">
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price & Add to Cart */}
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">
                    KES {product.price?.toLocaleString() || '0'}
                  </span>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="text-center md:hidden">
          <Link 
            to="/products"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View All Products <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;