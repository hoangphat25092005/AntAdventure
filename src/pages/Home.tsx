import React, { useState } from 'react';
import Map from '../components/Map';
import Leaderboard, { sampleLeaderboardData } from '../components/Leaderboard';
import CopperDrumImage from '../assets/CopperDrum.png'; // Import directly in Home component

const Home: React.FC = () => {
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
    
    const handleProvinceSelect = (provinceId: string) => {
        setSelectedProvinceId(provinceId);
    };

    return (
        <div className="min-h-full w-full relative">
            {/* Background color with reduced opacity */}
            <div className="absolute inset-0 bg-cyan-500 opacity-100 z-0"></div>
            
            {/* CopperDrum image above the background color */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
                <img 
                    src={CopperDrumImage} 
                    alt="Copper Drum" 
                    className="w-full h-full object-contain opacity-70"
                />
            </div>
            
            {/* Content above both backgrounds */}
            <div className="container mx-auto relative z-20 p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Map on the left */}
                    <div className="w-full md:w-3/4">
                        <Map 
                            onProvinceSelect={handleProvinceSelect}
                            selectedProvinceId={selectedProvinceId}
                        />
                    </div>
                    
                    {/* Leaderboard on the right */}
                    <div className="w-full md:w-1/4">
                        <Leaderboard 
                            data={sampleLeaderboardData} 
                            title="Top Explorers"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;