// frontend/src/components/admin/ProductImages.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  X,
  Image as ImageIcon,
  AlertCircle,
  CheckCircle,
  Eye,
  Download,
  Trash2,
  RotateCcw,
  ZoomIn
} from 'lucide-react';

const ProductImages = ({ 
  images = [], 
  setImages,
  imagePreviews = [], 
  setImagePreviews,
  validationErrors = {} 
}) => {
  // ✅ FIXED: Use the props directly, no need for onImagesChange/onImagePreviewsChange
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedPreviewIndex, setSelectedPreviewIndex] = useState(0);
  const fileInputRef = useRef(null);

  // 🔍 DEBUG: Log props to understand what's being received
  useEffect(() => {
    console.log('🔍 ProductImages props received:', {
      imagesCount: images?.length || 0,
      previewsCount: imagePreviews?.length || 0,
      setImagesType: typeof setImages,
      setImagePreviewsType: typeof setImagePreviews
    });

    // 🔍 Check if required functions are provided
    if (typeof setImages !== 'function' || typeof setImagePreviews !== 'function') {
      console.error('❌ Required functions not provided:', {
        setImages: typeof setImages,
        setImagePreviews: typeof setImagePreviews
      });
    }
  }, [images, imagePreviews, setImages, setImagePreviews]);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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

  // Main file handling function
  const handleFiles = (fileList) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const maxFiles = 6; // Maximum 6 images per product

    const files = Array.from(fileList);
    
    // Filter valid files
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        console.warn(`File ${file.name} rejected: Invalid type`);
        return false;
      }
      if (file.size > maxSize) {
        console.warn(`File ${file.name} rejected: Too large`);
        return false;
      }
      return true;
    });

    // Check if adding these files would exceed the limit
    const totalFiles = (images?.length || 0) + validFiles.length;
    if (totalFiles > maxFiles) {
      console.warn(`Cannot add files: Would exceed limit of ${maxFiles} images`);
      return;
    }

    // Process valid files
    validFiles.forEach((file, index) => {
      const fileId = `${Date.now()}-${index}`;
      
      // Add to images array
      if (setImages && typeof setImages === 'function') {
        setImages(prev => [...(prev || []), { file, id: fileId, name: file.name }]);
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (setImagePreviews && typeof setImagePreviews === 'function') {
          setImagePreviews(prev => [...(prev || []), e.target.result]);
        }
      };
      reader.readAsDataURL(file);

      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = Math.min((prev[fileId] || 0) + 10, 100);
          if (newProgress === 100) {
            clearInterval(interval);
            setTimeout(() => {
              setUploadProgress(p => {
                const { [fileId]: removed, ...rest } = p;
                return rest;
              });
            }, 1000);
          }
          return { ...prev, [fileId]: newProgress };
        });
      }, 100);
    });
  };

  // Remove image
  const removeImage = (index) => {
    if (setImages && typeof setImages === 'function') {
      setImages(prev => prev.filter((_, i) => i !== index));
    }
    if (setImagePreviews && typeof setImagePreviews === 'function') {
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Open file dialog
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg">
          <ImageIcon className="h-5 w-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
          <p className="text-sm text-gray-600">
            Upload up to 6 high-quality images (JPEG, PNG, WebP - max 5MB each)
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div className="space-y-6">
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
            dragActive
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-300 hover:border-orange-400 hover:bg-orange-25'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInputChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-gray-400" />
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                Drop images here or click to upload
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supports: JPEG, PNG, WebP up to 5MB each
              </p>
            </div>
            
            <button
              type="button"
              onClick={openFileDialog}
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </button>
          </div>
        </div>

        {/* Validation Error */}
        {validationErrors.images && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">Image Error</span>
            </div>
            <p className="text-red-700 mt-1">{validationErrors.images}</p>
          </div>
        )}

        {/* Image Previews */}
        {imagePreviews && imagePreviews.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-gray-900">
                Uploaded Images ({imagePreviews.length}/6)
              </h4>
              {imagePreviews.length > 0 && (
                <button
                  type="button"
                  onClick={() => setPreviewMode(true)}
                  className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview Gallery
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative group bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
                >
                  <div className="aspect-square">
                    <img
                      src={preview}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Upload Progress */}
                  {images[index] && uploadProgress[images[index].id] !== undefined && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p className="text-sm">{uploadProgress[images[index].id]}%</p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPreviewIndex(index);
                          setPreviewMode(true);
                        }}
                        className="p-1.5 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                        title="Preview"
                      >
                        <ZoomIn className="h-4 w-4 text-gray-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1.5 bg-white rounded-md shadow-sm hover:bg-red-50 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {/* Primary Image Indicator */}
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                      Primary
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Helper Text */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-800 font-medium">Image Tips:</p>
                  <ul className="text-blue-700 mt-1 space-y-1">
                    <li>• First image will be the primary product image</li>
                    <li>• Use high-resolution images (1200x1200px or larger)</li>
                    <li>• Show multiple angles and important details</li>
                    <li>• Ensure good lighting and clear focus</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {previewMode && imagePreviews.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={() => setPreviewMode(false)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors z-10"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>

              <div className="bg-white rounded-lg p-4">
                <img
                  src={imagePreviews[selectedPreviewIndex]}
                  alt={`Product ${selectedPreviewIndex + 1}`}
                  className="w-full h-auto max-h-96 object-contain rounded"
                />

                {imagePreviews.length > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <button
                      onClick={() => setSelectedPreviewIndex(prev => 
                        prev === 0 ? imagePreviews.length - 1 : prev - 1
                      )}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    
                    <span className="text-sm text-gray-600">
                      {selectedPreviewIndex + 1} of {imagePreviews.length}
                    </span>
                    
                    <button
                      onClick={() => setSelectedPreviewIndex(prev => 
                        prev === imagePreviews.length - 1 ? 0 : prev + 1
                      )}
                      className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImages;