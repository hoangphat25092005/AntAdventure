import React from 'react';
import Logo from '../assets/Logo.png'; 

const Footer: React.FC<{ className?: string }> = ({ className }) => {
    return (        <footer className={`bg-orange-500 py-2 w-full ${className}`}>
            <div className="container mx-auto px-8">
                <div className="flex justify-between items-center h-8">
                    <div className="flex items-center">
                        <img 
                            src={Logo} 
                            alt="AntVenture Logo" 
                            className="h-8 w-8 mr-2" 
                        />
                        <div className="text-xl font-bold text-black">AntVenture</div>
                    </div>
                    <div className="flex justify-end space-x-12">
                        <div className="flex items-center">
                            <span className="text-sm text-black mr-4">Policy</span>
                            <span className="text-sm text-black mx-4">About Us</span>
                            <span className="text-sm text-black ml-4">Contact</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-black text-sm">Information</h4>
                            <ul className="text-black text-xs space-y-0.5">
                                <li>About Us</li>
                                <li>FAQ</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-black mb-2">Contact</h4>
                            
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;