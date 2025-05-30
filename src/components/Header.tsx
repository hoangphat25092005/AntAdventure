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
    avatar?: string;
}

const Header: React.FC<{ className?: string }> = ({ className }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, right: 0 });    // Initialize user data from localStorage
    useEffect(() => {
        const storedUserInfo = localStorage.getItem('userInfo');
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo));
            setIsAuthenticated(true);
        }
    }, []);

    useEffect(() => {
        checkAuth();
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

    useEffect(() => {
        if (isDropdownOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                right: window.innerWidth - rect.right
            });
        }
    }, [isDropdownOpen]);    const checkAuth = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/users/check-auth', {
                credentials: 'include'
            });
            if (response.ok) {
                setIsAuthenticated(true);
                const userResponse = await fetch('http://localhost:3001/api/users/me', {
                    credentials: 'include'
                });
                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    // Store the user data in localStorage for persistence
                    localStorage.setItem('userInfo', JSON.stringify(userData));
                    setUserInfo(userData);
                } else {
                    // Try to get user data from localStorage if fetch fails
                    const storedUserInfo = localStorage.getItem('userInfo');
                    if (storedUserInfo) {
                        setUserInfo(JSON.parse(storedUserInfo));
                    }
                }
            } else {
                setIsAuthenticated(false);
                setUserInfo(null);
                localStorage.removeItem('userInfo');
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            // Try to get user data from localStorage if fetch fails
            const storedUserInfo = localStorage.getItem('userInfo');
            if (storedUserInfo) {
                setUserInfo(JSON.parse(storedUserInfo));
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setUserInfo(null);
            }
        }
    };    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/users/logout', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                setIsAuthenticated(false);
                setUserInfo(null);
                setIsDropdownOpen(false);
                // Clear user data from localStorage
                localStorage.removeItem('userInfo');
                navigate('/');
            }
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file size
        if (file.size > 2 * 1024 * 1024) { // 2MB
            alert('File size must be less than 2MB');
            return;
        }

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert('File must be an image (JPEG, PNG, or GIF)');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await fetch('http://localhost:3001/api/users/update-avatar', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });            if (response.ok) {
                const data = await response.json();
                console.log('Avatar update response:', data);
                const updatedUserInfo = prev => {
                    if (!prev) return null;
                    const newInfo = { ...prev, avatar: data.avatar };
                    // Update localStorage with new avatar
                    localStorage.setItem('userInfo', JSON.stringify(newInfo));
                    return newInfo;
                };
                setUserInfo(updatedUserInfo);
                setIsDropdownOpen(false);
            } else {
                const errorData = await response.json();
                console.error('Avatar upload failed:', errorData);
                alert(errorData.message || 'Failed to update avatar');
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
            alert('Error uploading avatar. Please try again.');
        }
    };

    return (        
        <header className={`bg-orange-500 flex justify-between items-center py-2 px-8 w-full whitespace-nowrap border-b-2 border-gray-700 shadow-lg ${className}`}>
            <div className="flex items-center flex-shrink-0">
                <div className="logo-container">
                    <img 
                        src={Logo} 
                        alt="AntVenture Logo" 
                        className="w-10 h-10 mr-2 logo-image ant-walking logo-hover-shake" 
                    />
                </div>
                <div className="text-xl font-bold text-black">AntVenture</div>
            </div>
            
            <div className="flex-shrink-0 mx-4 overflow-hidden">
                <Navigation />
            </div>
            
            <div className="flex items-center flex-shrink-0 gap-4">
                {isAuthenticated ? (
                    <div className="relative">
                        {/* Hidden file input for avatar upload */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="hidden"
                        />                          <button
                            ref={buttonRef}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center px-4 py-2 space-x-2 text-white transition-colors duration-200 rounded-lg bg-sky-600 hover:bg-sky-700"
                        >                            {userInfo?.avatar ? (                                <img 
                                    src={`http://localhost:3001${userInfo.avatar}`}
                                    alt="User avatar"
                                    title="Click to view full size image"
                                    className="object-cover w-12 h-12 transition-transform rounded-full cursor-pointer hover:scale-105"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(`http://localhost:3001${userInfo.avatar}`, '_blank');
                                    }}
                                />
                            ) : (
                                <div className="flex items-center justify-center w-12 h-12 text-xl font-bold rounded-full text-sky-700 bg-sky-200">
                                    {userInfo?.username.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="hidden sm:inline">{userInfo?.username}</span>
                            <svg
                                className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>                        {/* Dropdown menu using portal */}
                        {isDropdownOpen && createPortal(                            <div 
                                className="fixed z-[9999] w-48 py-2 bg-white rounded-lg overflow-hidden shadow-xl dropdown-menu"
                                style={{
                                    top: `${dropdownPosition.top}px`,
                                    right: `${dropdownPosition.right}px`,
                                }}
                            >
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-gray-900">{userInfo?.username}</p>
                                    <p className="text-sm text-gray-500">{userInfo?.email}</p>
                                </div>

                                {/* Avatar update button */}
                                <button
                                    onClick={handleAvatarClick}
                                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-sky-50"
                                >
                                    Update Avatar
                                </button>
                                
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
                    <div className="flex flex-shrink-0 gap-2">
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
