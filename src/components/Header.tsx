import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';

const Header: React.FC<{ className?: string }> = ({ className }) => {
    const navigate = useNavigate();

    return (
        <header className={`bg-orange-500 flex justify-between items-center p-4 w-full ${className}`}>
            <div className="text-lg font-bold">AntVenture</div>
            <Navigation />
            <button 
                onClick={() => navigate('/login')}
                className="bg-white px-6 py-2 rounded-xl hover:bg-gray-100"
            >
                LOGIN
            </button>
        </header>
    );
};

export default Header;