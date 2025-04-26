import React, { useState } from 'react';
import Map from '../components/Map';
import ProvinceInfo from '../components/ProvinceInfo';
import { Province } from '../data/provinceData';
import { provinces } from '../data/provinceData';

const Home: React.FC = () => {
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
    
    // Find the selected province object by ID
    const selectedProvince = selectedProvinceId 
        ? provinces.find(p => p.id === selectedProvinceId) || null 
        : null;
    
    const handleProvinceSelect = (provinceId: string) => {
        setSelectedProvinceId(provinceId);
    };

    return (
        <div className="min-h-full w-full bg-cyan-500 p-6">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-white text-center">
                    Explore Vietnam Provinces
                </h1>
                
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Map on the left */}
                    <div className="w-full md:w-1/2 bg-white rounded-lg shadow-lg overflow-hidden">
                        <Map 
                            onProvinceSelect={handleProvinceSelect}
                            selectedProvinceId={selectedProvinceId}
                        />
                    </div>
                    
                    {/* Province info on the right */}
                    <div className="w-full md:w-1/2">
                        {selectedProvince ? (
                            <div className="bg-white p-6 rounded-lg shadow-lg h-full">
                                <ProvinceInfo selectedProvince={selectedProvince} />
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-lg shadow-lg h-full flex items-center justify-center">
                                <p className="text-gray-500 text-lg">Select a province on the map to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;