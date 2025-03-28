import React from 'react';
import { useNavigate } from 'react-router-dom';

const FeedBackForm: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-cyan-500">
            <form className="bg-sky-100 p-8 rounded-[20px] w-full max-w-4xl ">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-xl font-bold">Feedback</p>
                    <button 
                        type="submit"
                        className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-sky-600 transition-colors"
                    >
                        SEND
                    </button>
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        id="name"
                        className="bg-white border border-gray-300 p-3 w-full rounded-md"
                        placeholder="Name"
                    />
                </div>
                <div className="mb-4">
                    <textarea
                        id="feedback"
                        className="bg-white border border-gray-300 p-3 w-full rounded-md min-h-[200px] resize-y"
                        placeholder="Feedback"
                    />
                </div>
            </form>
        </div>
    );
};

export default FeedBackForm;