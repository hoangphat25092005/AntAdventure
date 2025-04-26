import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Polygon, ZoomControl, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ProvinceFeatureCollection, MapProps } from '../types/types';
import { provinceColors, provinces } from '../data/provinceData';
import ProvincePopup from './ProvincePopup';
import './map.css';
// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Center of Vietnam
const center: [number, number] = [16.0474, 108.2220];

// Vietnam boundaries
const vietnamBounds: L.LatLngBoundsExpression = [
  [8.18, 102.14],  // Southwest corner
  [23.39, 109.46]  // Northeast corner
];

const vietnamOutline: L.LatLngExpression[] = [
  [6.0, 101.0],    // Southwest - extended south
  [6.0, 120.0],    // Southeast - extended east and south to include Spratly Islands
  [23.39, 120.0],  // Northeast - extended east to include more sea area
  [23.39, 101.0],  // Northwest
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

const MaskComponent = () => {
  const maskedPolygon = [outerBounds, vietnamOutline];

  const maskStyle = {
    fillColor: '#FFFFFF', // Light blue-gray color that matches sea color
    fillOpacity: 0.95,    // High opacity to hide other countries
    stroke: false,
    interactive: false
  };

  return (
    <Polygon positions={maskedPolygon} pathOptions={maskStyle} />
  );
};

// Component to restrict map view to Vietnam
const MapBoundary = () => {
  const map = useMap();
  
  useEffect(() => {
    map.setMaxBounds(vietnamBounds);
    map.setMinZoom(6);
    map.setMaxZoom(8);
    map.on('drag', () => {
      map.panInsideBounds(vietnamBounds, { animate: false });
    });
    const mapContainer = map.getContainer();
    mapContainer.style.background = '#F5F5F5'; 
    
    return () => {
      map.off('drag');
    };
  }, [map]);
  
  return null;
};

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

const styleFunction = useCallback((feature: any) => {
  const provinceName = feature.properties.Name;
  
  // Use the same name matching logic as in onEachFeature
  // Try direct match first
  let province = provinces.find(p => p.name === provinceName);
  
  // If no direct match, try case-insensitive and removing diacritics
  if (!province) {
    // Remove spaces and convert to lowercase for both names
    const normalizedName = provinceName.replace(/\s+/g, '').toLowerCase();
    province = provinces.find(p => 
      p.name.replace(/\s+/g, '').toLowerCase() === normalizedName ||
      normalizeVietnamese(p.name).replace(/\s+/g, '').toLowerCase() === normalizedName
    );
  }
  
  const provinceId = province?.id;
  const isSelected = provinceId === selectedProvinceId;
  
  // Debug: Log when styling a selected province
  if (isSelected) {
    console.log('Styling selected province:', provinceName, provinceId);
  }
  
  return {
    fillColor: isSelected ? '#FF3333' : (provinceId && provinceColors[provinceId] ? provinceColors[provinceId] : '#CCCCCC'),
    weight: isSelected ? 3 : 2,
    opacity: 1,
    color: isSelected ? '#FF0000' : '#FFFFFF',
    fillOpacity: isSelected ? 0.9 : 0.8
  };
}, [selectedProvinceId]);

  // Click handler for provinces
  const onEachFeature = (feature: any, layer: L.Layer) => {
    layer.on({
      click: (e) => {
        // Find the province ID by matching the name
        const provinceName = feature.properties.Name;
        
        // Normalize province names for comparison
        // Method 1: Try direct match first
        let province = provinces.find(p => p.name === provinceName);
        
        // Method 2: If no direct match, try case-insensitive and removing diacritics
        if (!province) {
          // Remove spaces and convert to lowercase for both names
          const normalizedName = provinceName.replace(/\s+/g, '').toLowerCase();
          province = provinces.find(p => 
            p.name.replace(/\s+/g, '').toLowerCase() === normalizedName ||
            normalizeVietnamese(p.name).replace(/\s+/g, '').toLowerCase() === normalizedName
          );
        }
        
        const provinceId = province?.id;
        
        if (province && provinceId) {
          console.log('Province clicked:', provinceName, 'ID:', provinceId, 'Matched to:', province.name);
          onProvinceSelect(provinceId);
          
          // Calculate the center point of the clicked province for the popup
          if (layer instanceof L.Polygon) {
            const bounds = layer.getBounds();
            const center = bounds.getCenter();
            setPopupPosition([center.lat, center.lng]);
            setPopupProvince(province);
          }
        } else {
          console.log('Province name not found in data:', provinceName);
        }
        
        // Prevent click event from propagating to map
        L.DomEvent.stopPropagation(e);
      },
      // Rest of the events stay the same
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          color: '#666',
          dashArray: '',
          fillOpacity: 0.9
        });
        layer.bringToFront();
      },
      mouseout: (e) => {
        if (geoJsonRef.current) {
          geoJsonRef.current.resetStyle(e.target);
        }
      }
    });
  };
  // Add this function to use the map variable
  useEffect(() => {
    // Optional: fit bounds to the GeoJSON data when it loads
    if (geoJsonRef.current) {
      const bounds = geoJsonRef.current.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds);
      }
    }
  }, [map]);

  // Update styles when selected province changes
  useEffect(() => {
    if (geoJsonRef.current) {
      geoJsonRef.current.setStyle(styleFunction);
    }
  }, [selectedProvinceId, styleFunction]);

  return (
  <>
    <GeoJSON
      ref={geoJsonRef}
      data={geojsonData}
      style={styleFunction}
      onEachFeature={onEachFeature}
    />
  {popupPosition && popupProvince && (
  <Popup 
    position={popupPosition}
    closeButton={false}
    className="province-message-popup"
    eventHandlers={{
      popupclose: () => setPopupPosition(null)
    }}
  >
    <div className="bg-white rounded-lg shadow-md p-3 max-w-xs">
      <div className="flex items-center mb-2">
        <div className="rounded-full bg-cyan-500 h-8 w-8 flex items-center justify-center text-white font-bold">
          {popupProvince.name.charAt(0)}
        </div>
        <h3 className="text-lg font-bold ml-2">{popupProvince.name}</h3>
      </div>
      <p className="text-sm text-gray-600">{popupProvince.shortDescription || 'Explore this beautiful province!'}</p>
      <div className="text-right text-xs text-gray-400 mt-1">Click for details</div>
    </div>
  </Popup>
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
    <MapContainer
      center={center}
      zoom={6}
      style={{ height: '600px', width: '100%', background: '#D6E8ED' }} // Match the sea color
      zoomControl={false}
      maxBounds={vietnamBounds}
      maxBoundsViscosity={1.0}
      attributionControl={false}
    >
      {/* Use a minimal tile layer with less geographical features */}
      <TileLayer
        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png"
        opacity={0.2} // Reduce opacity to make base map very faint
      />
      <MapBoundary />
      {/* Mask everything outside Vietnam */}
      <MaskComponent />
      {geojsonData && (
        <GeoJSONLayer 
          geojsonData={geojsonData} 
          selectedProvinceId={selectedProvinceId} 
          onProvinceSelect={onProvinceSelect} 
        />
      )}
      {/* Add zoom control in the top-right corner */}
      <ZoomControl position="topright" />
    </MapContainer>
  );
};

export default Map;