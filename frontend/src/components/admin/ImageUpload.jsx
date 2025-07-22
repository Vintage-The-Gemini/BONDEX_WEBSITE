// frontend/src/components/admin/ImageUpload.jsx
import React, { useState, useRef, useCallback } from 'react';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle,
  RotateCcw,
  Move,
  Eye
} from 'lucide-react';

const ImageUpload = ({ 
  images = [], 
  setImages, 
  imagePreviews = [], 
  setImagePreviews,
  maxImages = 5,
  maxSizePerImage = 5, // MB
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  title = "Product Images",
  subtitle = "Upload high-quality images of your product",
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFiles = useCallback((files) => {
    setUploadError('');
    setIsProcessing(true);

    const fileArray = Array.from(files);
    
    // Validate file count
    if (images.length + fileArray.length > maxImages) {
      setUploadError(`Maximum ${maxImages} images allowed. You can add ${maxImages - images.length} more.`);
      setIsProcessing(false);
      return;
    }

    const validFiles = [];
    const previews = [];

    fileArray.forEach((file, index) => {
      // Validate file type
      if (!acceptedFormats.includes(file.type)) {
        setUploadError(`File "${file.name}" is not a supported format. Please use JPG, PNG, or WebP.`);
        return;
      }

      // Validate file size
      if (file.size > maxSizePerImage * 1024 * 1024) {
        setUploadError(`File "${file.name}" is too large. Maximum size is ${maxSizePerImage}MB.`);
        return;
      }

      // Add file to valid files
      validFiles.push(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push({
          id: Date.now() + index,
          file: file,
          url: e.target.result,
          name: file.name,
          size: file.size,
          isNew: true
        });

        // Update state when all previews are loaded
        if (previews.length === validFiles.length) {
          setImages(prev => [...prev, ...validFiles]);
          setImagePreviews(prev => [...prev, ...previews]);
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(file);
    });

    if (validFiles.length === 0) {
      setIsProcessing(false);
    }
  }, [images.length, maxImages, maxSizePerImage, acceptedFormats, setImages, setImagePreviews]);

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // Handle drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  // Handle input change
  const handleChange = useCallback((e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  // Remove image
  const removeImage = useCallback((index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setUploadError('');
  }, [setImages, setImagePreviews]);

  // Move image up
  const moveImageUp = useCallback((index) => {
    if (index === 0) return;
    
    setImages(prev => {
      const newImages = [...prev];
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
      return newImages;
    });
    
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      [newPreviews[index], newPreviews[index - 1]] = [newPreviews[index - 1], newPreviews[index]];
      return newPreviews;
    });
  }, [setImages, setImagePreviews]);

  // Move image down
  const moveImageDown = useCallback((index) => {
    if (index === images.length - 1) return;
    
    setImages(prev => {
      const newImages = [...prev];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      return newImages;
    });
    
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      [newPreviews[index], newPreviews[index + 1]] = [newPreviews[index + 1], newPreviews[index]];
      return newPreviews;
    });
  }, [setImages, setImagePreviews, images.length]);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <ImageIcon size={20} />
          {title}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {subtitle} (Max {maxImages} images, {maxSizePerImage}MB each)
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-yellow-400 bg-yellow-50' 
            : images.length >= maxImages
              ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 cursor-pointer'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => images.length < maxImages && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={handleChange}
          className="hidden"
          disabled={images.length >= maxImages}
        />

        {isProcessing ? (
          <div className="flex items-center justify-center gap-2 text-yellow-600">
            <RotateCcw size={20} className="animate-spin" />
            <span>Processing images...</span>
          </div>
        ) : images.length >= maxImages ? (
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <CheckCircle size={20} />
            <span>Maximum images uploaded ({maxImages}/{maxImages})</span>
          </div>
        ) : (
          <>
            <Upload size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600 mb-2">
              <span className="font-medium text-yellow-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, or WebP (max {maxSizePerImage}MB each)
            </p>
          </>
        )}
      </div>

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle size={16} />
          <span className="text-sm">{uploadError}</span>
        </div>
      )}

      {/* Image Previews */}
      {imagePreviews.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">
              Uploaded Images ({imagePreviews.length}/{maxImages})
            </h4>
            {imagePreviews.length > 0 && (
              <p className="text-xs text-gray-500">
                First image will be the main product image
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {imagePreviews.map((preview, index) => (
              <div 
                key={preview.id || index} 
                className={`relative bg-white border rounded-lg p-3 ${
                  index === 0 ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'
                }`}
              >
                {/* Main Image Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium z-10">
                    Main Image
                  </div>
                )}

                <div className="flex gap-3">
                  {/* Image Preview */}
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={preview.url}
                      alt={preview.name || `Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <Eye size={16} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {preview.name || `Image ${index + 1}`}
                    </p>
                    {preview.size && (
                      <p className="text-sm text-gray-500">
                        {formatFileSize(preview.size)}
                      </p>
                    )}
                    {preview.isNew && (
                      <span className="inline-block mt-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1">
                    {/* Move Up */}
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImageUp(index)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        title="Move up"
                      >
                        <Move size={14} className="rotate-180" />
                      </button>
                    )}

                    {/* Move Down */}
                    {index < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImageDown(index)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                        title="Move down"
                      >
                        <Move size={14} />
                      </button>
                    )}

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Remove image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Tips */}
      {images.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Tips for better product images:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use high-resolution images (minimum 800x600 pixels)</li>
            <li>• Show products from multiple angles</li>
            <li>• Use good lighting and clear backgrounds</li>
            <li>• Include close-up shots of important details</li>
            <li>• The first image will be used as the main product image</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;