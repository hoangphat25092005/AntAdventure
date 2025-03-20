import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="min-h-full w-full flex items-center justify-center bg-cyan-500">
            <div className="text-white text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to Our Website</h1>
                <p className="text-xl">Please login to access all features</p>
            </div>
        </div>
    );
};

export default Home;