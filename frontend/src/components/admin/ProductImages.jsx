// frontend/src/components/admin/ProductImages.jsx
import React from 'react';
import { 
  Upload, 
  X, 
  Eye, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Star,
  Camera,
  Zap
} from 'lucide-react';

const ProductImages = ({ 
  images = [], 
  imagePreviews = [], 
  onImageUpload, 
  onRemoveImage, 
  onSetMainImage,
  validationErrors = {} 
}) => {

  // Get image status info
  const getImageStatus = () => {
    if (imagePreviews.length === 0) return { color: 'red', message: '❌ No images uploaded', icon: '📸' };
    if (imagePreviews.length === 1) return { color: 'yellow', message: '⚠️ Add more images for better conversion', icon: '📷' };
    if (imagePreviews.length <= 3) return { color: 'blue', message: '📸 Good image coverage', icon: '📹' };
    return { color: 'green', message: '✅ Excellent image gallery', icon: '🎬' };
  };

  const imageStatus = getImageStatus();

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ImageIcon className="h-6 w-6 text-purple-600" />
          Product Images *
          <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
            📸 CLOUDINARY POWERED
          </span>
        </h2>
        
        {/* Image Status */}
        <div className={`px-4 py-2 rounded-lg font-medium text-${imageStatus.color}-600 bg-${imageStatus.color}-100`}>
          {imageStatus.icon} {imagePreviews.length}/5 images
        </div>
      </div>

      {/* Upload Guidelines */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Camera className="h-4 w-4" />
          📸 Professional Image Guidelines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1 text-blue-800">
            <p>• <span className="font-medium">Main Image:</span> Product on white background</p>
            <p>• <span className="font-medium">Angle 1:</span> Front view showing key features</p>
            <p>• <span className="font-medium">Angle 2:</span> Side/back view for full coverage</p>
          </div>
          <div className="space-y-1 text-blue-800">
            <p>• <span className="font-medium">Detail Shots:</span> Close-ups of important features</p>
            <p>• <span className="font-medium">In Use:</span> Product being worn/used (optional)</p>
            <p>• <span className="font-medium">Quality:</span> High resolution, good lighting</p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          imagePreviews.length >= 5 
            ? 'border-gray-200 bg-gray-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}>
          {imagePreviews.length < 5 ? (
            <>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={onImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-xl font-bold text-gray-900 mb-2">
                  Click to upload product images
                </p>
                <p className="text-gray-600 mb-4">
                  JPEG, PNG, or WebP • Max 5MB each • Up to 5 images
                </p>
                <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <Camera className="h-4 w-4" />
                  Select Images
                </div>
              </label>
            </>
          ) : (
            <div className="text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium">Maximum 5 images reached</p>
              <p className="text-sm">Remove an image to upload more</p>
            </div>
          )}
        </div>
        
        {validationErrors.images && (
          <p className="text-red-500 text-sm mt-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {validationErrors.images}
          </p>
        )}
      </div>

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Image Gallery</h3>
            <p className="text-sm text-gray-600">
              {imageStatus.message}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-blue-400 transition-colors">
                  <img
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Image Controls Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => onSetMainImage(index)}
                        className="bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors"
                        title="Set as main image"
                      >
                        <Star size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onRemoveImage(index)}
                      className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition-colors"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                
                {/* Main Image Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-2 py-1 rounded font-bold flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    MAIN
                  </div>
                )}
                
                {/* Image Quality Indicator */}
                <div className="absolute top-2 right-2">
                  <div className="bg-white bg-opacity-90 rounded-full p-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
                
                {/* Image Info */}
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    <p className="truncate font-medium">{preview.name}</p>
                    <p className="text-gray-300">
                      {(preview.file.size / 1024 / 1024).toFixed(1)}MB
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Image Management Tips */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              💡 Image Optimization Tips
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
              <div className="space-y-1">
                <p>• Main image should show the complete product clearly</p>
                <p>• Include detail shots of important safety features</p>
                <p>• Show any certifications or compliance markings</p>
              </div>
              <div className="space-y-1">
                <p>• Use consistent lighting across all images</p>
                <p>• Include scale reference (hand, ruler) if size matters</p>
                <p>• Images are auto-optimized for web performance</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              🎯 <span className="font-medium">Pro Tip:</span> First image becomes the main product image in search results
            </p>
            
            <div className="flex gap-3">
              {imagePreviews.length < 3 && (
                <label htmlFor="image-upload" className="cursor-pointer text-sm bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium">
                  📸 Add More Images
                </label>
              )}
              
              {imagePreviews.length > 0 && (
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                  className="text-sm bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors font-medium"
                >
                  ✅ Continue to Next Step
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;