import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import Logo from '../assets/Logo.png';

const Header: React.FC<{ className?: string }> = ({ className }) => {
    const navigate = useNavigate();

    return (
        <header className={`bg-orange-500 flex justify-between items-center p-4 w-full ${className}`}>
            <div className="flex items-center ml-20">
                <img 
                    src={Logo} 
                    alt="AntVenture Logo" 
                    className="h-20 w-20 mr-2" 
                />
                <div className="text-3xl font-bold text-black">AntVenture</div>
            </div>
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