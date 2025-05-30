import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, Polygon, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ProvinceFeatureCollection, MapProps } from '../types/types';
import { provinceColors, provinces } from '../data/provinceData';
import ProvincePopup from './ProvincePopup';
import './map.css';

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
  const map = useMap();
  const geoJsonRef = useRef<L.GeoJSON>(null);
  const [popupPosition, setPopupPosition] = useState<[number, number] | null>(null);
  const [popupProvince, setPopupProvince] = useState<any | null>(null);
  const [provinceDetails, setProvinceDetails] = useState<Record<string, any>>({});
  const [initialViewState, setInitialViewState] = useState<{center: L.LatLng, zoom: number} | null>(null);
  const [provinceLabels, setProvinceLabels] = useState<{position: [number, number], name: string}[]>([]);

  // Fetch province details from server
  const fetchProvinceDetails = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/provinces');
      if (response.ok) {
        const provincesData = await response.json();
        const details: Record<string, any> = {};
        
        // Process and normalize the data
        provincesData.forEach((province: any) => {
          const id = province.id || province.provinceId;
          if (id) {
            // Ensure imageUrl is fully qualified and cached
            const imageUrl = province.imageUrl ? (
              province.imageUrl.startsWith('http') 
                ? province.imageUrl 
                : `http://localhost:3001${province.imageUrl.startsWith('/') ? province.imageUrl : `/${province.imageUrl}`}`
            ) : `https://via.placeholder.com/300x200?text=${encodeURIComponent(province.name)}`;

            details[id] = {
              ...province,
              id: id,
              provinceId: id,
              imageUrl: imageUrl
            };

            // Preload the image
            const img = new Image();
            img.src = imageUrl;
          }
        });
        
        console.log('✅ Fetched province details:', details);
        setProvinceDetails(details);
        
        // Update popup if currently showing
        if (popupProvince && details[popupProvince.id]) {
          setPopupProvince(prev => ({
            ...prev,
            ...details[popupProvince.id]
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching province details:', error);
    }
  }, [popupProvince]);

  // Fetch initial province details
  useEffect(() => {
    fetchProvinceDetails();
  }, [fetchProvinceDetails]);

  // Store initial map state
  useEffect(() => {
    setInitialViewState({
      center: map.getCenter(),
      zoom: map.getZoom()
    });
  }, [map]);

  // Handle image update for a specific province
  const handleImageUpdate = useCallback(async (provinceId: string, newImageUrl: string) => {
    // Update local state first
    setProvinceDetails(prev => ({
      ...prev,
      [provinceId]: {
        ...prev[provinceId],
        imageUrl: newImageUrl.startsWith('http') 
          ? newImageUrl 
          : `http://localhost:3001${newImageUrl.startsWith('/') ? newImageUrl : `/${newImageUrl}`}`
      }
    }));
    
    // Fetch fresh data to ensure consistency
    await fetchProvinceDetails();
  }, [fetchProvinceDetails]);

  // Reset popup and map position
  const handlePopupClose = useCallback(() => {
    setPopupPosition(null);
    setPopupProvince(null);
    
    if (initialViewState) {
      map.setView(initialViewState.center, initialViewState.zoom, {
        animate: true,
        duration: 0.5
      });
    }
  }, [initialViewState, map]);

  // Province click handler
  const onProvinceClick = useCallback((feature: any, layer: L.Layer) => {
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
      const provinceId = province.id;
      console.log('Province clicked:', provinceName, 'ID:', provinceId);
      
      if (selectedProvinceId === provinceId) {
        handlePopupClose();
        onProvinceSelect('');
        return;
      }
      
      onProvinceSelect(provinceId);
      
      // Get popup position
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
      
      // Set popup with merged province data
      setPopupPosition(position);
      setPopupProvince({
        ...province,
        ...provinceDetails[provinceId]
      });
    }
  }, [selectedProvinceId, provinceDetails, handlePopupClose, onProvinceSelect]);

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

  // Update styles when selected province changes
  useEffect(() => {
    if (geojsonData) {
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
            
            // Update province details with fetched data
            setProvinceDetails(prevDetails => ({
              ...prevDetails,
              [province.id]: {
                ...prevDetails[province.id],
                ...provinceDetails[province.id]
              }
            }));
          }
        }
      });
    }
  }, [geojsonData, provinceDetails]);

  // Calculate province labels
  useEffect(() => {
    if (geojsonData) {
      const labels: {position: [number, number], name: string}[] = [];
      
      geojsonData.features.forEach(feature => {
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
        onEachFeature={(feature, layer) => {
          layer.on({
            click: (e: L.LeafletMouseEvent) => {
              onProvinceClick(feature, e.target);
              L.DomEvent.stopPropagation(e);
            },
            mouseover: (e: L.LeafletMouseEvent) => {
              const layer = e.target;
              layer.setStyle({
                weight: 3,
                color: 'darkblue',
                fillOpacity: 0.8
              });
            },
            mouseout: (e: L.LeafletMouseEvent) => {
              const layer = e.target;
              geoJsonRef.current?.resetStyle(layer);
            }
          });
        }}
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
          onImageUpdate={handleImageUpdate}
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