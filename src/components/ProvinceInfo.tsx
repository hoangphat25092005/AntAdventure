import React from 'react';
import { ProvinceInfoProps } from '../types/types';

const ProvinceInfo: React.FC<ProvinceInfoProps> = ({ selectedProvince }) => {
  if (!selectedProvince) {
    return (
      <div className="province-info">
        <h2>Select a province to view details</h2>
      </div>
    );
  }

  return (
    <div className="province-info">
      <h2>{selectedProvince.name}</h2>
      <table>
        <tbody>
          <tr>
            <td>Capital:</td>
            <td>{selectedProvince.capital}</td>
          </tr>
          <tr>
            <td>Population:</td>
            <td>{selectedProvince.population.toLocaleString()}</td>
          </tr>
          <tr>
            <td>Area:</td>
            <td>{selectedProvince.area.toLocaleString()} km²</td>
          </tr>
          <tr>
            <td>Region:</td>
            <td>{selectedProvince.region}</td>
          </tr>
          <tr>
            <td>Population Density:</td>
            <td>{Math.round(selectedProvince.population / selectedProvince.area).toLocaleString()} people/km²</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProvinceInfo;