import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import config from '../config';

const Navigation: React.FC = () => {
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState(false);
    
    useEffect(() => {
        checkAdminStatus();
    }, []);

    const checkAdminStatus = async () => {
        try {
            const response = await fetch(`${config.API_URL}/api/users/checkAdmin`, {
                credentials: 'include'
            });
            setIsAdmin(response.ok);
        } catch (err) {
            console.error('Admin check failed:', err);
            setIsAdmin(false);
        }
    };

    // Helper to determine if a link is active
    const isActive = (path: string) => location.pathname === path;
    
    const navLinks = [
        { to: "/", label: "HOMEPAGE" },
        // { to: "/performance", label: "PERFORMANCE" },
        //{ to: "/review", label: "REVIEW" },
        { to: "/about-us", label: "ABOUT US" },
        { to: "/feedback", label: "FEEDBACK" },
    ];    
    // Add admin management links
    if (isAdmin) {
        navLinks.push({ to: "/manage-questions", label: "MANAGE QUESTIONS" });
        navLinks.push({ to: "/manage-provinces", label: "MANAGE PROVINCES" });
    }
    
    return (
        <nav className="flex-1 flex justify-center py-2">
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
                {navLinks.map((link) => (
                    <Link 
                        key={link.to}
                        to={link.to} 
                        className={`px-4 py-2 text-lg font-medium rounded-md transition-all duration-200
                            ${isActive(link.to)
                                ? "bg-yellow-300/40 text-white font-bold" 
                                : "text-white/90 hover:bg-white/10 hover:text-sky-300 hover:-translate-y-0.5"
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