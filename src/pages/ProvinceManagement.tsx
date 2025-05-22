import React from 'react';
import ProvinceManager from '../components/ProvinceManager';

const ProvinceManagement: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow">
                <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">Province Management</h1>
                    </div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        <ProvinceManager />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProvinceManagement;
