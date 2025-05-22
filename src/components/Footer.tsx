import React from 'react';
import Logo from '../assets/Logo.png'; 

const Footer: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <footer className={`bg-orange-500 py-6 w-full ${className}`}>
            <div className="container mx-auto px-8">
                <div className="flex overflow-hidden">
                    {/* Left side - Logo and name */}
                    <div className="flex-shrink-0 mr-60">
                        <div className="flex items-center">
                            <img 
                                src={Logo} 
                                alt="AntVenture Logo" 
                                className="h-12 w-12 mr-2" 
                            />
                            <div className="text-2xl font-bold text-black whitespace-nowrap">AntVenture</div>
                        </div>
                    </div>
                    
                    {/* Policy column */}
                    <div className="flex-shrink-0 mx-16">
                        <h3 className="text-lg font-bold text-black mb-2 whitespace-nowrap">Policy</h3>
                        <ul className="text-black">
                            <li className="whitespace-nowrap">Policy #1</li>
                            <li className="whitespace-nowrap">Policy #2</li>
                        </ul>
                    </div>
                    
                    {/* Information column */}
                    <div className="flex-shrink-0 mx-16">
                        <h3 className="text-lg font-bold text-black mb-2 whitespace-nowrap">Information</h3>
                        <ul className="text-black">
                            <li className="whitespace-nowrap">We are members of UIT</li>
                            <li className="whitespace-nowrap">This is our second-term project</li>
                        </ul>
                    </div>
                    
                    {/* Contact column */}
                    <div className="flex-shrink-0 mx-16">
                        <h3 className="text-lg font-bold text-black mb-2 whitespace-nowrap">Contact</h3>
                        <ul className="text-black">
                            <li className="whitespace-nowrap">abc@xyz.com</li>
                            <li className="whitespace-nowrap">02812345789</li>
                        </ul>
                    </div>
                    
                    {/* Sponsor column */}
                    <div className="flex-shrink-0 ml-16">
                        <h3 className="text-lg font-bold text-black mb-2 whitespace-nowrap">Sponsor</h3>
                        <ul className="text-black">
                            <li className="whitespace-nowrap">UIT</li>
                            <li className="whitespace-nowrap">CS - UIT</li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;