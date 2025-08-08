// frontend/src/components/admin/ProductDetails.jsx
import React from 'react';
import {
  Settings,
  Plus,
  X,
  Tag,
  Award,
  Shield,
  FileText,
  Info,
  CheckCircle
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

  // Handle features
  const addFeature = () => {
    onFeaturesChange([...features, '']);
  };

  const updateFeature = (index, value) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    onFeaturesChange(newFeatures);
  };

  const removeFeature = (index) => {
    if (features.length > 1) {
      onFeaturesChange(features.filter((_, i) => i !== index));
    }
  };

  // Handle specifications
  const addSpecification = () => {
    onSpecificationsChange([...specifications, { key: '', value: '' }]);
  };

  const updateSpecification = (index, field, value) => {
    const newSpecs = [...specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    onSpecificationsChange(newSpecs);
  };

  const removeSpecification = (index) => {
    if (specifications.length > 1) {
      onSpecificationsChange(specifications.filter((_, i) => i !== index));
    }
  };

  // Handle tags
  const addTag = () => {
    onTagsChange([...tags, '']);
  };

  const updateTag = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    onTagsChange(newTags);
  };

  const removeTag = (index) => {
    if (tags.length > 1) {
      onTagsChange(tags.filter((_, i) => i !== index));
    }
  };

  // Handle certifications
  const addCertification = () => {
    onCertificationsChange([...certifications, '']);
  };

  const updateCertification = (index, value) => {
    const newCerts = [...certifications];
    newCerts[index] = value;
    onCertificationsChange(newCerts);
  };

  const removeCertification = (index) => {
    if (certifications.length > 1) {
      onCertificationsChange(certifications.filter((_, i) => i !== index));
    }
  };

  // Handle compliance standards
  const addComplianceStandard = () => {
    onComplianceChange([...complianceStandards, '']);
  };

  const updateComplianceStandard = (index, value) => {
    const newStandards = [...complianceStandards];
    newStandards[index] = value;
    onComplianceChange(newStandards);
  };

  const removeComplianceStandard = (index) => {
    if (complianceStandards.length > 1) {
      onComplianceChange(complianceStandards.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-8">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-6 w-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          📋 SPECIFICATIONS
        </div>
      </div>
      
      <div className="space-y-8">
        
        {/* Features Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Key Features
            </label>
            <button
              type="button"
              onClick={addFeature}
              className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              Add Feature
            </button>
          </div>
          
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="e.g., ANSI Z87.1+ rated impact protection"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>
                {features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-green-800">
                <strong>Feature Tips:</strong> Focus on safety benefits, compliance standards, 
                comfort features, and what makes this product special.
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              Technical Specifications
            </label>
            <button
              type="button"
              onClick={addSpecification}
              className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              Add Spec
            </button>
          </div>
          
          <div className="space-y-3">
            {specifications.map((spec, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={spec.key}
                  onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                  placeholder="Specification name (e.g., Material)"
                  className="p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                />
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                    placeholder="Value (e.g., Polycarbonate lens with TPR frame)"
                    className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                  {specifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSpecification(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Tag className="h-5 w-5 text-purple-500" />
              Product Tags
            </label>
            <button
              type="button"
              onClick={addTag}
              className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              Add Tag
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tags.map((tag, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => updateTag(index, e.target.value)}
                  placeholder="e.g., impact-resistant, lightweight, comfortable"
                  className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                />
                {tags.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Certifications Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Certifications
            </label>
            <button
              type="button"
              onClick={addCertification}
              className="flex items-center gap-2 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              Add Certification
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={cert}
                  onChange={(e) => updateCertification(index, e.target.value)}
                  placeholder="e.g., ANSI Z87.1+, CE Marked, OSHA Compliant"
                  className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                />
                {certifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCertification(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Standards Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Compliance Standards
            </label>
            <button
              type="button"
              onClick={addComplianceStandard}
              className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              Add Standard
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {complianceStandards.map((standard, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  type="text"
                  value={standard}
                  onChange={(e) => updateComplianceStandard(index, e.target.value)}
                  placeholder="e.g., OSHA 1926.95, EN 166, ISO 12312-1"
                  className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                />
                {complianceStandards.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeComplianceStandard(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-red-800">
                <strong>Compliance Tip:</strong> Include relevant safety standards for your market. 
                OSHA standards for US, EN standards for Europe, and local Kenya standards where applicable.
              </div>
            </div>
          </div>
        </div>

        {/* Quick Add Buttons for Common Values */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-orange-500" />
            🚀 Quick Add Common Standards
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Common Certifications */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700">Certifications</h5>
              {['ANSI Z87.1+', 'CE Marked', 'OSHA Compliant', 'ISO 9001'].map(cert => (
                <button
                  key={cert}
                  type="button"
                  onClick={() => {
                    if (!certifications.includes(cert)) {
                      onCertificationsChange([...certifications.filter(c => c), cert]);
                    }
                  }}
                  className="w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-yellow-100 rounded border text-gray-700 hover:text-yellow-800 transition-colors"
                >
                  + {cert}
                </button>
              ))}
            </div>

            {/* Common Compliance Standards */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700">Standards</h5>
              {['OSHA 1926.95', 'EN 166', 'ISO 12312-1', 'ANSI Z89.1'].map(standard => (
                <button
                  key={standard}
                  type="button"
                  onClick={() => {
                    if (!complianceStandards.includes(standard)) {
                      onComplianceChange([...complianceStandards.filter(s => s), standard]);
                    }
                  }}
                  className="w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-red-100 rounded border text-gray-700 hover:text-red-800 transition-colors"
                >
                  + {standard}
                </button>
              ))}
            </div>

            {/* Common Tags */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700">Tags</h5>
              {['lightweight', 'comfortable', 'durable', 'impact-resistant'].map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    if (!tags.includes(tag)) {
                      onTagsChange([...tags.filter(t => t), tag]);
                    }
                  }}
                  className="w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-purple-100 rounded border text-gray-700 hover:text-purple-800 transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </div>

            {/* Common Features */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-700">Features</h5>
              {['Anti-fog coating', 'UV protection', 'Scratch resistant', 'Adjustable fit'].map(feature => (
                <button
                  key={feature}
                  type="button"
                  onClick={() => {
                    if (!features.includes(feature)) {
                      onFeaturesChange([...features.filter(f => f), feature]);
                    }
                  }}
                  className="w-full text-left px-2 py-1 text-xs bg-gray-100 hover:bg-green-100 rounded border text-gray-700 hover:text-green-800 transition-colors"
                >
                  + {feature}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Safety Equipment Specific Tips */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            🛡️ Safety Equipment Best Practices
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-orange-800">
            <div className="space-y-2">
              <p><strong>Features to Highlight:</strong></p>
              <ul className="space-y-1 ml-4">
                <li>• Protection level and ratings</li>
                <li>• Comfort and fit features</li>
                <li>• Durability and materials</li>
                <li>• Special coatings or treatments</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p><strong>Specifications to Include:</strong></p>
              <ul className="space-y-1 ml-4">
                <li>• Dimensions and weight</li>
                <li>• Material composition</li>
                <li>• Temperature ranges</li>
                <li>• Maintenance instructions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;