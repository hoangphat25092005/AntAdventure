import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Polygon,Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ProvinceFeatureCollection, MapProps } from '../types/types';
import { provinceColors, provinces } from '../data/provinceData';
import ProvincePopup from './ProvincePopup';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import './map.css'; 
import Leaderboard from './Leaderboard';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const center: [number, number] = [12.5474, 108.2220];

// Vietnam boundaries with extended view to show all of Vietnam
const vietnamBounds: L.LatLngBoundsExpression = [
  [8.18, 102.14],  // Southwest corner
  [25.09, 109.46]  // Northeast corner - moved further north from 23.39 to 25.39
];

const vietnamOutline: L.LatLngExpression[] = [
  [6.0, 101.0],    // Southwest 
  [6.0, 120.0],    // Southeast 
  [25.39, 120.0],  // Northeast 
  [25.39, 101.0],  // Northwest 
  [6.0, 101.0],    // Back to Southwest to close the polygon
];
// Outer bounds - larger than the entire visible map
const outerBounds: L.LatLngExpression[] = [
  [-90, -180],
  [-90, 180],
  [90, 180],
  [90, -180],
  [-90, -180],
];
const provinceLocationOverrides: Record<string, [number, number]> = {
  // ID: [latitude, longitude] - inland positions
  "04": [16.0544, 108.0220], 
  "38": [12.2500, 109.0500], 
  "50": [10.5800, 107.2800]  
};


function normalizeVietnamese(str: string) {
  return str
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd');
}

// Component to handle GeoJSON data and interaction
const GeoJSONLayer = ({ 
  geojsonData, 
  selectedProvinceId, 
  onProvinceSelect 
}: { 
  geojsonData: ProvinceFeatureCollection;
  selectedProvinceId: string | null;
  onProvinceSelect: (provinceId: string) => void;
}) => {
  const geoJsonRef = useRef<L.GeoJSON>(null);
  const map = useMap();
  const [popupPosition, setPopupPosition] = useState<[number, number] | null>(null);
  const [popupProvince, setPopupProvince] = useState<any | null>(null);
  const [provinceLabels, setProvinceLabels] = useState<{position: [number, number], name: string}[]>([]);
  const [initialViewState, setInitialViewState] = useState<{center: L.LatLng, zoom: number} | null>(null);
  
  // Store initial map state when component mounts
  useEffect(() => {
    setInitialViewState({
      center: map.getCenter(),
      zoom: map.getZoom()
    });
  }, [map]);
  
  const handlePopupClose = useCallback(() => {
    setPopupPosition(null);
    setPopupProvince(null);
    
    // If initialViewState exists, reset the map to initial position
    if (initialViewState) {
      map.setView(initialViewState.center, initialViewState.zoom, {
        animate: true,
        duration: 0.5
      });
    }
  }, [initialViewState, map]);
  const styleFunction = useCallback((feature: any) => {
    const provinceName = feature.properties.Name;
    
    // Try direct match first
    let province = provinces.find(p => p.name === provinceName);
    
    // If no direct match, try case-insensitive and removing diacritics
    if (!province) {
      const normalizedName = provinceName.replace(/\s+/g, '').toLowerCase();
      province = provinces.find(p => 
        p.name.replace(/\s+/g, '').toLowerCase() === normalizedName ||
        normalizeVietnamese(p.name).replace(/\s+/g, '').toLowerCase() === normalizedName
      );
    }
    
    const provinceId = province?.id;
    const isSelected = provinceId === selectedProvinceId;
    
    return {
      fillColor: isSelected ? '#FFA500' : 'skyblue', 
      weight: isSelected ? 3 : 2,
      opacity: 1,
      color: isSelected ? '#00008B' : '#000000', 
      fillOpacity: isSelected ? 1 : 1
    };
  }, [selectedProvinceId]);

  const onEachFeature = (feature: any, layer: L.Layer) => {
    layer.on({
      click: (e) => {
        const provinceName = feature.properties.Name;
        let province = provinces.find(p => p.name === provinceName);
        
        if (!province) {
          const normalizedName = provinceName.replace(/\s+/g, '').toLowerCase();
          province = provinces.find(p => 
            p.name.replace(/\s+/g, '').toLowerCase() === normalizedName ||
            normalizeVietnamese(p.name).replace(/\s+/g, '').toLowerCase() === normalizedName
          );
        }
        
        const provinceId = province?.id;
      
      if (province && provinceId) {
        console.log('Province clicked:', provinceName, 'ID:', provinceId, 'Matched to:', province.name);
        
        if (selectedProvinceId === provinceId) {
          // Handle deselection in one step instead of using setTimeout
          handlePopupClose(); // Close popup and reset map position  
          onProvinceSelect(''); // Deselect the province
          return;
        }
        
        // Otherwise select the new province
        onProvinceSelect(provinceId);
        
        // Get position for the popup, prioritizing overrides
        let position: [number, number];
        
        if (provinceLocationOverrides[provinceId]) {
          position = provinceLocationOverrides[provinceId];
        } else if (layer instanceof L.Polygon) {
          const bounds = layer.getBounds();
          const center = bounds.getCenter();
          position = [center.lat, center.lng];
        } else {
          return;
        }
        
        // Set popup information
        setPopupPosition(position);
        setPopupProvince(province);
        
      } else {
        console.log('Province name not found in data:', provinceName);
      }
      
      // Prevent click event from propagating to map
      L.DomEvent.stopPropagation(e);
    },
    
    // Keep your existing hover handlers
    mouseover: (e) => {
      const layer = e.target;
      layer.setStyle({
        weight: 3,
        color: 'darkblue',
        fillOpacity: 0.8
      });
      
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
      }
    },
    mouseout: (e) => {
      if (geoJsonRef.current) {
        geoJsonRef.current.resetStyle(e.target);
      }
    }
  });
};

  // Update styles when selected province changes
  useEffect(() => {
    if (geojsonData) {
      const labels: {position: [number, number], name: string}[] = [];
      
      geojsonData.features.forEach(feature => {
        if (feature.geometry.type === "Polygon" || feature.geometry.type === "MultiPolygon") {
          // Get the province name and find corresponding province
          const provinceName = feature.properties.Name;
          let province = provinces.find(p => p.name === provinceName);
          
          if (!province) {
            const normalizedName = provinceName.replace(/\s+/g, '').toLowerCase();
            province = provinces.find(p => 
              p.name.replace(/\s+/g, '').toLowerCase() === normalizedName ||
              normalizeVietnamese(p.name).replace(/\s+/g, '').toLowerCase() === normalizedName
            );
          }
          
          if (province) {
            // Use override position if available, otherwise use center of province
            let position: [number, number];
            
            if (provinceLocationOverrides[province.id]) {
              position = provinceLocationOverrides[province.id];
            } else {
              const layer = L.geoJSON(feature);
              const bounds = layer.getBounds();
              const center = bounds.getCenter();
              position = [center.lat, center.lng];
            }
            
            labels.push({
              position: position,
              name: province.name
            });
          }
        }
      });
      
      setProvinceLabels(labels);
    }
  }, [geojsonData]);


  return (
    <>
      <GeoJSON
        ref={geoJsonRef}
        data={geojsonData}
        style={styleFunction}
        onEachFeature={onEachFeature}
      />
      {/* Add province labels */}
      {provinceLabels.map((label, index) => (
        <div key={index}>
          <Marker 
            position={label.position}
            icon={L.divIcon({
              className: 'province-label',
              html: `<div class="province-name-container"><span class="province-name">${label.name}</span></div>`,
              iconSize: [100, 40],
              iconAnchor: [50, 20]
            })}
            interactive={false}
          />
        </div>
      ))}
      {popupPosition && popupProvince && (
        <ProvincePopup 
          province={popupProvince}
          position={popupPosition}
          onClose={handlePopupClose}
        />
      )}
    </>
  );
};

const Map: React.FC<MapProps> = ({ onProvinceSelect, selectedProvinceId }) => {
  const [geojsonData, setGeojsonData] = useState<ProvinceFeatureCollection | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchGeoJson = async () => {
      try {
        // Path relative to public folder
        const response = await fetch('/vietnam-provinces.geojson');
        if (!response.ok) {
          throw new Error(`Failed to fetch GeoJSON: ${response.status}`);
        }
        
        const text = await response.text();
        // Clean the JSON text by removing any comments (lines starting with //)
        const cleanedJson = text.replace(/^\s*\/\/.*$/gm, '');
        
        try {
          const data = JSON.parse(cleanedJson);
          setGeojsonData(data as ProvinceFeatureCollection);
        } catch (parseError) {
          throw new Error(`Failed to parse GeoJSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching GeoJSON:', err);
      }
    };

    fetchGeoJson();
  }, []);

  if (error) {
    return <div>Error loading map data: {error}</div>;
  }

  return (
    <div className="w-full h-full" style={{ marginLeft: "-200px" }}>
      <MapContainer
        center={center} 
        zoom={7} 
        style={{ 
          height: '1600px', 
          width: '100%', 
          margin: 0,
          padding: 0,
          borderRadius: '8px',
          background: 'transparent',
          backgroundColor: 'transparent'
        }}
        zoomControl={false}
        scrollWheelZoom={false}
        dragging={false} 
        doubleClickZoom={false}
        touchZoom={false}
        attributionControl={false}
        maxBounds={vietnamBounds}
        maxBoundsViscosity={1.0} 
      >
        {geojsonData && (
          <GeoJSONLayer 
            geojsonData={geojsonData} 
            selectedProvinceId={selectedProvinceId} 
            onProvinceSelect={onProvinceSelect} 
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;