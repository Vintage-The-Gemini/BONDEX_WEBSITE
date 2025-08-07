// frontend/src/pages/admin/SEOAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  Target,
  Eye,
  MousePointer,
  BarChart3,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

const SEOAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [seoData, setSeoData] = useState({
    overview: {
      totalPages: 156,
      indexedPages: 142,
      organicTraffic: 2847,
      averagePosition: 15.3,
      clickThroughRate: 3.2,
      totalClicks: 1245,
      totalImpressions: 38920,
      topKeywords: 12
    },
    keywords: [
      {
        keyword: 'safety boots kenya',
        position: 3,
        clicks: 234,
        impressions: 5420,
        ctr: 4.3,
        trend: 'up'
      },
      {
        keyword: 'protective equipment nairobi',
        position: 7,
        clicks: 189,
        impressions: 3240,
        ctr: 5.8,
        trend: 'up'
      },
      {
        keyword: 'construction safety gear',
        position: 12,
        clicks: 156,
        impressions: 2890,
        ctr: 5.4,
        trend: 'down'
      },
      {
        keyword: 'industrial gloves',
        position: 5,
        clicks: 201,
        impressions: 4120,
        ctr: 4.9,
        trend: 'up'
      },
      {
        keyword: 'safety helmets price',
        position: 18,
        clicks: 98,
        impressions: 2340,
        ctr: 4.2,
        trend: 'stable'
      }
    ],
    pages: [
      {
        url: '/products/safety-boots',
        title: 'Safety Boots - Industrial Foot Protection | Bondex',
        clicks: 423,
        impressions: 8920,
        ctr: 4.7,
        position: 8.2,
        issues: []
      },
      {
        url: '/products/hard-hats',
        title: 'Hard Hats & Safety Helmets | Bondex Safety',
        clicks: 356,
        impressions: 7240,
        ctr: 4.9,
        position: 6.1,
        issues: ['title_too_long']
      },
      {
        url: '/categories/eye-protection',
        title: 'Eye Protection Equipment',
        clicks: 234,
        impressions: 5120,
        ctr: 4.6,
        position: 12.3,
        issues: ['missing_meta_description', 'title_too_short']
      },
      {
        url: '/products/safety-gloves',
        title: 'Safety Gloves - Hand Protection for All Industries',
        clicks: 298,
        impressions: 6340,
        ctr: 4.7,
        position: 9.8,
        issues: []
      }
    ],
    technicalSEO: {
      coreWebVitals: {
        lcp: 2.1,
        fid: 45,
        cls: 0.08
      },
      pageSpeed: {
        mobile: 78,
        desktop: 92
      },
      indexability: {
        indexedPages: 142,
        blockedPages: 14,
        errors: 3
      }
    }
  });

  useEffect(() => {
    loadSEOData();
  }, []);

  const loadSEOData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
    } catch (error) {
      console.error('Error loading SEO data:', error);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSEOData();
    setRefreshing(false);
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp size={14} className="text-green-600" />;
    if (trend === 'down') return <TrendingDown size={14} className="text-red-600" />;
    return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
  };

  const getIssueColor = (issue) => {
    const colors = {
      'title_too_long': 'text-red-600 bg-red-100',
      'title_too_short': 'text-orange-600 bg-orange-100',
      'missing_meta_description': 'text-orange-600 bg-orange-100',
      'duplicate_content': 'text-red-600 bg-red-100',
      'low_word_count': 'text-orange-600 bg-orange-100'
    };
    return colors[issue] || 'text-gray-600 bg-gray-100';
  };

  const getIssueText = (issue) => {
    const texts = {
      'title_too_long': 'Title too long',
      'title_too_short': 'Title too short',
      'missing_meta_description': 'Missing meta description',
      'duplicate_content': 'Duplicate content',
      'low_word_count': 'Low word count'
    };
    return texts[issue] || issue;
  };

  const getCoreWebVitalStatus = (metric, value) => {
    const thresholds = {
      lcp: { good: 2.5, poor: 4.0 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 }
    };
    
    if (value <= thresholds[metric].good) return 'good';
    if (value <= thresholds[metric].poor) return 'needs-improvement';
    return 'poor';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SEO analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SEO Analytics</h1>
          <p className="text-gray-600 mt-1">Monitor your search engine optimization performance</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2 disabled:opacity-50 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Organic Traffic</p>
              <p className="text-3xl font-bold text-gray-900">{seoData.overview.organicTraffic.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <TrendingUp size={14} className="text-green-600" />
                <span className="text-sm text-green-600 ml-1">+12% this month</span>
              </div>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Eye className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Position</p>
              <p className="text-3xl font-bold text-gray-900">{seoData.overview.averagePosition}</p>
              <div className="flex items-center mt-2">
                <TrendingUp size={14} className="text-green-600" />
                <span className="text-sm text-green-600 ml-1">Improved by 2.1</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Click-Through Rate</p>
              <p className="text-3xl font-bold text-gray-900">{seoData.overview.clickThroughRate}%</p>
              <div className="flex items-center mt-2">
                <TrendingUp size={14} className="text-green-600" />
                <span className="text-sm text-green-600 ml-1">+0.8% increase</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <MousePointer className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Indexed Pages</p>
              <p className="text-3xl font-bold text-gray-900">{seoData.overview.indexedPages}</p>
              <div className="flex items-center mt-2">
                <CheckCircle size={14} className="text-green-600" />
                <span className="text-sm text-gray-600 ml-1">of {seoData.overview.totalPages} total</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Globe className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Keywords Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Top Performing Keywords</h2>
          <p className="text-gray-600 mt-1">Track your most valuable search terms</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keyword</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {seoData.keywords.map((keyword, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{keyword.keyword}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      keyword.position <= 3 ? 'bg-green-100 text-green-800' :
                      keyword.position <= 10 ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      #{keyword.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {keyword.clicks.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {keyword.impressions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {keyword.ctr}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getTrendIcon(keyword.trend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Performance */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Page Performance</h2>
            <p className="text-gray-600 mt-1">SEO issues and opportunities</p>
          </div>
          <div className="p-6 space-y-4">
            {seoData.pages.map((page, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm">{page.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">{page.url}</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <ExternalLink size={14} />
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Clicks</p>
                    <p className="font-semibold text-gray-900">{page.clicks}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">CTR</p>
                    <p className="font-semibold text-gray-900">{page.ctr}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Position</p>
                    <p className="font-semibold text-gray-900">#{page.position}</p>
                  </div>
                </div>
                
                {page.issues.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {page.issues.map((issue, issueIndex) => (
                      <span 
                        key={issueIndex}
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getIssueColor(issue)}`}
                      >
                        <AlertCircle size={10} className="mr-1" />
                        {getIssueText(issue)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Technical SEO */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Technical SEO</h2>
            <p className="text-gray-600 mt-1">Core Web Vitals and site health</p>
          </div>
          <div className="p-6 space-y-6">
            
            {/* Core Web Vitals */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Core Web Vitals</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Largest Contentful Paint</p>
                    <p className="text-sm text-gray-500">LCP - Loading performance</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{seoData.technicalSEO.coreWebVitals.lcp}s</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      getCoreWebVitalStatus('lcp', seoData.technicalSEO.coreWebVitals.lcp) === 'good' 
                        ? 'bg-green-100 text-green-800' 
                        : getCoreWebVitalStatus('lcp', seoData.technicalSEO.coreWebVitals.lcp) === 'needs-improvement'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {getCoreWebVitalStatus('lcp', seoData.technicalSEO.coreWebVitals.lcp) === 'good' ? 'Good' : 
                       getCoreWebVitalStatus('lcp', seoData.technicalSEO.coreWebVitals.lcp) === 'needs-improvement' ? 'Needs Work' : 'Poor'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">First Input Delay</p>
                    <p className="text-sm text-gray-500">FID - Interactivity</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{seoData.technicalSEO.coreWebVitals.fid}ms</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      getCoreWebVitalStatus('fid', seoData.technicalSEO.coreWebVitals.fid) === 'good' 
                        ? 'bg-green-100 text-green-800' 
                        : getCoreWebVitalStatus('fid', seoData.technicalSEO.coreWebVitals.fid) === 'needs-improvement'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {getCoreWebVitalStatus('fid', seoData.technicalSEO.coreWebVitals.fid) === 'good' ? 'Good' : 
                       getCoreWebVitalStatus('fid', seoData.technicalSEO.coreWebVitals.fid) === 'needs-improvement' ? 'Needs Work' : 'Poor'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Cumulative Layout Shift</p>
                    <p className="text-sm text-gray-500">CLS - Visual stability</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{seoData.technicalSEO.coreWebVitals.cls}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      getCoreWebVitalStatus('cls', seoData.technicalSEO.coreWebVitals.cls) === 'good' 
                        ? 'bg-green-100 text-green-800' 
                        : getCoreWebVitalStatus('cls', seoData.technicalSEO.coreWebVitals.cls) === 'needs-improvement'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {getCoreWebVitalStatus('cls', seoData.technicalSEO.coreWebVitals.cls) === 'good' ? 'Good' : 
                       getCoreWebVitalStatus('cls', seoData.technicalSEO.coreWebVitals.cls) === 'needs-improvement' ? 'Needs Work' : 'Poor'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Speed */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Page Speed Scores</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Mobile</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          seoData.technicalSEO.pageSpeed.mobile >= 90 ? 'bg-green-500' :
                          seoData.technicalSEO.pageSpeed.mobile >= 50 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${seoData.technicalSEO.pageSpeed.mobile}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-8">{seoData.technicalSEO.pageSpeed.mobile}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Desktop</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          seoData.technicalSEO.pageSpeed.desktop >= 90 ? 'bg-green-500' :
                          seoData.technicalSEO.pageSpeed.desktop >= 50 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${seoData.technicalSEO.pageSpeed.desktop}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-gray-900 w-8">{seoData.technicalSEO.pageSpeed.desktop}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Indexability */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Indexability Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Indexed Pages</span>
                  <span className="font-semibold text-green-600">{seoData.technicalSEO.indexability.indexedPages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Blocked Pages</span>
                  <span className="font-semibold text-orange-600">{seoData.technicalSEO.indexability.blockedPages}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Errors</span>
                  <span className="font-semibold text-red-600">{seoData.technicalSEO.indexability.errors}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Action Items */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">SEO Action Items</h2>
          <p className="text-gray-600 mt-1">Prioritized recommendations for improvement</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">High Priority</h3>
              <p className="text-sm text-red-700 mt-1">3 pages have missing meta descriptions</p>
              <button className="text-xs text-red-600 hover:text-red-800 mt-2 font-medium">
                Fix Now →
              </button>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <Clock className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-orange-900">Medium Priority</h3>
              <p className="text-sm text-orange-700 mt-1">Page speed on mobile could be improved</p>
              <button className="text-xs text-orange-600 hover:text-orange-800 mt-2 font-medium">
                View Details →
              </button>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-900">Good Performance</h3>
              <p className="text-sm text-green-700 mt-1">Your safety equipment pages are ranking well for targeted keywords</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOAnalytics;