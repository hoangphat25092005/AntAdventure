import React from 'react';
import { Popup } from 'react-leaflet';
import { Province } from '../data/provinceData';

interface ProvincePopupProps {
  province: Province;
}

const ProvincePopup: React.FC<ProvincePopupProps> = ({ province }) => {
  return (
    <Popup 
      className="province-popup"
      closeButton={false}
      autoPan={false}
    >
      <div className="bg-white rounded-lg shadow-md p-3 max-w-xs">
        <div className="flex items-center mb-2">
          <div className="rounded-full bg-cyan-500 h-8 w-8 flex items-center justify-center text-white font-bold">
            {province.name.charAt(0)}
          </div>
          <h3 className="text-lg font-bold ml-2">{province.name}</h3>
        </div>
        <p className="text-sm text-gray-600">Explore this beautiful province!</p>
        <div className="text-right text-xs text-gray-400 mt-1">Click for details</div>
      </div>
    </Popup>
  );
};

export default ProvincePopup;