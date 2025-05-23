import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import Navigation from './Navigation';
import Logo from '../assets/Logo.png';
import './LogoAnimation.css';

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
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, right: 0 });

    useEffect(() => {
        checkAuth();

        // Close dropdown when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (
                buttonRef.current && 
                !buttonRef.current.contains(event.target as Node) &&
                !(event.target as Element).closest('.dropdown-menu')
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update dropdown position when it opens
    useEffect(() => {
        if (isDropdownOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                right: window.innerWidth - rect.right
            });
        }
    }, [isDropdownOpen]);

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
        <header className={`bg-orange-500 flex justify-between items-center py-2 px-8 w-full whitespace-nowrap border-b-2 border-gray-700 shadow-lg ${className}`}>            <div className="flex-shrink-0 flex items-center"><div className="logo-container">
                    <img 
                        src={Logo} 
                        alt="AntVenture Logo" 
                        className="w-10 h-10 mr-2 logo-image ant-walking logo-hover-shake" 
                    />
                </div>
                <div className="text-xl font-bold text-black">AntVenture</div>
            </div>
            
            <div className="flex-shrink-0 overflow-hidden mx-4">
                <Navigation />
            </div>
            
            <div className="flex-shrink-0 flex items-center gap-4">
                {isAuthenticated ? (
                    <div className="relative">                        
                        <button
                            ref={buttonRef}
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

                        {/* Dropdown menu using portal */}
                        {isDropdownOpen && createPortal(
                            <div 
                                className="fixed z-[9999] w-48 py-2 bg-white rounded-lg shadow-xl dropdown-menu"
                                style={{
                                    top: `${dropdownPosition.top}px`,
                                    right: `${dropdownPosition.right}px`,
                                }}
                            >
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{userInfo?.username}</p>
                                    <p className="text-sm text-gray-500">{userInfo?.email}</p>
                                </div>                                
                                {userInfo?.isAdmin && (
                                    <>
                                        <button
                                            onClick={() => {
                                                navigate('/manage-questions');
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-sky-50"
                                        >
                                            Manage Questions
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate('/manage-provinces');
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-sky-50"
                                        >
                                            Manage Provinces
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => {
                                        navigate('/performance');
                                        setIsDropdownOpen(false);
                                    }}
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
                            </div>,
                            document.body
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