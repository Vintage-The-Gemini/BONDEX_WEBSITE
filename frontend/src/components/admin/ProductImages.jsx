// frontend/src/components/admin/ProductImages.jsx
import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  Eye, 
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Star,
  Camera,
  Zap,
  Plus
} from 'lucide-react';

const ProductImages = ({ 
  images = [], 
  imagePreviews = [], 
  onImagesChange, 
  onImagePreviewsChange,
  validationErrors = {} 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFiles = async (files) => {
    setUploadError('');
    setIsUploading(true);

    const fileArray = Array.from(files);
    
    // Validate file count
    if (images.length + fileArray.length > 5) {
      setUploadError(`Maximum 5 images allowed. You can add ${5 - images.length} more.`);
      setIsUploading(false);
      return;
    }

    const validFiles = [];
    const previews = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError(`File "${file.name}" is not a valid image.`);
        setIsUploading(false);
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`File "${file.name}" is too large. Maximum size is 5MB.`);
        setIsUploading(false);
        return;
      }

      validFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push({
          id: Date.now() + i,
          file: file,
          url: e.target.result,
          name: file.name,
          size: file.size,
          isMain: images.length === 0 && i === 0 // First image is main
        });

        // Update state when all previews are loaded
        if (previews.length === validFiles.length) {
          onImagesChange([...images, ...validFiles]);
          onImagePreviewsChange([...imagePreviews, ...previews]);
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    onImagesChange(newImages);
    onImagePreviewsChange(newPreviews);
  };

  // Set main image
  const setMainImage = (index) => {
    const newPreviews = imagePreviews.map((preview, i) => ({
      ...preview,
      isMain: i === index
    }));
    onImagePreviewsChange(newPreviews);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-8">
      <div className="flex items-center gap-3 mb-6">
        <ImageIcon className="h-6 w-6 text-purple-500" />
        <h2 className="text-2xl font-bold text-gray-900">Product Images *</h2>
        <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
          📸 CLOUDINARY
        </div>
      </div>

      {/* Upload Area */}
      <div className="mb-6">
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
            dragActive 
              ? 'border-purple-500 bg-purple-50' 
              : imagePreviews.length >= 5 
                ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => imagePreviews.length < 5 && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={imagePreviews.length >= 5}
          />
          
          {isUploading ? (
            <div className="space-y-3">
              <Upload className="h-12 w-12 text-purple-500 mx-auto animate-bounce" />
              <div className="text-purple-600 font-medium">Uploading images...</div>
            </div>
          ) : imagePreviews.length >= 5 ? (
            <div className="space-y-3">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <div className="text-green-600 font-medium">Maximum images reached (5/5)</div>
              <div className="text-sm text-gray-500">Remove an image to add more</div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <Upload className="h-8 w-8 text-purple-500" />
                <Camera className="h-8 w-8 text-blue-500" />
                <Zap className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="text-lg font-medium text-gray-700">
                Drop images here or click to upload
              </div>
              <div className="text-sm text-gray-500">
                PNG, JPG, WebP up to 5MB each • Maximum 5 images
              </div>
              <button
                type="button"
                className="mt-3 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Choose Files
              </button>
            </div>
          )}
        </div>

        {/* Upload Error */}
        {uploadError && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-600 text-sm">{uploadError}</span>
          </div>
        )}

        {/* Validation Error */}
        {validationErrors.images && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-600 text-sm">{validationErrors.images}</span>
          </div>
        )}
      </div>

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Image Gallery ({imagePreviews.length}/5)
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star className="h-4 w-4 text-yellow-500" />
              First image will be the main product image
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={preview.id} className="relative group">
                <div className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                  preview.isMain || index === 0 
                    ? 'border-yellow-400 ring-2 ring-yellow-200' 
                    : 'border-gray-200 hover:border-purple-300'
                }`}>
                  <img
                    src={preview.url}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover"
                  />
                  
                  {/* Main Image Badge */}
                  {(preview.isMain || index === 0) && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      MAIN
                    </div>
                  )}
                  
                  {/* Image Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => setMainImage(index)}
                        className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
                        title="Set as main image"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      type="button"
                      onClick={() => window.open(preview.url, '_blank')}
                      className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                      title="View full size"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                {/* Image Info */}
                <div className="mt-2 text-xs text-gray-500 text-center">
                  <div className="font-medium truncate">{preview.name}</div>
                  <div>{(preview.size / 1024 / 1024).toFixed(1)} MB</div>
                </div>
              </div>
            ))}
          </div>

          {/* Image Guidelines */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Camera className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">📸 Professional Tips</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div className="space-y-1">
                    <p>• <strong>Main Image:</strong> Clean white background, full product view</p>
                    <p>• <strong>Additional Views:</strong> Different angles, close-ups of features</p>
                  </div>
                  <div className="space-y-1">
                    <p>• <strong>Lighting:</strong> Bright, even lighting without shadows</p>
                    <p>• <strong>Resolution:</strong> High quality, at least 800x600 pixels</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;