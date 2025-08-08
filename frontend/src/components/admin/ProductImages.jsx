// frontend/src/components/admin/ProductImages.jsx - SIMPLIFIED WORKING VERSION
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

  console.log('🔍 ProductImages props received:', {
    imagesCount: images?.length || 0,
    previewsCount: imagePreviews?.length || 0,
    onImagesChangeType: typeof onImagesChange,
    onImagePreviewsChangeType: typeof onImagePreviewsChange
  });

  // 🔧 SIMPLE FIX: Basic file handling without complex async
  const handleFiles = (files) => {
    if (!onImagesChange || !onImagePreviewsChange) {
      console.error('❌ Required functions not provided:', {
        onImagesChange: typeof onImagesChange,
        onImagePreviewsChange: typeof onImagePreviewsChange
      });
      return;
    }

    setUploadError('');
    setIsUploading(true);

    const fileArray = Array.from(files);
    
    // Validate file count
    if (images.length + fileArray.length > 5) {
      setUploadError(`Maximum 5 images allowed. You can add ${5 - images.length} more.`);
      setIsUploading(false);
      return;
    }

    let processedCount = 0;
    const newFiles = [];
    const newPreviews = [];

    fileArray.forEach((file, index) => {
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

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = {
          id: Date.now() + index,
          file: file,
          url: e.target.result,
          name: file.name,
          size: file.size,
          isMain: images.length === 0 && index === 0
        };

        newFiles.push(file);
        newPreviews.push(preview);
        processedCount++;

        // When all files are processed, update state
        if (processedCount === fileArray.length) {
          console.log('🔍 Updating images:', [...images, ...newFiles]);
          console.log('🔍 Updating previews:', [...imagePreviews, ...newPreviews]);
          
          try {
            onImagesChange([...images, ...newFiles]);
            onImagePreviewsChange([...imagePreviews, ...newPreviews]);
            console.log('✅ Successfully updated images and previews');
          } catch (error) {
            console.error('❌ Error updating state:', error);
            setUploadError('Error updating images. Please try again.');
          }
          
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setUploadError(`Error reading file: ${file.name}`);
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    });
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
    if (!onImagesChange || !onImagePreviewsChange) {
      console.error('❌ Cannot remove image - functions not available');
      return;
    }

    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    onImagesChange(newImages);
    onImagePreviewsChange(newPreviews);
  };

  // Set main image
  const setMainImage = (index) => {
    if (!onImagePreviewsChange) {
      console.error('❌ Cannot set main image - function not available');
      return;
    }

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
              <div className="text-purple-600 font-medium">Processing images...</div>
            </div>
          ) : imagePreviews.length >= 5 ? (
            <div className="space-y-3">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <div className="text-green-600 font-medium">Maximum images reached (5/5)</div>
              <p className="text-sm text-gray-500">Remove an image to add more</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center">
                <Camera className="h-12 w-12 text-gray-400" />
              </div>
              <div>
                <div className="text-lg font-medium text-gray-900">
                  Drop images here or click to browse
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Upload up to 5 images (JPG, PNG, WebP) • Max 5MB each
                </p>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <Zap className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-purple-600 font-medium">
                  First image becomes the main product image
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Upload Error */}
        {uploadError && (
          <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Validation Error */}
        {validationErrors.images && (
          <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{validationErrors.images}</span>
          </div>
        )}
      </div>

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Image Preview ({imagePreviews.length}/5)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {imagePreviews.map((preview, index) => (
              <div
                key={preview.id}
                className={`relative group border-2 rounded-lg overflow-hidden transition-all ${
                  preview.isMain ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'
                }`}
              >
                {/* Main Image Badge */}
                {preview.isMain && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="flex items-center gap-1 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      <Star className="h-3 w-3 fill-current" />
                      Main
                    </div>
                  </div>
                )}

                {/* Image */}
                <div className="aspect-square bg-gray-100">
                  <img
                    src={preview.url}
                    alt={preview.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Image Actions Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                    {!preview.isMain && (
                      <button
                        onClick={() => setMainImage(index)}
                        className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        title="Set as main image"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => removeImage(index)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      title="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-3 bg-white">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {preview.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {(preview.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add More Images Button */}
          {imagePreviews.length < 5 && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-purple-400 hover:bg-purple-50 transition-colors"
            >
              <Plus className="h-6 w-6 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-600">
                Add more images ({5 - imagePreviews.length} remaining)
              </span>
            </button>
          )}
        </div>
      )}

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
          <strong>Debug:</strong> Images: {images.length}, Previews: {imagePreviews.length}, 
          onImagesChange: {typeof onImagesChange}, onImagePreviewsChange: {typeof onImagePreviewsChange}
        </div>
      )}
    </div>
  );
};

export default ProductImages;