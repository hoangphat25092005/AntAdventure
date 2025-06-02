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
  const [localImageUrl, setLocalImageUrl] = useState<string | undefined>(province.imageUrl);

  useEffect(() => {
    // Update local image URL when province prop changes
    setLocalImageUrl(province.imageUrl);
  }, [province]);

  const handlePlayClick = () => {
    navigate(`/multichoice/${province.name.toLowerCase().replace(/\s+/g, '-')}`);
    if (onClose) {
      onClose();
    }
  };

const getImageUrl = () => {
  const baseUrl = 'http://localhost:3001';
  
  console.log('🔍 Getting image URL for:', province.name, 'ID:', province.id, 'Current URL:', localImageUrl);
  
  // If we have a localImageUrl, process it
  if (localImageUrl) {
    // Case 1: It's already a full URL
    if (localImageUrl.startsWith('http')) {
      return localImageUrl;
    }
    
    // Case 3: Standard image path format
    if (localImageUrl.startsWith('/images/') || localImageUrl.startsWith('/uploads/')) {
      return `${baseUrl}${localImageUrl}`;
    }
    
    // Case 4: Just a filename
    return `${baseUrl}/images/provinces/${localImageUrl}`;
  }
  
  // No localImageUrl provided, construct based on province ID with standard format
  const paddedId = province.id.padStart(2, '0');
  return `${baseUrl}/images/provinces/province_${paddedId}.jpg`;
};


const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  
  // Set a gray background on the image itself rather than hiding it
  target.style.opacity = '0';
  
  // Find the parent container and add gray background
  const container = target.parentElement;
  if (container) {
    container.style.backgroundColor = '#e2e8f0'; // A light gray color (Tailwind gray-200)
  }
  
  // Just log the error without creating additional elements
  console.error('⚠️ Image failed to load:', {
    province: province.name,
    provinceId: province.id
  });
};

  return (
    <Popup 
      className="province-popup"
      position={position}
      closeButton={true}
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
            //onError={handleImageError}
            loading="eager"
          />
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