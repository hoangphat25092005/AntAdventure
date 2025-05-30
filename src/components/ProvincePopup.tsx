import React, { useState, useEffect } from 'react';
import { Popup } from 'react-leaflet';
import { Province } from '../data/provinceData';
import { useNavigate } from 'react-router-dom';
import './map.css';

interface ProvincePopupProps {
  province: Province;
  position: [number, number];
  onClose?: () => void;
}

const ProvincePopup: React.FC<ProvincePopupProps> = ({ province, position, onClose }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(province.imageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    checkAdminStatus();
  }, []);

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
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size should not exceed 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Only image files are allowed');
        return;
      }

      const formData = new FormData();
      formData.append('image', file);
      formData.append('id', province.id);
      formData.append('name', province.name);

      console.log('Preparing upload for province:', province.id);
      console.log('File details:', {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`
      });

      const response = await fetch(`http://localhost:3001/api/provinces/${province.id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.province?.imageUrl) {
        setImageUrl(data.province.imageUrl);
        console.log('Image uploaded successfully:', data.province.imageUrl);
      } else {
        const errorMsg = data.message || 'Unknown error';
        console.error('Failed to upload image:', errorMsg);
        setUploadError('Failed to upload image: ' + errorMsg);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Network error. Please try again.');
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
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
            src={(() => {
              // If province has an imageUrl property from the database
              if (imageUrl) {
                return imageUrl.startsWith('http') 
                  ? imageUrl 
                  : `http://localhost:3001${imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`}`;
              } 
              // Fallback to a placeholder image with the province name
              return `https://via.placeholder.com/300x200?text=${encodeURIComponent(province.name)}`;
            })()}
            alt={province.name}
            className="absolute inset-0 object-cover w-full h-full transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            onError={(e) => {
              // If the image fails to load, use a blurred placeholder
              const target = e.target as HTMLImageElement;
              target.src = `https://picsum.photos/300/200?blur=2&random=${province.id}`;
            }}
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
                    if (file) {
                      setSelectedFile(file);
                      handleImageUpload(file);
                    }
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