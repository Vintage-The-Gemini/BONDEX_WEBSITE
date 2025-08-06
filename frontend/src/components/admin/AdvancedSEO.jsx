// frontend/src/components/admin/AdvancedSEO.jsx
import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  TrendingUp, 
  Target, 
  Sparkles, 
  Eye,
  Share2,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Zap
} from 'lucide-react';

const AdvancedSEO = ({ 
  formData, 
  onFormDataChange, 
  selectedProtectionType, 
  selectedIndustries = [],
  protectionTypes = [],
  industries = []
}) => {
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [seoScore, setSeoScore] = useState(0);
  const [seoAnalysis, setSeoAnalysis] = useState({});

  // Auto-generate SEO with RUSSIAN PRECISION
  useEffect(() => {
    if (autoGenerate && formData.product_name) {
      generateAdvancedSEO();
    }
  }, [formData.product_name, formData.product_description, selectedProtectionType, selectedIndustries, autoGenerate]);

  // Calculate SEO score in real-time
  useEffect(() => {
    calculateSEOScore();
  }, [formData.metaTitle, formData.metaDescription, formData.product_name, formData.product_description]);

  const generateAdvancedSEO = () => {
    const protectionTypeName = protectionTypes.find(p => p._id === selectedProtectionType)?.name || '';
    const industryNames = industries
      .filter(i => selectedIndustries.includes(i._id))
      .map(i => i.name);

    // ADVANCED META TITLE with PRECISION
    if (!formData.metaTitle || autoGenerate) {
      let metaTitle = '';
      
      if (protectionTypeName && industryNames.length > 0) {
        // Multi-industry title
        if (industryNames.length === 1) {
          metaTitle = `${formData.product_name} - ${protectionTypeName} for ${industryNames[0]} | Kenya`;
        } else {
          metaTitle = `${formData.product_name} - ${protectionTypeName} | Multi-Industry Use Kenya`;
        }
      } else if (protectionTypeName) {
        metaTitle = `${formData.product_name} - ${protectionTypeName} | Kenya Safety Equipment`;
      } else {
        metaTitle = `${formData.product_name} | Professional Safety Equipment Kenya`;
      }
      
      // Optimize for Google's 60-character limit
      metaTitle = metaTitle.substring(0, 60);
      
      onFormDataChange('metaTitle', metaTitle);
    }

    // ADVANCED META DESCRIPTION with CONVERSION OPTIMIZATION
    if (!formData.metaDescription || autoGenerate) {
      const brandText = formData.product_brand ? `${formData.product_brand} ` : '';
      const priceText = formData.product_price ? `From KES ${parseInt(formData.product_price).toLocaleString()}. ` : '';
      const industryText = industryNames.length > 0 ? `Perfect for ${industryNames.join(', ').toLowerCase()}. ` : '';
      const descriptionSnippet = formData.product_description ? 
        formData.product_description.substring(0, 60) + '... ' : '';
      
      const metaDescription = `${brandText}${protectionTypeName.toLowerCase()} in Kenya. ${descriptionSnippet}${industryText}${priceText}✓ Free Nairobi delivery ✓ Certified quality ✓ Expert support`;
      
      // Optimize for Google's 160-character limit
      const optimizedDescription = metaDescription.substring(0, 160);
      
      onFormDataChange('metaDescription', optimizedDescription);
    }

    // AUTO-GENERATE KEYWORDS (SEO TARGETING)
    if (autoGenerate) {
      const keywords = [
        formData.product_name?.toLowerCase(),
        protectionTypeName?.toLowerCase(),
        ...industryNames.map(name => name.toLowerCase()),
        formData.product_brand?.toLowerCase(),
        'safety equipment kenya',
        'ppe equipment',
        'safety gear nairobi',
        'professional safety',
        'certified equipment',
        'workplace safety'
      ].filter(Boolean).join(', ');

      onFormDataChange('keywords', keywords);
    }

    // GENERATE PRODUCT SLUG
    if (formData.product_name && (!formData.slug || autoGenerate)) {
      const slug = formData.product_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      onFormDataChange('slug', slug);
    }
  };

  // Calculate SEO Score (0-100)
  const calculateSEOScore = () => {
    let score = 0;
    const analysis = {};

    // Title optimization (25 points)
    if (formData.metaTitle) {
      if (formData.metaTitle.length >= 30 && formData.metaTitle.length <= 60) {
        score += 25;
        analysis.title = { status: 'good', message: 'Title length is optimal' };
      } else if (formData.metaTitle.length > 0) {
        score += 15;
        analysis.title = { 
          status: 'warning', 
          message: `Title should be 30-60 characters (currently ${formData.metaTitle.length})` 
        };
      } else {
        analysis.title = { status: 'error', message: 'Title is required' };
      }
    }

    // Description optimization (25 points)
    if (formData.metaDescription) {
      if (formData.metaDescription.length >= 120 && formData.metaDescription.length <= 160) {
        score += 25;
        analysis.description = { status: 'good', message: 'Description length is optimal' };
      } else if (formData.metaDescription.length > 0) {
        score += 15;
        analysis.description = { 
          status: 'warning', 
          message: `Description should be 120-160 characters (currently ${formData.metaDescription.length})` 
        };
      } else {
        analysis.description = { status: 'error', message: 'Description is required' };
      }
    }

    // Product name in title (15 points)
    if (formData.metaTitle && formData.product_name && 
        formData.metaTitle.toLowerCase().includes(formData.product_name.toLowerCase())) {
      score += 15;
      analysis.nameInTitle = { status: 'good', message: 'Product name included in title' };
    } else {
      analysis.nameInTitle = { status: 'warning', message: 'Consider including product name in title' };
    }

    // Brand presence (10 points)
    if (formData.product_brand && formData.metaTitle?.includes(formData.product_brand)) {
      score += 10;
      analysis.brand = { status: 'good', message: 'Brand mentioned in SEO' };
    } else {
      analysis.brand = { status: 'info', message: 'Brand could be included for better recognition' };
    }

    // Keywords presence (15 points)
    if (formData.keywords && formData.keywords.length > 20) {
      score += 15;
      analysis.keywords = { status: 'good', message: 'Good keyword coverage' };
    } else {
      analysis.keywords = { status: 'warning', message: 'Add more relevant keywords' };
    }

    // Location targeting (10 points)
    const hasLocation = (formData.metaTitle?.toLowerCase().includes('kenya') || 
                        formData.metaDescription?.toLowerCase().includes('kenya') ||
                        formData.metaDescription?.toLowerCase().includes('nairobi'));
    if (hasLocation) {
      score += 10;
      analysis.location = { status: 'good', message: 'Local SEO optimized' };
    } else {
      analysis.location = { status: 'warning', message: 'Add location keywords for local SEO' };
    }

    setSeoScore(score);
    setSeoAnalysis(analysis);
  };

  const getSEOScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSEOScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Work';
    return 'Poor';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Globe className="h-5 w-5 text-blue-600" />
          Advanced SEO Optimization
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
            🚀 PRECISION SEO
          </span>
        </h2>
        
        {/* SEO Score */}
        <div className={`px-4 py-2 rounded-lg font-bold ${getSEOScoreColor(seoScore)}`}>
          SEO Score: {seoScore}/100 ({getSEOScoreLabel(seoScore)})
        </div>
      </div>

      {/* Auto-Generate Toggle */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={autoGenerate}
            onChange={(e) => setAutoGenerate(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900">Auto-generate SEO fields</span>
          </div>
        </label>
        <p className="text-sm text-blue-700 mt-1 ml-7">
          Automatically creates optimized meta tags based on product info and categories
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SEO Fields */}
        <div className="space-y-4">
          {/* Meta Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title *
              <span className="text-xs text-gray-500 ml-2">(Google Search Title)</span>
            </label>
            <input
              type="text"
              value={formData.metaTitle || ''}
              onChange={(e) => onFormDataChange('metaTitle', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Auto-generated based on product name and categories"
            />
            <div className="flex justify-between text-xs mt-1">
              <span className={formData.metaTitle?.length > 60 ? 'text-red-500' : 'text-gray-500'}>
                {formData.metaTitle?.length || 0}/60 characters
              </span>
              {seoAnalysis.title && (
                <span className={
                  seoAnalysis.title.status === 'good' ? 'text-green-600' :
                  seoAnalysis.title.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }>
                  {seoAnalysis.title.message}
                </span>
              )}
            </div>
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description *
              <span className="text-xs text-gray-500 ml-2">(Google Search Description)</span>
            </label>
            <textarea
              value={formData.metaDescription || ''}
              onChange={(e) => onFormDataChange('metaDescription', e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Auto-generated conversion-optimized description"
            />
            <div className="flex justify-between text-xs mt-1">
              <span className={formData.metaDescription?.length > 160 ? 'text-red-500' : 'text-gray-500'}>
                {formData.metaDescription?.length || 0}/160 characters
              </span>
              {seoAnalysis.description && (
                <span className={
                  seoAnalysis.description.status === 'good' ? 'text-green-600' :
                  seoAnalysis.description.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                }>
                  {seoAnalysis.description.message}
                </span>
              )}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SEO Keywords
              <span className="text-xs text-gray-500 ml-2">(Comma-separated)</span>
            </label>
            <textarea
              value={formData.keywords || ''}
              onChange={(e) => onFormDataChange('keywords', e.target.value)}
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Auto-generated based on categories and product details"
            />
          </div>

          {/* URL Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Slug
              <span className="text-xs text-gray-500 ml-2">(Product page URL)</span>
            </label>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 px-3 py-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">
                bondexsafety.com/products/
              </span>
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => onFormDataChange('slug', e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="auto-generated-from-name"
              />
            </div>
          </div>
        </div>

        {/* SEO Analysis & Preview */}
        <div className="space-y-4">
          
          {/* SEO Score Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              SEO Analysis
            </h4>
            
            <div className="space-y-2">
              {Object.entries(seoAnalysis).map(([key, analysis]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center gap-1">
                    {analysis.status === 'good' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : analysis.status === 'warning' ? (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className={
                      analysis.status === 'good' ? 'text-green-600' :
                      analysis.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }>
                      {analysis.status === 'good' ? 'Good' : 
                       analysis.status === 'warning' ? 'OK' : 'Needs Work'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Google Search Preview */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Search className="h-4 w-4" />
              Google Search Preview
            </h4>
            
            <div className="bg-white border rounded-lg p-4 space-y-2">
              <div className="text-xs text-green-600">
                bondexsafety.com › products › {formData.slug || 'product-name'}
              </div>
              <div className="text-lg text-blue-600 hover:underline cursor-pointer">
                {formData.metaTitle || formData.product_name || 'Product Title'}
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                {formData.metaDescription || '