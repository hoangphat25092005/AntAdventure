import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
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

// Province location overrides for better label placement
const provinceLocationOverrides: Record<string, [number, number]> = {
  // ID: [latitude, longitude] - inland positions
  "04": [16.0544, 108.0220], 
  "38": [12.2500, 109.0500], 
  "50": [10.5800, 107.2800]  
};

// Helper function to normalize Vietnamese text for comparison
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

// Helper function to find a province by name with normalization
const findProvinceByName = (provinceName: string) => {
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
  
  return province;
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
  const map = useMap();
  const geoJsonRef = useRef<L.GeoJSON>(null);
  const [popupPosition, setPopupPosition] = useState<[number, number] | null>(null);
  const [popupProvince, setPopupProvince] = useState<any | null>(null);
  const [provinceDetails, setProvinceDetails] = useState<Record<string, any>>({});
  const [initialViewState, setInitialViewState] = useState<{center: L.LatLng, zoom: number} | null>(null);
  const [provinceLabels, setProvinceLabels] = useState<{position: [number, number], name: string}[]>([]);
  const fetchedProvincesRef = useRef<Set<string>>(new Set());
  const isMounted = useRef(true);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Store initial map state
  useEffect(() => {
    setInitialViewState({
      center: map.getCenter(),
      zoom: map.getZoom()
    });
  }, [map]);

  // Fetch province details from server - optimized to prevent repeated calls
  const fetchProvinceDetails = useCallback(async (specificProvinceId?: string) => {
    try {
      // If we're requesting a specific province that's already been fetched, skip
      if (specificProvinceId && fetchedProvincesRef.current.has(specificProvinceId)) {
        console.log(`Province ${specificProvinceId} already fetched, skipping API call`);
        return;
      }

      console.log('Fetching province details...');
      const response = await fetch('http://localhost:3001/api/provinces');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch province details: ${response.status}`);
      }
      
      const provincesData = await response.json();
      
      if (!isMounted.current) return;
      
      // Process and normalize the data
      const details: Record<string, any> = {...provinceDetails};
      
      provincesData.forEach((province: any) => {
        const id = province.id || province.provinceId;
        if (id) {
          // Mark this province as fetched
          fetchedProvincesRef.current.add(id);
          
          // Ensure imageUrl is fully qualified and cached
          const imageUrl = province.imageUrl ? (
            province.imageUrl.startsWith('http') 
              ? province.imageUrl 
              : `http://localhost:3001${province.imageUrl.startsWith('/') ? province.imageUrl : `/${province.imageUrl}`}`
          ) : `https://via.placeholder.com/300x200?text=${encodeURIComponent(province.name)}`;

          details[id] = {
            ...details[id],
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
      
      console.log('✅ Fetched province details');
      setProvinceDetails(details);
      
      // Update popup if currently showing and the data has changed
      if (popupProvince && details[popupProvince.id] && 
          JSON.stringify(details[popupProvince.id]) !== JSON.stringify(provinceDetails[popupProvince.id])) {
        setPopupProvince(prev => ({
          ...prev,
          ...details[popupProvince.id]
        }));
      }
    } catch (error) {
      console.error('Error fetching province details:', error);
    }
  }, [provinceDetails, popupProvince]);

  // Fetch initial province details only once
  useEffect(() => {
    fetchProvinceDetails();
  }, []);

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
    
    // Fetch fresh data for this specific province
    await fetchProvinceDetails(provinceId);
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

  // Province click handler - optimized to prevent unnecessary state updates
  const onProvinceClick = useCallback((feature: any, layer: L.Layer) => {
    const provinceName = feature.properties.Name;
    const province = findProvinceByName(provinceName);
    
    if (province) {
      const provinceId = province.id;
      console.log('Province clicked:', provinceName, 'ID:', provinceId);
      
      // If clicking the already selected province, deselect it
      if (selectedProvinceId === provinceId) {
        handlePopupClose();
        onProvinceSelect('');
        return;
      }
      
      // Otherwise, select the new province
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
      
      // Only fetch details if we don't already have them
      if (!fetchedProvincesRef.current.has(provinceId)) {
        fetchProvinceDetails(provinceId);
      }
      
      setPopupProvince({
        ...province,
        ...provinceDetails[provinceId]
      });
    }
  }, [selectedProvinceId, provinceDetails, handlePopupClose, onProvinceSelect, fetchProvinceDetails]);

  // Style function for provinces - memoized to prevent unnecessary recalculations
  const styleFunction = useCallback((feature: any) => {
    const provinceName = feature.properties.Name;
    const province = findProvinceByName(provinceName);
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

  // Calculate province labels once when geojsonData changes
  useEffect(() => {
    if (geojsonData) {
      const labels: {position: [number, number], name: string}[] = [];
      
      geojsonData.features.forEach(feature => {
        const provinceName = feature.properties.Name;
        const province = findProvinceByName(provinceName);
        
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
  
  // Fetch GeoJSON data once on component mount
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