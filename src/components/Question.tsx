import React from 'react';
import { useNavigate } from 'react-router-dom';
import vt from '../assets/vt.jpg';

const QuestionTem: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center min-h-[calc(100vh-128px)] bg-cyan-500">
            <form className="w-full h-full p-8">
              <div className="bg-opacity-30 bg-sky-100 p-8 pb-10 mx-6 rounded-[30px] mx-auto my-2 border-4 border-sky-300 flex flex-col relative">
                        {/* Thành phần hiển thị tên tỉnh */}
                        <div className="absolute top-[-3px] left-[-1px] bg-orange-500 text-white font-bold px-3 sm:px-4 md:px-6 py-2 rounded-[25px] shadow-lg border-[3px] border-orange-700 whitespace-nowrap overflow-hidden text-sm sm:text-base md:text-lg max-w-[90%] transition-all duration-300">
                                🏖️ Vung Tau Province
                        </div>


    

                    <div className="text-center mb-4">
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
                <div className="flex justify-center mt-10">
                    <div className='text-white text-bold p-16 px-24 mx-8 bg-red-600 rounded-[20px] '>
                        <button className="flex flex-col items-center justify-center">
                            <text>A.</text>
                            <text>Vung Tau</text>
                        </button>
                    </div>
                    <div className='text-white text-bold p-16 px-24 mx-8 bg-sky-500 rounded-[20px] '>
                        <button className="flex flex-col items-center justify-center">
                            <text>B.</text>
                            <text>Vung Tau</text>
                        </button>
                    </div>
                    <div className='text-white text-bold p-16 px-24 mx-8 bg-green-600 rounded-[20px] '>
                        <button className="flex flex-col items-center justify-center">
                            <text>C.</text>
                            <text>Vung Tau</text>
                        </button>
                    </div>
                    <div className='text-white text-bold p-16 px-24 mx-8 bg-yellow-400 rounded-[20px] '>
                        <button className="flex flex-col items-center justify-center">
                            <text>D.</text>
                            <text>Vung Tau</text>
                        </button>
                    </div>
                  |  </div>
         </form>
         </div>

    );
};

export default QuestionTem;