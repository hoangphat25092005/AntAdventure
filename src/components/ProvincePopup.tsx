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
    >      <div className="bg-white rounded-lg shadow-md p-3 w-48 flex flex-col">
        {/* Province name at the top */}
        <h3 className="text-lg font-bold text-center mb-2 text-orange-600">{province.name}</h3>
        
        {/* Image section */}
        <div 
          className="w-full h-24 bg-gray-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center cursor-pointer relative group"
          onClick={handlePlayClick}
        >
          <img 
            src={"/placeholder.jpg"} 
            alt={province.name}
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/100x75?text=" + province.name;
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
              className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg transform hover:scale-105 transition-transform duration-200"
              onClick={handlePlayClick}
            >
              PLAY NOW
            </button>
          </div>
        </div>
        
        {/* Province info */}
        <div className="mb-2">
          <h4 className="text-sm font-semibold mb-1 text-gray-700">About {province.name}</h4>
          <p className="text-xs text-gray-600">
            Explore the beauty of {province.name}.
          </p>
        </div>
        
        {/* Play button at the bottom */}
        <div className="mt-auto">
          <button 
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-1.5 px-2 rounded-lg text-sm transition-colors"
            onClick={handlePlayClick}
          >
            Play
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default ProvincePopup;