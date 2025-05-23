import React from 'react';
import Logo from '../assets/Logo.png';
import './LogoAnimation.css';

const Footer: React.FC<{ className?: string }> = ({ className }) => {    return (        <footer className={`bg-orange-500 py-2 px-8 w-full border-t-2 border-gray-700 shadow-lg ${className}`}>
            <div className="container mx-auto">
                <div className="flex justify-between items-center">
                    {/* Left side - Logo and name */}                    <div className="w-full md:w-auto flex-shrink-0 mb-3 md:mb-0">                        <div className="flex items-center">                <div className="logo-container">
                    <img 
                        src={Logo} 
                        alt="AntVenture Logo" 
                        className="w-10 h-10 mr-2 logo-image ant-walking logo-hover-grow" 
                    />
                </div>
                            <div className="text-xl font-bold text-black">AntVenture</div>
                        </div>
                    </div>
                      {/* Center navigation-style links */}
                    <div className="flex-1 flex justify-center py-2">
                        <div className="flex flex-wrap gap-x-12 md:gap-x-16 lg:gap-x-24 gap-y-4 justify-center">
                            {/* Policy column */}
                            <div className="text-center px-2 md:px-4">
                                <h3 className="text-sm font-bold text-black">Policy</h3>
                                <ul className="text-black text-sm space-y-0.5">
                                    <li>Policy #1</li>
                                    <li>Policy #2</li>
                                </ul>
                            </div>                              
                            {/* Information column */}
                            <div className="text-center px-2 md:px-4">
                                <h3 className="text-sm font-bold text-black">Information</h3>
                                <ul className="text-black text-sm space-y-0.5">
                                    <li>We are members of UIT</li>
                                    <li>This is our second-term project</li>
                                </ul>
                            </div>
                            
                            {/* Contact column */}
                            <div className="text-center px-2 md:px-4">
                                <h3 className="text-sm font-bold text-black">Contact</h3>
                                <ul className="text-black text-sm space-y-0.5">
                                    <li>abc@xyz.com</li>
                                    <li>02812345789</li>
                                </ul>
                            </div>
                            
                            {/* Sponsor column */}
                            <div className="text-center px-2 md:px-4">
                                <h3 className="text-sm font-bold text-black">Sponsor</h3>
                                <ul className="text-black text-sm space-y-0.5">
                                    <li>UIT</li>
                                    <li>CS - UIT</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                      {/* Placeholder div to balance the layout */}
                    <div className="w-full md:w-auto flex-shrink-0 hidden md:block"></div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;