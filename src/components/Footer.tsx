import React from 'react';
import Logo from '../assets/Logo.png'; 

const Footer: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <footer className={`bg-orange-500 py-5 w-full ${className}`}>
            <div className="container mx-auto px-20">
                <div className="flex justify-between items-start">
                    <div className="flex items-center">
                        <img 
                            src={Logo} 
                            alt="AntVenture Logo" 
                            className="h-20 w-20 mr-2" 
                        />
                        <div className="text-3xl font-bold text-black">AntVenture</div>
                    </div>
                    <div className="flex-1 flex justify-evenly ml-20">
                        <div>
                            <h4 className="font-semibold text-black mb-2">Policy</h4>
                            <ul className="text-black space-y-1">
                                <li>Privacy Policy</li>
                                <li>Terms of Service</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-black mb-2">Information</h4>
                            <ul className="text-black space-y-1">
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