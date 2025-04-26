import React from 'react';
import { ProvinceListProps } from '../types/types';
import { provinceColors } from '../data/provinceData';

const ProvinceList: React.FC<ProvinceListProps> = ({ 
  provinces, 
  onProvinceSelect, 
  selectedProvinceId 
}) => {
  return (
    <div className="province-list">
      <h3>Vietnam Provinces (63)</h3>
      <div className="province-buttons">
        {provinces.map(province => (
          <button
            key={province.id}
            onClick={() => onProvinceSelect(province.id)}
            className={selectedProvinceId === province.id ? 'selected' : ''}
            style={{
              backgroundColor: provinceColors[province.id] || '#CCCCCC',
              opacity: selectedProvinceId === province.id ? 1 : 0.7
            }}
          >
            {province.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProvinceList;