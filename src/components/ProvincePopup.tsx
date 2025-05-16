import React from 'react';
import { Popup } from 'react-leaflet';
import { Province } from '../data/provinceData';
import './map.css';

interface ProvincePopupProps {
  province: Province;
  position: [number, number];
  onClose?: () => void;
}

const ProvincePopup: React.FC<ProvincePopupProps> = ({ province, position, onClose }) => {
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
      <div className="bg-white rounded-lg shadow-md p-3 w-48 flex flex-col">
        {/* Image section at the top */}
        <div className="w-full h-24 bg-gray-100 rounded-lg mb-2 overflow-hidden flex items-center justify-center">
          <img 
            src={"/placeholder.jpg"} 
            alt={province.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/100x75?text=" + province.name;
            }}
          />
        </div>
        
        {/* Province name and info */}
        <div className="mb-3">
          <h3 className="text-sm font-bold mb-1">{province.name}</h3>
          <p className="text-xs text-gray-600">
            Explore the beauty of {province.name}.
          </p>
        </div>
        
        {/* Play button at the bottom */}
        <div className="mt-auto">
          <button 
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-1.5 px-2 rounded-lg text-sm transition-colors"
            onClick={() => console.log(`Playing in ${province.name}`)}
          >
            Play
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default ProvincePopup;