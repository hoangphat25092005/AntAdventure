import React, { useState } from 'react';

interface ImageUploadProps {
  onImageUpload: (file: File) => Promise<void>;
  currentImageUrl?: string;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, currentImageUrl, className = '' }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (file: File) => {
    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Call the parent's upload handler
    await onImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await handleFileChange(file);
    }
  };

  return (
    <div
      className={`relative group cursor-pointer rounded-lg overflow-hidden ${className} ${
        isDragging ? 'border-2 border-dashed border-blue-500' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
      />
      
      {previewUrl ? (
        <div className="relative w-full h-full">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <p className="text-white text-sm">Click or drag to change image</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full min-h-[200px] bg-gray-100 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-gray-500">Click or drag image here</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
