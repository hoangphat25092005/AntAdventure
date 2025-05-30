import React, { useState, useEffect } from 'react';
import { Popup } from 'react-leaflet';
import { Province } from '../data/provinceData';
import { useNavigate } from 'react-router-dom';
import './map.css';

interface ProvincePopupProps {
  province: Province;
  position: [number, number];
  onClose?: () => void;
  onImageUpdate?: (provinceId: string, imageUrl: string) => void;
}

const ProvincePopup: React.FC<ProvincePopupProps> = ({ 
  province, 
  position, 
  onClose,
  onImageUpdate 
}) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [localImageUrl, setLocalImageUrl] = useState<string | undefined>(province.imageUrl);

  useEffect(() => {
    checkAdminStatus();
  }, []);

  useEffect(() => {
    // Update local image URL when province prop changes
    setLocalImageUrl(province.imageUrl);
  }, [province]);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users/checkAdmin', {
        credentials: 'include'
      });
      setIsAdmin(response.ok);
    } catch (err) {
      console.error('Admin check failed:', err);
      setIsAdmin(false);
    }
  };

  const handlePlayClick = () => {
    navigate(`/multichoice/${province.name.toLowerCase().replace(/\s+/g, '-')}`);
    if (onClose) {
      onClose();
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size should not exceed 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setUploadError('Only image files are allowed');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);
      formData.append('id', province.id);
      formData.append('name', province.name);

      const response = await fetch(`http://localhost:3001/api/provinces/${province.id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to upload image');
      }

      const data = await response.json();
      
      if (data.province?.imageUrl) {
        const newImageUrl = data.province.imageUrl;
        
        // Construct full URL if needed
        const fullImageUrl = newImageUrl.startsWith('http') 
          ? newImageUrl 
          : `http://localhost:3001${newImageUrl.startsWith('/') ? newImageUrl : `/${newImageUrl}`}`;
        
        // Update local state first
        setLocalImageUrl(fullImageUrl);
        
        // Then update parent component state
        if (onImageUpdate) {
          onImageUpdate(province.id, fullImageUrl);
        }
      } else {
        throw new Error('No image URL in response');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError(error instanceof Error ? error.message : 'Network error. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getImageUrl = () => {
    if (!localImageUrl) {
      return `https://via.placeholder.com/300x200?text=${encodeURIComponent(province.name)}`;
    }

    try {
      // First try parsing the URL to validate it
      new URL(localImageUrl);
      return localImageUrl;
    } catch {
      // If URL is invalid or relative, construct full backend URL
      const baseUrl = 'http://localhost:3001';
      const path = localImageUrl.startsWith('/') ? localImageUrl : `/${localImageUrl}`;
      return `${baseUrl}${path}`;
    }
  };

  // Enhanced image error handler
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    const originalSrc = target.src;
    
    // Don't retry if we're already using a fallback
    if (originalSrc.includes('picsum.photos') || originalSrc.includes('via.placeholder.com')) {
      return;
    }

    // Try loading from picsum as a first fallback
    const picsumUrl = `https://picsum.photos/300/200?blur=2&random=${province.id}`;
    
    // Load the fallback image first to ensure it exists
    const img = new Image();
    img.onerror = () => {
      // If picsum fails, use placeholder as final fallback
      target.src = `https://via.placeholder.com/300/200?text=${encodeURIComponent(province.name)}`;
    };
    img.onload = () => {
      target.src = picsumUrl;
    };
    img.src = picsumUrl;

    // Log the failure for debugging
    console.error('Failed to load province image:', originalSrc);
  };

  return (
    <Popup 
      className="province-popup"
      position={position}
      closeButton={true}
      // Position the popup directly above the marker with a small offset
      offset={[0, -5]}
      autoPan={true}
      eventHandlers={{
        popupclose: onClose
      }}
    >      
      <div className="bg-gradient-to-br from-[#e8f4f6] to-[#d1e9ec] rounded-lg shadow-md p-4 w-72 flex flex-col gap-3">
        {/* Province name at the top */}
        <h3 className="text-lg font-bold text-center text-orange-600">{province.name}</h3>
        
        {/* Image section with hover effect */}
        <div className="relative w-full h-32 overflow-hidden rounded-lg group">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 z-[1] transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/50 to-transparent group-hover:opacity-100"></div>
          
          {/* Province image */}
          <img 
            src={getImageUrl()}
            alt={province.name}
            className="absolute inset-0 object-cover w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            onError={handleImageError}
          />

          {/* Image upload input for admin users */}
          {isAdmin && (
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 backdrop-blur-sm z-[2]">
              <label className="block w-full">
                <input
                  type="file"
                  accept="image/*"
                  className={`
                    block w-full text-sm text-white cursor-pointer relative z-[3]
                    file:mr-4 file:py-1 file:px-4 
                    file:rounded-full file:border-0 
                    file:bg-orange-500 file:text-white 
                    file:text-sm file:font-semibold 
                    file:hover:bg-orange-600 
                    hover:file:bg-orange-600 
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  disabled={isUploading}
                />
              </label>
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-[4]">
                  <div className="w-6 h-6 border-b-2 border-white rounded-full animate-spin"></div>
                </div>
              )}
              {uploadError && (
                <div className="mt-1 text-xs text-red-400">{uploadError}</div>
              )}
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            className="flex-1 px-4 py-2 text-sm font-bold text-white transition-colors bg-teal-500 rounded-lg hover:bg-teal-600"
            onClick={handlePlayClick}
          >
            Play Quiz
          </button>
          <button 
            className="flex-1 px-4 py-2 text-sm font-bold text-white transition-colors bg-orange-500 rounded-lg hover:bg-orange-600"
            onClick={() => navigate(`/review/${province.name.toLowerCase().replace(/\s+/g, '-')}`)}
          >
            Full Review
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default ProvincePopup;