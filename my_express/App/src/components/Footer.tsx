import React from 'react';

const Footer: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <footer className={`bg-orange-500 py-5 w-full ${className}`}>
            <div className="container mx-auto px-20">
                <div className="flex justify-between items-start">
                    <div className="text-2xl font-bold text-black">AntVenture</div>
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
                            <ul className="text-black space-y-1">
                                <li>Email Us</li>
                                <li>Support</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-black mb-2">Sponsor</h4>
                            <ul className="text-black space-y-1">
                                <li>Our Sponsors</li>
                                <li>Become a Sponsor</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;