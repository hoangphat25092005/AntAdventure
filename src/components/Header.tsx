import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import Logo from '../assets/Logo.png';

const Header: React.FC<{ className?: string }> = ({ className }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/users/check-auth', {
                credentials: 'include'
            });
            setIsAuthenticated(response.ok);
        } catch (err) {
            console.error('Auth check failed:', err);
            setIsAuthenticated(false);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/users/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                setIsAuthenticated(false);
                navigate('/');
            }
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (        <header className={`bg-orange-500 flex justify-between items-center py-2 px-8 w-full ${className}`}>
            <div className="flex items-center">
                <img 
                    src={Logo} 
                    alt="AntVenture Logo" 
                    className="h-8 w-8 mr-2" 
                />
                <div className="text-xl font-bold text-black">AntVenture</div>
            </div>
            <Navigation />            <div className="flex items-center gap-4">
                {isAuthenticated ? (
                    <button 
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition-colors"
                    >
                        LOGOUT
                    </button>
                ) : (
                    <>
                        <button 
                            onClick={() => navigate('/login')}
                            className="bg-white px-6 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            LOGIN
                        </button>
                        <button 
                            onClick={() => navigate('/admin-login')}
                            className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-colors"
                        >
                            ADMIN
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;