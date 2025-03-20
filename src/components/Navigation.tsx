import React from 'react';
import { Link } from 'react-router-dom';

const Navigation: React.FC = () => {
    return (
        <nav className="flex-1 flex justify-center">
            <div className="flex space-x-8">
                <Link to="/" className="text-white text-lg hover:text-gray-200">HOMEPAGE</Link>
                <Link to="/performance" className="text-white text-lg hover:text-gray-200">PERFORMANCE</Link>
                <Link to="/review" className="text-white text-lg hover:text-gray-200">REVIEW</Link>
                <Link to="/about-us" className="text-white text-lg hover:text-gray-200">ABOUT US</Link>
            </div>
        </nav>
    );
};

export default Navigation;