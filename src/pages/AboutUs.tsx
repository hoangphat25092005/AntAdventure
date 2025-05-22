import React from 'react';
import CopperDrumImage from '../assets/CopperDrum.png';
import Maplong from '../assets/Maplong.jpg';
const AboutUs: React.FC = () => {
    return (
        <div className="min-h-screen w-full relative">
            <div className="absolute inset-0 bg-cyan-500 opacity-100 z-0"></div>
            
            <div className="absolute inset-0 z-10 flex items-center justify-center">
                <img 
                    src={CopperDrumImage} 
                    alt="Copper Drum" 
                    className="w-full h-full object-contain opacity-70"
                />
            </div>
            
            <div className="container mx-auto px-4 py-12 relative z-20">
                <div className="bg-sky-200 rounded-3xl p-10 shadow-lg max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-10">
                        <div className="md:w-2/3">
                            <h1 className="text-5xl font-bold mb-8 text-slate-900">About us</h1>
                            
                            <p className="text-3xl leading-relaxed text-slate-800 mb-6">
                                AntVenture is an educational project which is designed by us, students of UIT, 
                                to teach students culture and geography of Viet Nam. We use modern models of 
                                teaching methods like quizzes, flash card to enhance students' efficiency in 
                                studying and revising their works.
                            </p>
                        </div>
                        
                        <div className="md:w-1/3 flex flex-col items-center gap-8">
                           
                            {/* <div className="h-32 w-full flex justify-center"> 
                                
                            </div>*/}
                            
                            
                            <div className="h-full w-full flex justify-center">
                                <img 
                                    src={Maplong} 
                                    alt="Maplong" 
                                    className="w-full h-full object-cover shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;