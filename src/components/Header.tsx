import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import Logo from '../assets/Logo.png';

interface UserInfo {
    username: string;
    email: string;
    isAdmin: boolean;
}

const Header: React.FC<{ className?: string }> = ({ className }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        checkAuth();

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const checkAuth = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/users/check-auth', {
                credentials: 'include'
            });
            if (response.ok) {
                setIsAuthenticated(true);
                // Fetch user info
                const userResponse = await fetch('http://localhost:3001/api/users/me', {
                    credentials: 'include'
                });
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUserInfo(userData);
                }
            } else {
                setIsAuthenticated(false);
                setUserInfo(null);
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            setIsAuthenticated(false);
            setUserInfo(null);
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
                setUserInfo(null);
                setIsDropdownOpen(false);
                navigate('/');
            }
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };    
    
    return (        
        <header className={`bg-orange-500 flex justify-between items-center py-2 px-8 w-full overflow-hidden whitespace-nowrap ${className}`}>
            <div className="flex-shrink-0 flex items-center">
                <img 
                    src={Logo} 
                    alt="AntVenture Logo" 
                    className="w-8 h-8 mr-2" 
                />
                <div className="text-xl font-bold text-black">AntVenture</div>
            </div>
            
            <div className="flex-shrink-0 overflow-hidden mx-4">
                <Navigation />
            </div>
            
            <div className="flex-shrink-0 flex items-center gap-4">
                {isAuthenticated ? (
                    <div className="relative" ref={dropdownRef}>                        
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center px-4 py-2 space-x-2 text-white transition-colors duration-200 rounded-lg bg-sky-600 hover:bg-sky-700"
                        >
                            <div className="flex items-center justify-center w-8 h-8 font-bold rounded-full text-sky-700 bg-sky-200">
                                {userInfo?.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="hidden sm:inline">{userInfo?.username}</span>
                            <svg
                                className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 z-50 w-48 py-2 mt-2 bg-white rounded-lg shadow-xl">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{userInfo?.username}</p>
                                    <p className="text-sm text-gray-500">{userInfo?.email}</p>
                                </div>                                
                                {userInfo?.isAdmin && (
                                    <>
                                        <button
                                            onClick={() => navigate('/manage-questions')}
                                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-sky-50"
                                        >
                                            Manage Questions
                                        </button>
                                        <button
                                            onClick={() => navigate('/manage-provinces')}
                                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-sky-50"
                                        >
                                            Manage Provinces
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => navigate('/performance')}
                                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-sky-50"
                                >
                                    My Performance
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>                
                ) : (                    
                    <div className="flex-shrink-0 flex gap-2">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-4 py-2 text-white transition-colors duration-200 bg-orange-600 rounded-lg hover:bg-orange-700"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-4 py-2 text-orange-600 transition-colors duration-200 bg-white rounded-lg hover:bg-orange-50"
                        >
                            Register
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;