// frontend/src/pages/admin/EditCategory.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { 
  ArrowLeft, 
  Save, 
  FolderTree,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Eye
} from 'lucide-react';

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadCategory, updateCategory, addNotification } = useAdmin();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'safety',
    status: 'active',
    icon: '',
    isFeatured: false,
    sortOrder: 0,
    colors: {
      primary: '#3B82F6',
      secondary: '#DBEAFE'
    },
    metaTitle: '',
    metaDescription: ''
  });
  
  const [originalCategory, setOriginalCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  // Fetch category data
  const fetchCategory = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Fetching category:', id);
      const result = await loadCategory(id);
      
      if (result.success) {
        const category = result.data;
        console.log('✅ Category loaded:', category);
        
        setOriginalCategory(category);
        
        // Set form data
        setFormData({
          name: category.name || '',
          description: category.description || '',
          type: category.type || 'safety',
          status: category.status || 'active',
          icon: category.icon || '',
          isFeatured: category.isFeatured || false,
          sortOrder: category.sortOrder || 0,
          colors: {
            primary: category.colors?.primary || '#3B82F6',
            secondary: category.colors?.secondary || '#DBEAFE'
          },
          metaTitle: category.metaTitle || '',
          metaDescription: category.metaDescription || ''
        });
        
        setHasChanges(false);
      } else {
        setError(result.error || 'Failed to load category');
        console.error('❌ Failed to load category:', result.error);
      }
    } catch (error) {
      console.error('❌ Error fetching category:', error);
      setError('Failed to fetch category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('colors.')) {
      const colorKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        colors: {
          ...prev.colors,
          [colorKey]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    setHasChanges(true);
    setError('');
  };

  // Reset form to original values
  const resetForm = () => {
    if (originalCategory) {
      setFormData({
        name: originalCategory.name || '',
        description: originalCategory.description || '',
        type: originalCategory.type || 'safety',
        status: originalCategory.status || 'active',
        icon: originalCategory.icon || '',
        isFeatured: originalCategory.isFeatured || false,
        sortOrder: originalCategory.sortOrder || 0,
        colors: {
          primary: originalCategory.colors?.primary || '#3B82F6',
          secondary: originalCategory.colors?.secondary || '#DBEAFE'
        },
        metaTitle: originalCategory.metaTitle || '',
        metaDescription: originalCategory.metaDescription || ''
      });
      setHasChanges(false);
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = [];
    
    if (!formData.name.trim()) errors.push('Category name is required');
    if (!formData.description.trim()) errors.push('Category description is required');
    if (!formData.type) errors.push('Category type is required');
    
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }
    
    setSaving(true);
    setError('');
    setSuccess('');
    
    try {
      console.log('🔄 Submitting category update:', formData);
      
      const result = await updateCategory(id, formData);
      
      if (result.success) {
        setSuccess('Category updated successfully!');
        setHasChanges(false);
        
        // Refresh category data to show updated values
        setTimeout(() => {
          fetchCategory();
          setSuccess('');
        }, 1500);
        
        console.log('✅ Category updated successfully');
      } else {
        setError(result.error || 'Failed to update category');
        console.error('❌ Category update failed:', result.error);
      }
    } catch (error) {
      console.error('❌ Error updating category:', error);
      setError('Failed to update category. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle navigation with unsaved changes
  const handleNavigation = (path) => {
    if (hasChanges) {
      setShowDiscardConfirm(true);
    } else {
      navigate(path);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [id]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNavigation('/admin/categories')}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FolderTree className="w-8 h-8 text-blue-600" />
              Edit Category
            </h1>
            <p className="text-gray-600 mt-1">Update category information and settings</p>
          </div>
        </div>
        <div className="flex gap-2">
          {hasChanges && (
            <button
              onClick={resetForm}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Reset
            </button>
          )}
          <button
            onClick={() => navigate(`/admin/categories/${id}`)}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Eye size={16} />
            View
          </button>
        </div>
      </div>

      {/* Unsaved Changes Banner */}
      {hasChanges && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <p className="text-amber-700">You have unsaved changes</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetForm}
                className="text-amber-700 hover:text-amber-900 text-sm"
              >
                Discard
              </button>
              <button
                onClick={handleSubmit}
                className="bg-amber-600 text-white px-3 py-1 rounded text-sm hover:bg-amber-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Head Protection, Eye Protection"
                required
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what types of products belong in this category"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="safety">Safety Equipment</option>
                <option value="industry">Industry Specific</option>
                <option value="general">General</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon (Emoji)
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., ⛑️, 👁️, 🧤"
              />
              <p className="text-sm text-gray-500 mt-1">Use an emoji to represent this category</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              <p className="text-sm text-gray-500 mt-1">Lower numbers appear first</p>
            </div>
          </div>

          <div className="mt-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Featured Category</span>
            </label>
            <p className="text-sm text-gray-500 mt-1">Featured categories appear prominently on the homepage</p>
          </div>
        </div>

        {/* Colors & Styling */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Colors & Styling</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="colors.primary"
                  value={formData.colors.primary}
                  onChange={handleInputChange}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.colors.primary}
                  onChange={(e) => handleInputChange({
                    target: { name: 'colors.primary', value: e.target.value }
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secondary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="colors.secondary"
                  value={formData.colors.secondary}
                  onChange={handleInputChange}
                  className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.colors.secondary}
                  onChange={(e) => handleInputChange({
                    target: { name: 'colors.secondary', value: e.target.value }
                  })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="#DBEAFE"
                />
              </div>
            </div>
          </div>

          {/* Color Preview */}
          <div className="mt-4 p-4 rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <div 
              className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium"
              style={{ 
                backgroundColor: formData.colors.secondary,
                color: formData.colors.primary 
              }}
            >
              {formData.icon && <span className="mr-2">{formData.icon}</span>}
              {formData.name || 'Category Name'}
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">SEO Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Title
              </label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SEO title for search engines"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.metaTitle.length}/60 characters (recommended)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meta Description
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SEO description for search engines"
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.metaDescription.length}/160 characters (recommended)
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => handleNavigation('/admin/categories')}
            className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={saving || !hasChanges}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <Save size={16} />
            )}
            {saving ? 'Updating...' : 'Update Category'}
          </button>
        </div>
      </form>

      {/* Discard Changes Confirmation Modal */}
      {showDiscardConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Discard Changes?
            </h3>
            <p className="text-gray-600 mb-6">
              You have unsaved changes. Are you sure you want to leave without saving?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDiscardConfirm(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDiscardConfirm(false);
                  setHasChanges(false);
                  navigate('/admin/categories');
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <CheckCircle size={16} />
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
};

export default EditCategory;