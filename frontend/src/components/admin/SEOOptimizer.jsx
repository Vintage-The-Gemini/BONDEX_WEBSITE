// File Path: frontend/src/components/admin/SEOOptimizer.jsx
import React, { useState, useEffect } from 'react'

const SEOOptimizer = ({ productData, onSEOChange, seoData = {} }) => {
  const [seo, setSeo] = useState({
    metaTitle: '',
    metaDescription: '',
    keywords: '',
    slug: '',
    altText: '',
    focusKeyword: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    structuredData: {},
    ...seoData
  })

  const [analysis, setAnalysis] = useState({})

  // Auto-generate SEO content when product data changes
  useEffect(() => {
    if (productData.product_name && !seo.metaTitle) {
      generateSEOContent()
    }
  }, [productData])

  const generateSEOContent = () => {
    const productName = productData.product_name || ''
    const category = productData.primaryCategory?.name || 'Safety Equipment'
    const brand = productData.product_brand || 'Bondex Safety'
    const price = productData.product_price ? `KES ${productData.product_price}` : ''

    // Generate slug
    const slug = productName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    // Generate meta title (55-60 characters optimal)
    const metaTitle = `${productName} | ${category} | ${brand}`.substring(0, 60)

    // Generate meta description (150-160 characters optimal)
    const metaDescription = `Professional ${productName.toLowerCase()} from ${brand}. High-quality ${category.toLowerCase()} for workplace safety. ${price} - Shop now at Bondex Safety Kenya.`.substring(0, 160)

    // Generate keywords
    const keywords = [
      productName.toLowerCase(),
      category.toLowerCase(),
      brand.toLowerCase(),
      'safety equipment',
      'PPE',
      'Kenya',
      'workplace safety',
      productData.product_description?.split(' ').slice(0, 3).join(' ').toLowerCase() || ''
    ].filter(Boolean).join(', ')

    // Generate focus keyword
    const focusKeyword = `${productName.toLowerCase()} Kenya`

    // Generate structured data
    const structuredData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": productName,
      "brand": {
        "@type": "Brand",
        "name": brand
      },
      "category": category,
      "description": productData.product_description || '',
      "offers": {
        "@type": "Offer",
        "price": productData.product_price || 0,
        "priceCurrency": "KES",
        "availability": productData.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "Bondex Safety"
        }
      }
    }

    const newSEO = {
      ...seo,
      metaTitle,
      metaDescription,
      keywords,
      slug,
      focusKeyword,
      ogTitle: metaTitle,
      ogDescription: metaDescription,
      twitterTitle: metaTitle,
      twitterDescription: metaDescription,
      structuredData
    }

    setSeo(newSEO)
    onSEOChange(newSEO)
    analyzeSEO(newSEO)
  }

  const handleSEOChange = (field, value) => {
    const updatedSEO = { ...seo, [field]: value }
    setSeo(updatedSEO)
    onSEOChange(updatedSEO)
    analyzeSEO(updatedSEO)
  }

  const analyzeSEO = (seoData) => {
    const analysis = {
      metaTitle: {
        score: 0,
        issues: [],
        suggestions: []
      },
      metaDescription: {
        score: 0,
        issues: [],
        suggestions: []
      },
      keywords: {
        score: 0,
        issues: [],
        suggestions: []
      },
      overall: 0
    }

    // Analyze Meta Title
    const titleLength = seoData.metaTitle.length
    if (titleLength === 0) {
      analysis.metaTitle.issues.push('Meta title is missing')
      analysis.metaTitle.score = 0
    } else if (titleLength < 30) {
      analysis.metaTitle.issues.push('Meta title is too short')
      analysis.metaTitle.score = 40
    } else if (titleLength > 60) {
      analysis.metaTitle.issues.push('Meta title is too long (may be truncated)')
      analysis.metaTitle.score = 60
    } else {
      analysis.metaTitle.score = 100
    }

    if (seoData.focusKeyword && !seoData.metaTitle.toLowerCase().includes(seoData.focusKeyword.toLowerCase())) {
      analysis.metaTitle.suggestions.push('Include focus keyword in meta title')
      analysis.metaTitle.score -= 20
    }

    // Analyze Meta Description
    const descLength = seoData.metaDescription.length
    if (descLength === 0) {
      analysis.metaDescription.issues.push('Meta description is missing')
      analysis.metaDescription.score = 0
    } else if (descLength < 120) {
      analysis.metaDescription.issues.push('Meta description is too short')
      analysis.metaDescription.score = 40
    } else if (descLength > 160) {
      analysis.metaDescription.issues.push('Meta description is too long (may be truncated)')
      analysis.metaDescription.score = 60
    } else {
      analysis.metaDescription.score = 100
    }

    if (seoData.focusKeyword && !seoData.metaDescription.toLowerCase().includes(seoData.focusKeyword.toLowerCase())) {
      analysis.metaDescription.suggestions.push('Include focus keyword in meta description')
      analysis.metaDescription.score -= 20
    }

    // Analyze Keywords
    const keywordCount = seoData.keywords.split(',').filter(k => k.trim()).length
    if (keywordCount === 0) {
      analysis.keywords.issues.push('No keywords defined')
      analysis.keywords.score = 0
    } else if (keywordCount < 3) {
      analysis.keywords.suggestions.push('Consider adding more relevant keywords')
      analysis.keywords.score = 60
    } else if (keywordCount > 10) {
      analysis.keywords.issues.push('Too many keywords (focus on 5-8 main keywords)')
      analysis.keywords.score = 70
    } else {
      analysis.keywords.score = 100
    }

    // Calculate overall score
    analysis.overall = Math.round(
      (analysis.metaTitle.score + analysis.metaDescription.score + analysis.keywords.score) / 3
    )

    setAnalysis(analysis)
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-lg font-semibold text-gray-900">SEO Optimization</h4>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">SEO Score:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBg(analysis.overall)} ${getScoreColor(analysis.overall)}`}>
            {analysis.overall || 0}/100
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Meta Title */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Meta Title *</label>
            <span className={`text-xs ${seo.metaTitle.length > 60 ? 'text-red-600' : 'text-gray-500'}`}>
              {seo.metaTitle.length}/60
            </span>
          </div>
          <input
            type="text"
            value={seo.metaTitle}
            onChange={(e) => handleSEOChange('metaTitle', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="SEO title for search engines"
            maxLength={70}
          />
          {analysis.metaTitle?.issues?.length > 0 && (
            <div className="mt-1 text-xs text-red-600">
              {analysis.metaTitle.issues.map((issue, i) => (
                <div key={i}>• {issue}</div>
              ))}
            </div>
          )}
          {analysis.metaTitle?.suggestions?.length > 0 && (
            <div className="mt-1 text-xs text-yellow-600">
              {analysis.metaTitle.suggestions.map((suggestion, i) => (
                <div key={i}>💡 {suggestion}</div>
              ))}
            </div>
          )}
        </div>

        {/* Meta Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Meta Description *</label>
            <span className={`text-xs ${seo.metaDescription.length > 160 ? 'text-red-600' : 'text-gray-500'}`}>
              {seo.metaDescription.length}/160
            </span>
          </div>
          <textarea
            value={seo.metaDescription}
            onChange={(e) => handleSEOChange('metaDescription', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="SEO description for search engines"
            rows="3"
            maxLength={180}
          />
          {analysis.metaDescription?.issues?.length > 0 && (
            <div className="mt-1 text-xs text-red-600">
              {analysis.metaDescription.issues.map((issue, i) => (
                <div key={i}>• {issue}</div>
              ))}
            </div>
          )}
        </div>

        {/* URL Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              bondexsafety.com/products/
            </span>
            <input
              type="text"
              value={seo.slug}
              onChange={(e) => handleSEOChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="product-url-slug"
            />
          </div>
        </div>

        {/* Focus Keyword */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Focus Keyword</label>
          <input
            type="text"
            value={seo.focusKeyword}
            onChange={(e) => handleSEOChange('focusKeyword', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Main keyword to optimize for"
          />
          <p className="text-xs text-gray-500 mt-1">The primary keyword you want this product to rank for</p>
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
          <input
            type="text"
            value={seo.keywords}
            onChange={(e) => handleSEOChange('keywords', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="safety helmet, head protection, construction safety (comma separated)"
          />
          <p className="text-xs text-gray-500 mt-1">Separate keywords with commas (5-8 keywords recommended)</p>
          {analysis.keywords?.issues?.length > 0 && (
            <div className="mt-1 text-xs text-red-600">
              {analysis.keywords.issues.map((issue, i) => (
                <div key={i}>• {issue}</div>
              ))}
            </div>
          )}
        </div>

        {/* Advanced SEO Options */}
        <div className="border-t pt-4">
          <h5 className="text-md font-medium text-gray-900 mb-4">Advanced SEO</h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Open Graph Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Open Graph Title</label>
              <input
                type="text"
                value={seo.ogTitle}
                onChange={(e) => handleSEOChange('ogTitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Title for social media sharing"
              />
            </div>

            {/* Twitter Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Twitter Title</label>
              <input
                type="text"
                value={seo.twitterTitle}
                onChange={(e) => handleSEOChange('twitterTitle', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Title for Twitter sharing"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Canonical URL</label>
            <input
              type="url"
              value={seo.canonicalUrl}
              onChange={(e) => handleSEOChange('canonicalUrl', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="https://bondexsafety.com/products/product-name"
            />
            <p className="text-xs text-gray-500 mt-1">Canonical URL to prevent duplicate content issues</p>
          </div>
        </div>

        {/* SEO Preview */}
        <div className="border-t pt-4">
          <h5 className="text-md font-medium text-gray-900 mb-4">Search Engine Preview</h5>
          
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="text-blue-600 text-lg hover:underline cursor-pointer">
              {seo.metaTitle || 'Product Title - Bondex Safety'}
            </div>
            <div className="text-green-700 text-sm mt-1">
              bondexsafety.com/products/{seo.slug || 'product-name'}
            </div>
            <div className="text-gray-600 text-sm mt-2">
              {seo.metaDescription || 'Product description will appear here...'}
            </div>
          </div>
        </div>

        {/* Auto-Generate Button */}
        <div className="border-t pt-4">
          <button
            type="button"
            onClick={generateSEOContent}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            🤖 Auto-Generate SEO Content
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Automatically generate optimized SEO content based on product information
          </p>
        </div>

        {/* Structured Data Preview */}
        <div className="border-t pt-4">
          <h5 className="text-md font-medium text-gray-900 mb-4">Structured Data (JSON-LD)</h5>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs font-mono overflow-auto max-h-40">
            <pre>{JSON.stringify(seo.structuredData, null, 2)}</pre>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This structured data helps search engines understand your product better
          </p>
        </div>
      </div>
    </div>
  )
}

export default SEOOptimizer