// frontend/src/components/admin/ProductStatsCards.jsx
import React from 'react';
import { 
  Package, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Star, 
  TrendingDown,
  TrendingUp,
  DollarSign
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, bgColor, trend, trendValue }) => (
  <div className={`${bgColor} rounded-2xl p-6 border border-opacity-20 hover:shadow-lg transition-all duration-300 group relative overflow-hidden`}>
    {/* Background Pattern */}
    <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
      <Icon className="w-full h-full" />
    </div>
    
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${color.replace('text-', 'bg-').replace('600', '100')} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
            trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trendValue}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-300">
          {value}
        </p>
      </div>
    </div>
  </div>
);

const ProductStatsCards = ({ products = [], totalProducts = 0 }) => {
  // Calculate stats
  const stats = {
    total: totalProducts,
    active: products.filter(p => p.status === 'active').length,
    lowStock: products.filter(p => p.stock <= (p.lowStockThreshold || 10) && p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    featured: products.filter(p => p.isFeatured).length,
    onSale: products.filter(p => p.isOnSale).length
  };

  // Calculate total inventory value
  const totalValue = products.reduce((sum, product) => {
    const price = product.isOnSale && product.salePrice ? product.salePrice : product.product_price;
    return sum + (price * product.stock);
  }, 0);

  const formatKES = (amount) => {
    if (amount >= 1000000) {
      return `KES ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `KES ${(amount / 1000).toFixed(1)}K`;
    }
    return `KES ${amount.toLocaleString()}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6 mb-8">
      <StatCard
        title="Total Products"
        value={stats.total}
        icon={Package}
        color="text-blue-600"
        bgColor="bg-gradient-to-br from-blue-50 to-blue-100"
        trend="up"
        trendValue="+12%"
      />
      
      <StatCard
        title="Active Products"
        value={stats.active}
        icon={CheckCircle}
        color="text-emerald-600"
        bgColor="bg-gradient-to-br from-emerald-50 to-emerald-100"
        trend="up"
        trendValue="+8%"
      />
      
      <StatCard
        title="Low Stock"
        value={stats.lowStock}
        icon={AlertTriangle}
        color="text-amber-600"
        bgColor="bg-gradient-to-br from-amber-50 to-amber-100"
        trend={stats.lowStock > 5 ? "down" : "up"}
        trendValue={stats.lowStock > 5 ? "-5%" : "+2%"}
      />
      
      <StatCard
        title="Out of Stock"
        value={stats.outOfStock}
        icon={XCircle}
        color="text-red-600"
        bgColor="bg-gradient-to-br from-red-50 to-red-100"
        trend={stats.outOfStock > 0 ? "up" : "down"}
        trendValue={stats.outOfStock > 0 ? "+3%" : "0%"}
      />
      
      <StatCard
        title="Featured"
        value={stats.featured}
        icon={Star}
        color="text-yellow-600"
        bgColor="bg-gradient-to-br from-yellow-50 to-yellow-100"
        trend="up"
        trendValue="+15%"
      />
      
      <StatCard
        title="On Sale"
        value={stats.onSale}
        icon={TrendingDown}
        color="text-purple-600"
        bgColor="bg-gradient-to-br from-purple-50 to-purple-100"
        trend="up"
        trendValue="+25%"
      />
      
      <StatCard
        title="Total Value"
        value={formatKES(totalValue)}
        icon={DollarSign}
        color="text-green-600"
        bgColor="bg-gradient-to-br from-green-50 to-green-100"
        trend="up"
        trendValue="+18%"
      />
    </div>
  );
};

export default ProductStatsCards;