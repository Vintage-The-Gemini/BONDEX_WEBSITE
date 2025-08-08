// frontend/src/components/admin/AdvancedSEO.jsx
import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  TrendingUp, 
  Target, 
  Sparkles, 
  Eye,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Zap,
  Brain,
  Award,
  Wand2,
  RefreshCw,
  Copy
} from 'lucide-react';

const AdvancedSEO = ({ 
  formData, 
  onFormDataChange, 
  productName,
  validationErrors = {}
}) => {
  const [seoScore, setSeoScore] = useState(0);
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuggestions, setGeneratedSuggestions] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange(name, value);
  };

  // 🚀 AUTO-GENERATE SEO CONTENT based on product data
  const generateSEOContent = () => {
    if (!formData.product_name || !formData.product_brand) return;

    setIsGenerating(true);
    
    // Extract product details
    const productName = formData.product_name;
    const brand = formData.product_brand;
    const price = formData.product_price ? `KES ${parseFloat(formData.product_price).toLocaleString()}` : '';
    const description = formData.product_description;

    // 🎯 AUTO-GENERATE META TITLE (30-60 chars)
    const metaTitles = [
      `${brand} ${productName} - Premium Safety Equipment Kenya`,
      `Buy ${productName} by ${brand} | Best Prices in Kenya`,
      `${productName} - ${brand} | Professional Safety Gear`,
      `${brand} ${productName} ${price ? `from ${price}` : ''} | Kenya Safety Store`,
      `Professional ${productName} | ${brand} Safety Equipment Kenya`
    ];

    // 🎯 AUTO-GENERATE META DESCRIPTION (120-160 chars)
    const metaDescriptions = [
      `Shop premium ${productName} by ${brand} in Kenya. ${price ? `Starting from ${price}. ` : ''}Professional safety equipment with fast delivery across Kenya. ANSI/OSHA compliant.`,
      `Get the best ${productName} from ${brand} with competitive prices in Kenya. ${price ? `From ${price}. ` : ''}Trusted by professionals. Free delivery in Nairobi. Buy now!`,
      `${brand} ${productName} - Professional grade safety equipment for Kenya. ${price ? `Price: ${price}. ` : ''}Certified quality, fast shipping, expert support. Order today!`,
      `Premium ${productName} by ${brand} available in Kenya. ${price ? `Starting ${price}. ` : ''}Professional safety gear with warranty. Trusted by 1000+ companies.`,
      `Buy certified ${productName} from ${brand} in Kenya. ${price ? `Best price ${price}. ` : ''}Professional safety equipment with same-day delivery in Nairobi.`
    ];

    // 🎯 AUTO-GENERATE KEYWORDS based on product
    const baseKeywords = [
      productName.toLowerCase(),
      brand.toLowerCase(),
      'safety equipment kenya',
      'professional safety gear',
      'workplace safety',
      'ppe equipment',
      'safety gear nairobi',
      'industrial safety',
      'construction safety',
      'safety equipment store'
    ];

    // Add category-specific keywords
    const categoryKeywords = {
      'head': ['safety helmet', 'hard hat', 'bump cap', 'head protection'],
      'eye': ['safety glasses', 'goggles', 'face shield', 'eye protection'],
      'foot': ['safety boots', 'steel toe', 'work boots', 'foot protection'],
      'hand': ['work gloves', 'safety gloves', 'hand protection', 'cut resistant'],
      'body': ['coveralls', 'high vis', 'protective clothing', 'work wear'],
      'respiratory': ['face mask', 'respirator', 'breathing protection', 'dust mask'],
      'fall': ['safety harness', 'fall protection', 'height safety', 'climbing gear'],
      'ear': ['ear plugs', 'hearing protection', 'noise protection', 'earmuffs']
    };

    // Smart keyword detection
    const productLower = productName.toLowerCase();
    Object.keys(categoryKeywords).forEach(category => {
      if (productLower.includes(category)) {
        baseKeywords.push(...categoryKeywords[category]);
      }
    });

    // 🎯 AUTO-GENERATE FOCUS KEYWORD
    const focusKeyword = `${brand.toLowerCase()} ${productName.split(' ').slice(0, 2).join(' ').toLowerCase()}`;

    // 🎯 AUTO-GENERATE URL SLUG
    const slug = productName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 50);

    // Set the best suggestions
    const suggestions = {
      metaTitle: metaTitles[0], // Use the first one as default
      metaDescription: metaDescriptions[0],
      keywords: baseKeywords.slice(0, 8).join(', '),
      focusKeyword: focusKeyword,
      slug: slug,
      alternatives: {
        metaTitles: metaTitles,
        metaDescriptions: metaDescriptions
      }
    };

    setGeneratedSuggestions(suggestions);

    // Auto-fill if autoGenerate is enabled
    if (autoGenerate) {
      onFormDataChange('metaTitle', suggestions.metaTitle);
      onFormDataChange('metaDescription', suggestions.metaDescription);
      onFormDataChange('keywords', suggestions.keywords);
      onFormDataChange('focusKeyword', suggestions.focusKeyword);
      onFormDataChange('slug', suggestions.slug);
    }

    setIsGenerating(false);
  };

  // Auto-generate when product data changes
  useEffect(() => {
    if (formData.product_name && formData.product_brand) {
      generateSEOContent();
    }
  }, [formData.product_name, formData.product_brand, formData.product_price]);

  // Calculate SEO score
  useEffect(() => {
    calculateSEOScore();
  }, [formData.metaTitle, formData.metaDescription, formData.keywords, formData.focusKeyword]);

  const calculateSEOScore = () => {
    let score = 0;
    
    // Meta title scoring (25 points max)
    if (formData.metaTitle) {
      if (formData.metaTitle.length >= 30 && formData.metaTitle.length <= 60) score += 15;
      if (formData.metaTitle.includes(formData.product_brand || '')) score += 5;
      if (formData.metaTitle.includes('Kenya')) score += 5;
    }
    
    // Meta description scoring (25 points max)
    if (formData.metaDescription) {
      if (formData.metaDescription.length >= 120 && formData.metaDescription.length <= 160) score += 15;
      if (formData.metaDescription.includes(formData.product_brand || '')) score += 5;
      if (formData.metaDescription.includes('Kenya') || formData.metaDescription.includes('Nairobi')) score += 5;
    }
    
    // Keywords scoring (20 points max)
    if (formData.keywords) {
      const keywordCount = formData.keywords.split(',').filter(k => k.trim()).length;
      if (keywordCount >= 5 && keywordCount <= 10) score += 15;
      if (formData.keywords.includes('kenya')) score += 5;
    }
    
    // Focus keyword scoring (15 points max)
    if (formData.focusKeyword) {
      score += 5;
      if (formData.metaTitle?.toLowerCase().includes(formData.focusKeyword.toLowerCase())) score += 5;
      if (formData.metaDescription?.toLowerCase().includes(formData.focusKeyword.toLowerCase())) score += 5;
    }
    
    // Product name integration (15 points max)
    if (formData.product_name) {
      const nameWords = formData.product_name.toLowerCase().split(' ');
      if (nameWords.some(word => formData.metaTitle?.toLowerCase().includes(word))) score += 8;
      if (nameWords.some(word => formData.metaDescription?.toLowerCase().includes(word))) score += 7;
    }
    
    setSeoScore(Math.min(score, 100));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    return 'red';
  };

  const scoreColor = getScoreColor(seoScore);

  // Copy suggestion to field
  const applySuggestion = (field, value) => {
    onFormDataChange(field, value);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Globe className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900">Advanced SEO Optimization</h2>
          <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            🚀 AI-POWERED
          </div>
        </div>
        
        {/* SEO Score & Auto-Generate Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoGenerate"
              checked={autoGenerate}
              onChange={(e) => setAutoGenerate(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="autoGenerate" className="text-sm text-gray-700">
              Auto-generate SEO
            </label>
          </div>
          
          <button
            type="button"
            onClick={generateSEOContent}
            disabled={isGenerating || !formData.product_name}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Generate SEO
              </>
            )}
          </button>
          
          <div className={`px-4 py-2 rounded-lg font-bold text-${scoreColor}-800 bg-${scoreColor}-100`}>
            SEO Score: {seoScore}/100
          </div>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Meta Title */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-gray-700">
              Meta Title *
              <span className="text-xs text-gray-500 ml-2 font-normal">
                (Appears in Google search results)
              </span>
            </label>
            
            {generatedSuggestions.alternatives?.metaTitles && (
              <button
                type="button"
                onClick={() => setShowTitleAlternatives(!showTitleAlternatives)}
                className="text-xs text-blue-600 hover:text-blue-700 underline"
              >
                Show alternatives
              </button>
            )}
          </div>
          
          <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle || ''}
            onChange={handleInputChange}
            className={`w-full p-4 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
              validationErrors.metaTitle ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="SEO-optimized title for search engines"
            maxLength={60}
          />
          
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs ${
              (formData.metaTitle?.length || 0) < 30 ? 'text-red-500' :
              (formData.metaTitle?.length || 0) > 60 ? 'text-red-500' :
              'text-green-600'
            }`}>
              {formData.metaTitle?.length || 0}/60 characters
              {(formData.metaTitle?.length || 0) < 30 && ' (minimum 30)'}
            </span>
            
            {validationErrors.metaTitle && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {validationErrors.metaTitle}
              </p>
            )}
          </div>

          {/* Title Alternatives */}
          {generatedSuggestions.alternatives?.metaTitles && showTitleAlternatives && (
            <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">💡 AI-Generated Title Options:</h4>
              <div className="space-y-2">
                {generatedSuggestions.alternatives.metaTitles.slice(1).map((title, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="text-sm text-gray-700 flex-1">{title}</span>
                    <button
                      type="button"
                      onClick={() => applySuggestion('metaTitle', title)}
                      className="text-xs text-blue-600 hover:text-blue-700 ml-2"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Meta Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-gray-700">
              Meta Description *
              <span className="text-xs text-gray-500 ml-2 font-normal">
                (Search result snippet - be compelling!)
              </span>
            </label>
            
            {generatedSuggestions.alternatives?.metaDescriptions && (
              <button
                type="button"
                onClick={() => setShowDescAlternatives(!showDescAlternatives)}
                className="text-xs text-blue-600 hover:text-blue-700 underline"
              >
                Show alternatives
              </button>
            )}
          </div>
          
          <textarea
            name="metaDescription"
            value={formData.metaDescription || ''}
            onChange={handleInputChange}
            rows={3}
            className={`w-full p-4 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none ${
              validationErrors.metaDescription ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Compelling description that appears in search results. Include benefits and call-to-action."
            maxLength={160}
          />
          
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs ${
              (formData.metaDescription?.length || 0) < 120 ? 'text-red-500' :
              (formData.metaDescription?.length || 0) > 160 ? 'text-red-500' :
              'text-green-600'
            }`}>
              {formData.metaDescription?.length || 0}/160 characters
              {(formData.metaDescription?.length || 0) < 120 && ' (minimum 120)'}
            </span>
            
            {validationErrors.metaDescription && (
              <p className="text-red-500 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {validationErrors.metaDescription}
              </p>
            )}
          </div>

          {/* Description Alternatives */}
          {generatedSuggestions.alternatives?.metaDescriptions && showDescAlternatives && (
            <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-sm font-medium text-green-900 mb-2">💡 AI-Generated Description Options:</h4>
              <div className="space-y-2">
                {generatedSuggestions.alternatives.metaDescriptions.slice(1).map((desc, index) => (
                  <div key={index} className="flex items-start justify-between p-2 bg-white rounded border">
                    <span className="text-sm text-gray-700 flex-1">{desc}</span>
                    <button
                      type="button"
                      onClick={() => applySuggestion('metaDescription', desc)}
                      className="text-xs text-green-600 hover:text-green-700 ml-2 mt-1"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Keywords & Focus Keyword */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              SEO Keywords
              <span className="text-xs text-gray-500 ml-2 font-normal">
                (Comma-separated, 5-10 keywords)
              </span>
            </label>
            
            <textarea
              name="keywords"
              value={formData.keywords || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
              placeholder="safety helmet, head protection, construction helmet, ANSI Z89"
            />
            
            <div className="mt-2 text-xs text-gray-500">
              Keywords: {formData.keywords ? formData.keywords.split(',').filter(k => k.trim()).length : 0}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Focus Keyword
              <span className="text-xs text-gray-500 ml-2 font-normal">
                (Main keyword to rank for)
              </span>
            </label>
            
            <input
              type="text"
              name="focusKeyword"
              value={formData.focusKeyword || ''}
              onChange={handleInputChange}
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              placeholder="e.g., safety helmet"
            />

            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-2">Focus keyword optimization:</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {formData.focusKeyword && formData.metaTitle?.toLowerCase().includes(formData.focusKeyword.toLowerCase()) ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                  <span className="text-xs text-gray-600">In meta title</span>
                </div>
                <div className="flex items-center gap-2">
                  {formData.focusKeyword && formData.metaDescription?.toLowerCase().includes(formData.focusKeyword.toLowerCase()) ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-red-500" />
                  )}
                  <span className="text-xs text-gray-600">In meta description</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* URL Slug */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            URL Slug
            <span className="text-xs text-gray-500 ml-2 font-normal">
              (Auto-generated from product name)
            </span>
          </label>
          
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
              bondexsafety.co.ke/products/
            </span>
            <input
              type="text"
              name="slug"
              value={formData.slug || ''}
              onChange={handleInputChange}
              className="w-full pl-48 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="product-url-slug"
            />
          </div>
        </div>

        {/* SEO Score Breakdown */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Real-Time SEO Analysis</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Title</span>
              </div>
              <div className={`text-2xl font-bold text-${
                formData.metaTitle && formData.metaTitle.length >= 30 && formData.metaTitle.length <= 60 
                  ? 'green' : 'red'
              }-600`}>
                {formData.metaTitle && formData.metaTitle.length >= 30 && formData.metaTitle.length <= 60 ? '✅' : '❌'}
              </div>
              <div className="text-xs text-gray-500">Length & keywords</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Description</span>
              </div>
              <div className={`text-2xl font-bold text-${
                formData.metaDescription && formData.metaDescription.length >= 120 && formData.metaDescription.length <= 160 
                  ? 'green' : 'red'
              }-600`}>
                {formData.metaDescription && formData.metaDescription.length >= 120 && formData.metaDescription.length <= 160 ? '✅' : '❌'}
              </div>
              <div className="text-xs text-gray-500">Snippet quality</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Keywords</span>
              </div>
              <div className={`text-2xl font-bold text-${
                formData.keywords && formData.keywords.split(',').filter(k => k.trim()).length >= 5 
                  ? 'green' : 'red'
              }-600`}>
                {formData.keywords && formData.keywords.split(',').filter(k => k.trim()).length >= 5 ? '✅' : '❌'}
              </div>
              <div className="text-xs text-gray-500">Targeting setup</div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">Focus</span>
              </div>
              <div className={`text-2xl font-bold text-${
                formData.focusKeyword && 
                formData.metaTitle?.toLowerCase().includes(formData.focusKeyword.toLowerCase()) &&
                formData.metaDescription?.toLowerCase().includes(formData.focusKeyword.toLowerCase())
                  ? 'green' : 'red'
              }-600`}>
                {formData.focusKeyword && 
                 formData.metaTitle?.toLowerCase().includes(formData.focusKeyword.toLowerCase()) &&
                 formData.metaDescription?.toLowerCase().includes(formData.focusKeyword.toLowerCase()) ? '✅' : '❌'}
              </div>
              <div className="text-xs text-gray-500">Keyword optimization</div>
            </div>
          </div>
          
          {/* Overall SEO Score */}
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall SEO Score:</span>
              <div className={`text-xl font-bold text-${scoreColor}-600`}>
                {seoScore}/100
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-${scoreColor}-500 transition-all duration-500`}
                style={{ width: `${seoScore}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {seoScore >= 80 ? '🚀 Excellent SEO optimization!' :
               seoScore >= 60 ? '👍 Good SEO, room for improvement' :
               '⚠️ Needs SEO optimization'}
            </div>
          </div>
        </div>

        {/* Kenya Market SEO Tips */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Award className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-green-900 mb-2">🇰🇪 Kenya Market SEO Strategy</h4>
              <div className="text-sm text-green-800 space-y-1">
                <p>• Include "Kenya" and "Nairobi" for local search ranking</p>
                <p>• Mention KES pricing for local relevance</p>
                <p>• Reference OSHA/ANSI standards for professional credibility</p>
                <p>• Use "buy", "shop", "best prices" for commercial intent</p>
                <p>• Target both English and Swahili-speaking customers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-Generation Status */}
        {(isGenerating || Object.keys(generatedSuggestions).length > 0) && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold text-purple-900">🤖 AI SEO Assistant</h4>
            </div>
            
            {isGenerating ? (
              <div className="flex items-center gap-2 text-purple-700">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing product data and generating optimized SEO content...
              </div>
            ) : (
              <div className="text-sm text-purple-800">
                ✨ SEO content auto-generated based on your product details! 
                You can edit the suggestions or click "Generate SEO" for new options.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSEO;