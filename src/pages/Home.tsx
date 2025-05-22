import React, { useState, useEffect } from 'react';
import Map from '../components/Map';
import Leaderboard, { sampleLeaderboardData } from '../components/Leaderboard';
import ProvinceInfo from '../components/ProvinceInfo';
import CopperDrumImage from '../assets/CopperDrum.png'; 
import { provinces } from '../data/provinceData';

const Home: React.FC = () => {
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
    
    const handleProvinceSelect = (provinceId: string) => {
        setSelectedProvinceId(provinceId);
    };
    
    const selectedProvince = selectedProvinceId 
        ? provinces.find(p => p.id === selectedProvinceId) 
        : null;

    return (
        <div className="min-h-full w-full relative">
            <div className="absolute inset-0 bg-cyan-500 opacity-100 z-0"></div>
            
            <div className="absolute inset-0 z-10 flex items-center justify-center">
                <img 
                    src={CopperDrumImage} 
                    alt="Copper Drum" 
                    className="w-full h-full object-contain opacity-70"
                />
            </div>
            
            <div className="container mx-auto relative z-20 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-3/4 pl-48 md:pl-24">
                        <Map 
                            onProvinceSelect={handleProvinceSelect}
                            selectedProvinceId={selectedProvinceId}
                        />
                    </div>
                    
                    <div className="w-full md:w-1/4 space-y-6">
                        {/* <Leaderboard  
                            data={sampleLeaderboardData} 
                            title="Top Explorers"
                        />*/}
                        
                        <div className="sticky top-4 bg-amber-50 border-8 border-amber-500 rounded-[25px] shadow-lg p-4 overflow-hidden transition-all duration-300">
                            {selectedProvince ? (
                                <div className="text-gray-800">
                                    <h2 className="text-2xl font-bold mb-3 text-center text-amber-800">{selectedProvince.name}</h2>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="font-semibold">TP trung tâm:</span>
                                            <span>{selectedProvince.capital}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Vùng:</span>
                                            <span>{selectedProvince.region}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Dân số:</span>
                                            <span>{selectedProvince.population.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Diện tích:</span>
                                            <span>{selectedProvince.area.toLocaleString()} km²</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Mật độ dân số:</span>
                                            <span>{Math.round(selectedProvince.population / selectedProvince.area).toLocaleString()} people/km²</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-600">
                                    <p className="text-lg font-medium">Select a province on the map</p>
                                    <p className="mt-2">Province information will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;