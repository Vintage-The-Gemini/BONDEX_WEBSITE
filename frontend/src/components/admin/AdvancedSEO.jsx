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
  Zap,
  Brain,
  Rocket,
  Award,
  MapPin,
  Plus
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
  const [keywordSuggestions, setKeywordSuggestions] = useState([]);
  const [competitorAnalysis, setCompetitorAnalysis] = useState({});

  // 🎯 RUSSIAN PRECISION: Auto-generate SEO with military accuracy
  useEffect(() => {
    if (autoGenerate && formData.product_name) {
      generateAdvancedSEO();
    }
  }, [formData.product_name, formData.product_description, selectedProtectionType, selectedIndustries, autoGenerate]);

  // 📊 Real-time SEO score calculation
  useEffect(() => {
    calculateSEOScore();
    generateKeywordSuggestions();
  }, [formData.metaTitle, formData.metaDescription, formData.product_name, formData.product_description, formData.keywords]);

  // 🚀 PRECISION SEO GENERATION with Multi-Category Intelligence
  const generateAdvancedSEO = () => {
    const protectionTypeName = protectionTypes.find(p => p._id === selectedProtectionType)?.name || '';
    const industryNames = industries
      .filter(i => selectedIndustries.includes(i._id))
      .map(i => i.name);

    // 🎯 SNIPER-LEVEL META TITLE GENERATION
    if (!formData.metaTitle || autoGenerate) {
      let metaTitle = '';
      const productName = formData.product_name || '';
      const brand = formData.product_brand ? `${formData.product_brand} ` : '';
      const price = formData.product_price ? ` - KES ${parseInt(formData.product_price).toLocaleString()}` : '';
      
      if (protectionTypeName && industryNames.length > 0) {
        if (industryNames.length === 1) {
          // Single industry optimization
          metaTitle = `${brand}${productName} | ${protectionTypeName} for ${industryNames[0]} Kenya${price}`;
        } else if (industryNames.length === 2) {
          // Dual industry optimization  
          metaTitle = `${brand}${productName} | ${protectionTypeName} - ${industryNames.join(' & ')} Kenya`;
        } else {
          // Multi-industry optimization
          metaTitle = `${brand}${productName} | ${protectionTypeName} Multi-Sector Use Kenya${price}`;
        }
      } else if (protectionTypeName) {
        metaTitle = `${brand}${productName} | Professional ${protectionTypeName} Kenya${price}`;
      } else {
        metaTitle = `${brand}${productName} | Safety Equipment Kenya - Buy Online${price}`;
      }
      
      // 🎯 PRECISION: Optimize for Google's 60-character limit while maintaining power
      metaTitle = metaTitle.substring(0, 58) + (metaTitle.length > 58 ? '..' : '');
      
      onFormDataChange('metaTitle', metaTitle);
    }

    // 🚀 CONVERSION-OPTIMIZED META DESCRIPTION with Multi-Category Power
    if (!formData.metaDescription || autoGenerate) {
      const brandText = formData.product_brand ? `${formData.product_brand} ` : '';
      const priceText = formData.product_price 
        ? `From KES ${parseInt(formData.product_price).toLocaleString()}. ` 
        : '';
      
      // Multi-industry targeting
      let industryText = '';
      if (industryNames.length === 1) {
        industryText = `Perfect for ${industryNames[0].toLowerCase()} professionals. `;
      } else if (industryNames.length >= 2) {
        industryText = `Multi-sector use: ${industryNames.slice(0, 2).join(', ').toLowerCase()}`;
        if (industryNames.length > 2) {
          industryText += ` + ${industryNames.length - 2} more. `;
        } else {
          industryText += '. ';
        }
      }
      
      const descriptionSnippet = formData.product_description ? 
        formData.product_description.substring(0, 45) + '... ' : '';
      
      // 🎯 PRECISION: Conversion-focused description
      const metaDescription = `${brandText}${protectionTypeName.toLowerCase()} in Kenya. ${descriptionSnippet}${industryText}${priceText}✓ Free Nairobi delivery ✓ Certified quality ✓ Expert support ✓ Fast shipping`;
      
      // 📏 Optimize for Google's 160-character limit with PRECISION
      const optimizedDescription = metaDescription.substring(0, 158) + (metaDescription.length > 158 ? '..' : '');
      
      onFormDataChange('metaDescription', optimizedDescription);
    }

    // 🎯 MILITARY-GRADE KEYWORD GENERATION with Multi-Category Targeting
    if (autoGenerate) {
      const keywords = [
        // Core product keywords
        formData.product_name?.toLowerCase(),
        formData.product_brand?.toLowerCase(),
        
        // Protection type keywords
        protectionTypeName?.toLowerCase(),
        protectionTypeName?.toLowerCase().replace(' protection', ''),
        protectionTypeName?.toLowerCase().replace(' protection', ' equipment'),
        
        // Multi-industry keywords
        ...industryNames.map(name => name.toLowerCase()),
        ...industryNames.map(name => `${name.toLowerCase()} safety`),
        ...industryNames.map(name => `${name.toLowerCase()} ppe`),
        
        // Cross-category combinations
        ...industryNames.map(name => `${protectionTypeName?.toLowerCase()} for ${name.toLowerCase()}`),
        
        // Location targeting (KENYAN PRECISION)
        'safety equipment kenya',
        'ppe equipment nairobi',
        'safety gear kenya',
        'professional safety equipment',
        'certified safety equipment',
        'workplace safety kenya',
        'industrial safety nairobi',
        
        // Commercial keywords
        'buy safety equipment',
        'safety equipment online',
        'professional ppe',
        'certified equipment',
        'quality safety gear'
      ].filter(Boolean);

      // Remove duplicates and join
      const uniqueKeywords = [...new Set(keywords)].join(', ');
      onFormDataChange('keywords', uniqueKeywords);
    }

    // 🔗 GENERATE OPTIMIZED PRODUCT SLUG
    if (formData.product_name && (!formData.slug || autoGenerate)) {
      const protectionSlug = protectionTypeName ? protectionTypeName.toLowerCase().replace(/\s+/g, '-') : '';
      const industrySlug = industryNames.length > 0 ? industryNames[0].toLowerCase().replace(/\s+/g, '-') : '';
      
      let slug = formData.product_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      
      // Add category context to slug for better SEO
      if (protectionSlug && industrySlug) {
        slug = `${slug}-${protectionSlug}-${industrySlug}-kenya`;
      } else if (protectionSlug) {
        slug = `${slug}-${protectionSlug}-kenya`;
      }
      
      onFormDataChange('slug', slug);
    }
  };

  // 📊 ADVANCED SEO SCORE CALCULATION (Russian Precision)
  const calculateSEOScore = () => {
    let score = 0;
    const analysis = {};

    // 1. Meta Title Analysis (25 points)
    if (formData.metaTitle) {
      const titleLength = formData.metaTitle.length;
      const hasLocation = formData.metaTitle.toLowerCase().includes('kenya');
      const hasProtectionType = protectionTypes.some(p => 
        formData.metaTitle.toLowerCase().includes(p.name.toLowerCase())
      );
      
      if (titleLength >= 30 && titleLength <= 60) {
        score += 15;
        analysis.title = { status: 'good', message: 'Title length optimal (30-60 chars)' };
      } else if (titleLength > 0) {
        score += 8;
        analysis.title = { 
          status: 'warning', 
          message: `Title length: ${titleLength}/60 chars ${titleLength < 30 ? '(too short)' : '(too long)'}` 
        };
      }
      
      if (hasLocation) score += 5;
      if (hasProtectionType) score += 5;
    } else {
      analysis.title = { status: 'error', message: 'Meta title required' };
    }

    // 2. Meta Description Analysis (25 points)
    if (formData.metaDescription) {
      const descLength = formData.metaDescription.length;
      const hasLocation = formData.metaDescription.toLowerCase().includes('kenya') || 
                         formData.metaDescription.toLowerCase().includes('nairobi');
      const hasCallToAction = /✓|free|certified|expert|fast|buy|order|shop/i.test(formData.metaDescription);
      
      if (descLength >= 120 && descLength <= 160) {
        score += 15;
        analysis.description = { status: 'good', message: 'Description length optimal' };
      } else if (descLength > 0) {
        score += 8;
        analysis.description = { 
          status: 'warning', 
          message: `Description: ${descLength}/160 chars` 
        };
      }
      
      if (hasLocation) score += 5;
      if (hasCallToAction) score += 5;
    } else {
      analysis.description = { status: 'error', message: 'Meta description required' };
    }

    // 3. Multi-Category Optimization (20 points)
    if (selectedProtectionType && selectedIndustries.length > 0) {
      score += 10; // Base multi-category score
      
      if (selectedIndustries.length >= 2 && selectedIndustries.length <= 4) {
        score += 10; // Optimal industry targeting
        analysis.categories = { status: 'good', message: 'Optimal multi-sector targeting' };
      } else if (selectedIndustries.length === 1) {
        score += 5;
        analysis.categories = { status: 'warning', message: 'Consider adding more sectors' };
      } else if (selectedIndustries.length > 4) {
        score += 3;
        analysis.categories = { status: 'warning', message: 'Too many sectors may dilute targeting' };
      }
    } else {
      analysis.categories = { status: 'error', message: 'Complete category selection required' };
    }

    // 4. Keyword Optimization (15 points)
    if (formData.keywords) {
      const keywordCount = formData.keywords.split(',').filter(k => k.trim()).length;
      const hasLocationKeywords = /kenya|nairobi/i.test(formData.keywords);
      const hasIndustryKeywords = selectedIndustries.length > 0 && 
        industries.some(i => selectedIndustries.includes(i._id) && 
          formData.keywords.toLowerCase().includes(i.name.toLowerCase())
        );
      
      if (keywordCount >= 8 && keywordCount <= 15) {
        score += 8;
        analysis.keywords = { status: 'good', message: `Optimal keyword count (${keywordCount})` };
      } else if (keywordCount > 0) {
        score += 4;
        analysis.keywords = { status: 'warning', message: `${keywordCount} keywords (aim for 8-15)` };
      }
      
      if (hasLocationKeywords) score += 4;
      if (hasIndustryKeywords) score += 3;
    } else {
      analysis.keywords = { status: 'warning', message: 'Add relevant keywords' };
    }

    // 5. Content Quality (10 points)
    if (formData.product_name && formData.product_description) {
      const nameLength = formData.product_name.length;
      const descLength = formData.product_description.length;
      
      if (nameLength >= 20 && nameLength <= 100 && descLength >= 100) {
        score += 10;
        analysis.content = { status: 'good', message: 'Content quality excellent' };
      } else if (nameLength > 0 && descLength > 50) {
        score += 5;
        analysis.content = { status: 'warning', message: 'Content needs improvement' };
      }
    }

    // 6. Technical SEO (5 points)
    if (formData.slug && formData.slug.includes('-')) {
      score += 5;
      analysis.technical = { status: 'good', message: 'SEO-friendly URL structure' };
    } else {
      analysis.technical = { status: 'warning', message: 'Improve URL slug structure' };
    }

    setSeoScore(Math.min(score, 100));
    setSeoAnalysis(analysis);
  };

  // 🧠 SMART KEYWORD SUGGESTIONS based on multi-category selection
  const generateKeywordSuggestions = () => {
    if (!selectedProtectionType || selectedIndustries.length === 0) return;

    const protectionTypeName = protectionTypes.find(p => p._id === selectedProtectionType)?.name || '';
    const industryNames = industries
      .filter(i => selectedIndustries.includes(i._id))
      .map(i => i.name);

    const suggestions = [
      // Core product variations
      `${protectionTypeName.toLowerCase()} kenya`,
      `professional ${protectionTypeName.toLowerCase()}`,
      `certified ${protectionTypeName.toLowerCase()}`,
      
      // Industry-specific combinations
      ...industryNames.map(industry => `${protectionTypeName.toLowerCase()} ${industry.toLowerCase()}`),
      ...industryNames.map(industry => `${industry.toLowerCase()} safety equipment`),
      ...industryNames.map(industry => `${industry.toLowerCase()} ppe kenya`),
      
      // Cross-category power keywords
      ...industryNames.flatMap(industry => [
        `${protectionTypeName.toLowerCase()} for ${industry.toLowerCase()}`,
        `${industry.toLowerCase()} ${protectionTypeName.toLowerCase()} nairobi`
      ]),
      
      // Commercial intent keywords
      `buy ${protectionTypeName.toLowerCase()} kenya`,
      `${protectionTypeName.toLowerCase()} online kenya`,
      `${protectionTypeName.toLowerCase()} suppliers nairobi`,
      
      // Quality indicators
      `quality ${protectionTypeName.toLowerCase()}`,
      `durable ${protectionTypeName.toLowerCase()}`,
      `reliable safety equipment`
    ].filter(Boolean);

    setKeywordSuggestions([...new Set(suggestions)].slice(0, 20));
  };

  // 🎨 SEO Score Styling
  const getSEOScoreColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-gradient-to-r from-green-100 to-green-200';
    if (score >= 70) return 'text-blue-600 bg-gradient-to-r from-blue-100 to-blue-200';
    if (score >= 50) return 'text-yellow-600 bg-gradient-to-r from-yellow-100 to-yellow-200';
    return 'text-red-600 bg-gradient-to-r from-red-100 to-red-200';
  };

  const getSEOScoreLabel = (score) => {
    if (score >= 85) return '🚀 DOMINATING';
    if (score >= 70) return '💪 STRONG';
    if (score >= 50) return '⚡ GOOD';
    return '🔧 NEEDS WORK';
  };

  // Add suggested keyword to form
  const addSuggestedKeyword = (keyword) => {
    const currentKeywords = formData.keywords || '';
    const keywordList = currentKeywords.split(',').map(k => k.trim()).filter(Boolean);
    
    if (!keywordList.includes(keyword)) {
      const updatedKeywords = [...keywordList, keyword].join(', ');
      onFormDataChange('keywords', updatedKeywords);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-2 border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Globe className="h-6 w-6 text-blue-600" />
          Advanced SEO Optimization
          <span className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full font-bold">
            🎯 PRECISION SEO
          </span>
        </h2>
        
        {/* 📊 SEO Score Display */}
        <div className={`px-6 py-3 rounded-xl font-bold text-lg shadow-md ${getSEOScoreColor(seoScore)}`}>
          SEO Score: {seoScore}/100
          <div className="text-sm font-medium mt-1">
            {getSEOScoreLabel(seoScore)}
          </div>
        </div>
      </div>

      {/* 🚀 Auto-Generate Toggle */}
      <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 via-purple-50 to-green-50 rounded-xl border-2 border-blue-200">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={autoGenerate}
            onChange={(e) => setAutoGenerate(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-blue-900">AI-Powered SEO Generation</span>
            <Zap className="h-4 w-4 text-yellow-500" />
          </div>
        </label>
        <p className="text-sm text-blue-700 mt-2 ml-8">
          🚀 Automatically generates optimized meta tags, keywords, and slugs based on multi-category selection
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* 📝 SEO Fields */}
        <div className="space-y-6">
          
          {/* Meta Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Meta Title *
              <span className="text-xs text-gray-500 ml-2 font-normal">(Google Search Title)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.metaTitle || ''}
                onChange={(e) => onFormDataChange('metaTitle', e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                placeholder="Auto-generated based on product and categories..."
              />
              {autoGenerate && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                </div>
              )}
            </div>
            <div className="flex justify-between items-center text-xs mt-2">
              <span className={`font-medium ${
                (formData.metaTitle?.length || 0) > 60 ? 'text-red-500' : 
                (formData.metaTitle?.length || 0) >= 30 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {formData.metaTitle?.length || 0}/60 characters
              </span>
              {seoAnalysis.title && (
                <span className={`px-2 py-1 rounded-full font-medium ${
                  seoAnalysis.title.status === 'good' ? 'text-green-700 bg-green-100' :
                  seoAnalysis.title.status === 'warning' ? 'text-yellow-700 bg-yellow-100' :
                  'text-red-700 bg-red-100'
                }`}>
                  {seoAnalysis.title.message}
                </span>
              )}
            </div>
          </div>

          {/* Meta Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Meta Description *
              <span className="text-xs text-gray-500 ml-2 font-normal">(Google Search Snippet)</span>
            </label>
            <div className="relative">
              <textarea
                value={formData.metaDescription || ''}
                onChange={(e) => onFormDataChange('metaDescription', e.target.value)}
                rows={4}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium resize-none"
                placeholder="Auto-generated conversion-optimized description..."
              />
              {autoGenerate && (
                <div className="absolute right-3 top-4">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                </div>
              )}
            </div>
            <div className="flex justify-between items-center text-xs mt-2">
              <span className={`font-medium ${
                (formData.metaDescription?.length || 0) > 160 ? 'text-red-500' : 
                (formData.metaDescription?.length || 0) >= 120 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {formData.metaDescription?.length || 0}/160 characters
              </span>
              {seoAnalysis.description && (
                <span className={`px-2 py-1 rounded-full font-medium ${
                  seoAnalysis.description.status === 'good' ? 'text-green-700 bg-green-100' :
                  seoAnalysis.description.status === 'warning' ? 'text-yellow-700 bg-yellow-100' :
                  'text-red-700 bg-red-100'
                }`}>
                  {seoAnalysis.description.message}
                </span>
              )}
            </div>
          </div>

          {/* Keywords Field */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              SEO Keywords
              <span className="text-xs text-gray-500 ml-2 font-normal">(Comma-separated)</span>
            </label>
            <div className="relative">
              <textarea
                value={formData.keywords || ''}
                onChange={(e) => onFormDataChange('keywords', e.target.value)}
                rows={3}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium resize-none"
                placeholder="safety equipment, protection gear, kenya, nairobi..."
              />
              {autoGenerate && (
                <div className="absolute right-3 top-4">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                </div>
              )}
            </div>
            <div className="text-xs text-gray-600 mt-2">
              <span className="font-medium">
                {(formData.keywords || '').split(',').filter(k => k.trim()).length} keywords
              </span>
              <span className="ml-2">(Recommended: 8-15 keywords)</span>
            </div>
          </div>

          {/* Product Slug */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Product URL Slug
              <span className="text-xs text-gray-500 ml-2 font-normal">(Auto-generated)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.slug || ''}
                onChange={(e) => onFormDataChange('slug', e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder="auto-generated-product-slug-kenya"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Rocket className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="text-xs text-gray-600 mt-2">
              <span className="font-medium">Preview:</span>
              <span className="ml-1 text-blue-600">
                yoursite.com/products/{formData.slug || 'product-url-slug'}
              </span>
            </div>
          </div>
        </div>

        {/* 📊 SEO Analytics & Suggestions */}
        <div className="space-y-6">
          
          {/* SEO Score Breakdown */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              SEO Analysis Breakdown
            </h3>
            
            <div className="space-y-3">
              {Object.entries(seoAnalysis).map(([key, analysis]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      analysis.status === 'good' ? 'bg-green-500' :
                      analysis.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="font-medium text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    analysis.status === 'good' ? 'text-green-700 bg-green-100' :
                    analysis.status === 'warning' ? 'text-yellow-700 bg-yellow-100' :
                    'text-red-700 bg-red-100'
                  }`}>
                    {analysis.message}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 🎯 Smart Keyword Suggestions */}
          {keywordSuggestions.length > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-600" />
                Smart Keyword Suggestions
                <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                  Multi-Category Powered
                </span>
              </h3>
              
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {keywordSuggestions.map((keyword, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addSuggestedKeyword(keyword)}
                    className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-purple-50 border border-gray-200 hover:border-purple-300 transition-all text-left group"
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {keyword}
                    </span>
                    <Plus className="h-4 w-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
              
              <p className="text-xs text-purple-700 mt-3 italic">
                💡 Click any keyword to add it to your SEO keywords field
              </p>
            </div>
          )}

          {/* 🌍 Local SEO Optimization */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Kenya Local SEO Optimization
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm font-medium text-gray-700">Location Targeting</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  (formData.metaTitle?.toLowerCase().includes('kenya') || 
                   formData.metaDescription?.toLowerCase().includes('kenya'))
                    ? 'text-green-700 bg-green-100'
                    : 'text-red-700 bg-red-100'
                }`}>
                  {(formData.metaTitle?.toLowerCase().includes('kenya') || 
                    formData.metaDescription?.toLowerCase().includes('kenya'))
                    ? '✅ Kenya targeted' : '❌ Add location'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                <span className="text-sm font-medium text-gray-700">City Targeting</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  formData.metaDescription?.toLowerCase().includes('nairobi')
                    ? 'text-green-700 bg-green-100'
                    : 'text-yellow-700 bg-yellow-100'
                }`}>
                  {formData.metaDescription?.toLowerCase().includes('nairobi')
                    ? '✅ Nairobi targeted' : '💡 Consider Nairobi'}
                </span>
              </div>
            </div>
          </div>

          {/* 🏆 SEO Performance Prediction */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              SEO Performance Forecast
            </h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {selectedIndustries.length + 1}
                  </div>
                  <div className="text-xs text-gray-600">Filter Paths</div>
                </div>
                
                <div className="text-center p-3 bg-white rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {Math.min(selectedIndustries.length * 15 + 25, 100)}%
                  </div>
                  <div className="text-xs text-gray-600">Discovery Rate</div>
                </div>
              </div>
              
              <div className="text-xs text-orange-700 italic bg-white p-3 rounded-lg">
                🎯 Multi-category targeting increases product discoverability by up to {selectedIndustries.length * 25}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 REGENERATE SEO BUTTON */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => {
            setAutoGenerate(true);
            setTimeout(() => generateAdvancedSEO(), 100);
          }}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-3"
        >
          <Rocket className="h-5 w-5" />
          🚀 REGENERATE SEO WITH PRECISION
          <Sparkles className="h-5 w-5" />
        </button>
        <p className="text-center text-xs text-gray-500 mt-2">
          Instantly optimize all SEO fields based on current category selection
        </p>
      </div>
    </div>
  );
};

export default AdvancedSEO;