// frontend/src/components/admin/ProductDetails.jsx
import React from 'react';
import { 
  Sparkles, 
  Settings, 
  Plus, 
  Minus, 
  Tag, 
  CheckCircle,
  Award,
  Shield,
  Zap
} from 'lucide-react';

const ProductDetails = ({ 
  features = [''],
  specifications = [{ key: '', value: '' }],
  tags = [''],
  certifications = [''],
  complianceStandards = [''],
  onFeaturesChange,
  onSpecificationsChange,
  onTagsChange,
  onCertificationsChange,
  onComplianceChange
}) => {

  // Feature management
  const addFeature = () => onFeaturesChange([...features, '']);
  const updateFeature = (index, value) => {
    const updated = features.map((feature, i) => i === index ? value : feature);
    onFeaturesChange(updated);
  };
  const removeFeature = (index) => {
    if (features.length > 1) {
      onFeaturesChange(features.filter((_, i) => i !== index));
    }
  };

  // Specification management
  const addSpecification = () => onSpecificationsChange([...specifications, { key: '', value: '' }]);
  const updateSpecification = (index, field, value) => {
    const updated = specifications.map((spec, i) => 
      i === index ? { ...spec, [field]: value } : spec
    );
    onSpecificationsChange(updated);
  };
  const removeSpecification = (index) => {
    if (specifications.length > 1) {
      onSpecificationsChange(specifications.filter((_, i) => i !== index));
    }
  };

  // Tag management
  const addTag = () => onTagsChange([...tags, '']);
  const updateTag = (index, value) => {
    const updated = tags.map((tag, i) => i === index ? value : tag);
    onTagsChange(updated);
  };
  const removeTag = (index) => {
    if (tags.length > 1) {
      onTagsChange(tags.filter((_, i) => i !== index));
    }
  };

  // Certification management
  const addCertification = () => onCertificationsChange([...certifications, '']);
  const updateCertification = (index, value) => {
    const updated = certifications.map((cert, i) => i === index ? value : cert);
    onCertificationsChange(updated);
  };
  const removeCertification = (index) => {
    if (certifications.length > 1) {
      onCertificationsChange(certifications.filter((_, i) => i !== index));
    }
  };

  // Compliance management
  const addCompliance = () => onComplianceChange([...complianceStandards, '']);
  const updateCompliance = (index, value) => {
    const updated = complianceStandards.map((std, i) => i === index ? value : std);
    onComplianceChange(updated);
  };
  const removeCompliance = (index) => {
    if (complianceStandards.length > 1) {
      onComplianceChange(complianceStandards.filter((_, i) => i !== index));
    }
  };

  // Get completion stats
  const getCompletionStats = () => {
    const validFeatures = features.filter(f => f.trim());
    const validSpecs = specifications.filter(s => s.key.trim() && s.value.trim());
    const validTags = tags.filter(t => t.trim());
    const validCerts = certifications.filter(c => c.trim());
    const validCompliance = complianceStandards.filter(c => c.trim());
    
    return {
      features: validFeatures.length,
      specifications: validSpecs.length,
      tags: validTags.length,
      certifications: validCerts.length,
      compliance: validCompliance.length,
      total: validFeatures.length + validSpecs.length + validTags.length + validCerts.length + validCompliance.length
    };
  };

  const stats = getCompletionStats();

  return (
    <div className="space-y-8">
      
      {/* Completion Overview */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-200">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-green-600" />
          📊 Product Details Completion
        </h3>
        
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 text-center">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-lg font-bold text-green-600">{stats.features}</div>
            <div className="text-xs text-gray-600">Features</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-lg font-bold text-blue-600">{stats.specifications}</div>
            <div className="text-xs text-gray-600">Specs</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-lg font-bold text-orange-600">{stats.tags}</div>
            <div className="text-xs text-gray-600">Tags</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-lg font-bold text-purple-600">{stats.certifications}</div>
            <div className="text-xs text-gray-600">Certs</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-lg font-bold text-red-600">{stats.compliance}</div>
            <div className="text-xs text-gray-600">Standards</div>
          </div>
        </div>
        
        <p className="text-center text-sm text-green-700 mt-3 font-medium">
          💡 Total Details: {stats.total} items • 
          {stats.total >= 10 ? ' ✅ Comprehensive product info' : 
           stats.total >= 5 ? ' 📈 Good detail level' : 
           ' ⚠️ Add more details for better SEO'}
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* 🌟 Product Features */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-600" />
            Key Features
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
              ✨ SELLING POINTS
            </span>
          </h2>
          
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 pr-12"
                    placeholder={`Feature ${index + 1} (e.g., Steel toe protection, Slip resistant sole, Waterproof construction)`}
                  />
                  {feature.trim() && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={features.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addFeature}
              className="w-full p-4 border-2 border-dashed border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={16} />
              Add Feature
            </button>
          </div>
          
          {/* Feature Examples */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800 font-medium mb-2">💡 Feature Examples:</p>
            <div className="grid grid-cols-1 gap-1 text-xs text-green-700">
              <p>• "200-joule impact protection"</p>
              <p>• "Anti-slip rubber outsole"</p>
              <p>• "Moisture-wicking interior lining"</p>
              <p>• "Quick-release buckle system"</p>
            </div>
          </div>
        </div>

        {/* ⚙️ Technical Specifications */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Technical Specifications
            <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
              ⚙️ TECH SPECS
            </span>
          </h2>
          
          <div className="space-y-3">
            {specifications.map((spec, index) => (
              <div key={index} className="grid grid-cols-5 gap-3">
                <div className="col-span-2">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Property"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Value"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={specifications.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addSpecification}
              className="w-full p-4 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={16} />
              Add Specification
            </button>
          </div>
          
          {/* Specification Examples */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800 font-medium mb-2">⚙️ Specification Examples:</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
              <div>
                <p><span className="font-medium">Material:</span> Leather/Steel</p>
                <p><span className="font-medium">Size Range:</span> 38-47</p>
              </div>
              <div>
                <p><span className="font-medium">Weight:</span> 1.2kg per pair</p>
                <p><span className="font-medium">Temperature:</span> -20°C to +50°C</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 🏷️ Product Tags */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Tag className="h-5 w-5 text-orange-600" />
            Product Tags
          </h2>
          
          <div className="space-y-3">
            {tags.map((tag, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => updateTag(index, e.target.value)}
                  className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder={`Tag ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={tags.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addTag}
              className="w-full p-3 border-2 border-dashed border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={16} />
              Add Tag
            </button>
          </div>
        </div>

        {/* 🏆 Certifications */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-600" />
            Certifications
          </h2>
          
          <div className="space-y-3">
            {certifications.map((cert, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={cert}
                  onChange={(e) => updateCertification(index, e.target.value)}
                  className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder={`Certification ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeCertification(index)}
                  className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={certifications.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addCertification}
              className="w-full p-3 border-2 border-dashed border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={16} />
              Add Certification
            </button>
          </div>
          
          {/* Certification Examples */}
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-xs text-purple-800 font-medium mb-1">🏆 Examples:</p>
            <div className="text-xs text-purple-700 space-y-1">
              <p>• CE Marking (Europe)</p>
              <p>• ANSI Z87.1 (Eye Protection)</p>
              <p>• ISO 20345 (Safety Footwear)</p>
              <p>• KEBS 1515 (Kenya Standard)</p>
            </div>
          </div>
        </div>

        {/* 🛡️ Compliance Standards */}
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Compliance
          </h2>
          
          <div className="space-y-3">
            {complianceStandards.map((standard, index) => (
              <div key={index} className="flex gap-3">
                <input
                  type="text"
                  value={standard}
                  onChange={(e) => updateCompliance(index, e.target.value)}
                  className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder={`Standard ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeCompliance(index)}
                  className="p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={complianceStandards.length === 1}
                >
                  <Minus size={16} />
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addCompliance}
              className="w-full p-3 border-2 border-dashed border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2 font-medium"
            >
              <Plus size={16} />
              Add Standard
            </button>
          </div>
          
          {/* Compliance Examples */}
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-xs text-red-800 font-medium mb-1">🛡️ Examples:</p>
            <div className="text-xs text-red-700 space-y-1">
              <p>• OSHA Compliant</p>
              <p>• FDA Approved</p>
              <p>• KEBS Standards</p>
              <p>• IEC 61340-5-1</p>
            </div>
          </div>
        </div>
      </div>

      {/* 📈 SEO Impact Analysis */}
      {stats.total > 0 && (
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            📈 SEO Impact Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Content Richness Score */}
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-yellow-600">
                {Math.min(stats.total * 10, 100)}%
              </div>
              <div className="text-sm text-gray-600">Content Richness</div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.total >= 10 ? '🚀 Excellent' : 
                 stats.total >= 5 ? '📈 Good' : '⚠️ Basic'}
              </div>
            </div>
            
            {/* Search Keywords Generated */}
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {stats.features + stats.tags + stats.certifications}
              </div>
              <div className="text-sm text-gray-600">Search Keywords</div>
              <div className="text-xs text-gray-500 mt-1">Auto-generated</div>
            </div>
            
            {/* Trust Signals */}
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {stats.certifications + stats.compliance}
              </div>
              <div className="text-sm text-gray-600">Trust Signals</div>
              <div className="text-xs text-gray-500 mt-1">
                {(stats.certifications + stats.compliance) >= 3 ? '🏆 High' : 
                 (stats.certifications + stats.compliance) >= 1 ? '📊 Medium' : '📈 Low'}
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-white rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">🎯 SEO Benefits:</span>
              {stats.total >= 10 && " Your detailed product info will rank higher in search results and build customer trust."}
              {stats.total >= 5 && stats.total < 10 && " Good detail level. Consider adding more specifications for better SEO."}
              {stats.total < 5 && " Add more features and specifications to improve search ranking and customer confidence."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;