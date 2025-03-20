import React from 'react';

const AboutUs: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-4">About Us</h1>
            <p className="text-lg text-center max-w-2xl">
                Welcome to our website! We are dedicated to providing the best service possible. Our team is committed to excellence and we strive to meet your needs.
            </p>
        </div>
    );
};

export default AboutUs;