import React from 'react';
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

  const handlePlayClick = () => {
    navigate(`/multichoice/${province.name.toLowerCase().replace(/\s+/g, '-')}`);
    if (onClose) {
      onClose();
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
        <div 
          className="group relative w-full h-32 rounded-lg overflow-hidden cursor-pointer"
          onClick={handlePlayClick}
        >
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
          
          {/* Province image */}
          <img 
            src={(() => {
              // If province has an imageUrl property from the database
              if (province.imageUrl) {
                // Make sure the URL is properly formed with the backend server
                return `http://localhost:3001${province.imageUrl.startsWith('/') ? province.imageUrl : `/${province.imageUrl}`}`;
              } 
              // Fallback to a placeholder image with the province name
              return `https://via.placeholder.com/300x200?text=${encodeURIComponent(province.name)}`;
            })()}
            alt={province.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            onError={(e) => {
              // If the image fails to load, use a blurred placeholder
              const target = e.target as HTMLImageElement;
              target.src = `https://picsum.photos/300/200?blur=2&random=${province.id}`;
            }}
          />

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg transform hover:scale-105 transition-transform duration-200"
            >
              PLAY NOW
            </button>
          </div>
        </div>
        
        {/* Review Card 
        <div className="group bg-white/80 backdrop-blur-sm rounded-lg p-3 transition-all duration-300 hover:shadow-lg">
          
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

          <h4 className="text-sm font-semibold text-gray-800 mb-1 group-hover:text-orange-500 transition-colors duration-300">
            About {province.name}
          </h4>
          <p className="text-xs text-gray-600 mb-2 line-clamp-3 transform transition-all duration-500 hover:translate-x-1">
            {province.capital && `Capital: ${province.capital}`}
            {province.region && ` • Region: ${province.region}`}
          </p>
        </div>*/}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
            onClick={handlePlayClick}
          >
            Play Quiz
          </button>
          <button 
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
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