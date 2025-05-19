import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
    const location = useLocation();
    
    // Helper to determine if a link is active
    const isActive = (path: string) => location.pathname === path;
    
    return (
        <nav className="flex-1 flex justify-center py-2">
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
                {[
                    { to: "/", label: "HOMEPAGE" },
                    { to: "/performance", label: "PERFORMANCE" },
                    { to: "/review", label: "REVIEW" },
                    { to: "/about-us", label: "ABOUT US" },
                    { to: "/feedback", label: "FEEDBACK" },
                ].map((link) => (
                    <Link 
                        key={link.to}
                        to={link.to} 
                        className={`px-4 py-2 text-lg font-medium rounded-md transition-colors 
                            ${isActive(link.to)
                                ? "bg-yellow-300/40 text-white font-bold" 
                                : "text-white/90 hover:bg-white/10 hover:text-white"
                            }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
};

export default Navigation;