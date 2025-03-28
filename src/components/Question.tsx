import React from 'react';
import { useNavigate } from 'react-router-dom';
import vt from '../assets/vt.jpg';

const QuestionTem: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center min-h-[calc(100vh-128px)] bg-cyan-500">
            <form className="w-full h-full p-8">
                <div className="bg-sky-100 p-8 pb-10 mx-6 rounded-[30px] mx-auto my-2 border-4 border-sky-300 flex flex-col">
                    <div className="text-left mb-4">
                        <h3 className="text-xl font-semibold">Which beach is this?</h3>
                    </div>
                    <div className="flex-grow flex items-center justify-center">
                        <img 
                            src={vt} 
                            alt="Vung Tau" 
                            className="rounded-[20px] max-w-[480px] max-h-[360px] object-contain"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default QuestionTem;