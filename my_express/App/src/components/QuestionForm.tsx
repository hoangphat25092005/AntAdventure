import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuestionForm: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-cyan-500">
            <form className="bg-white p-8 rounded-[20px] w-full border-8 border-sky-300">
                <h2 className=" text-2xl font-bold mb-6 text-center">Enter new question</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        id="provinceName"
                        className="bg-gray-100 border border-gray-300 p-3 w-full rounded-md"
                        placeholder="Province"
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="text"
                        id="questionText"
                        className="bg-gray-100 border border-gray-300 p-3 w-full rounded-md"
                        placeholder="Question"
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="text"
                        id="options"
                        className="bg-gray-100 border border-gray-300 p-3 w-full rounded-md"
                        placeholder="Put in options in ABCD format"
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="text"
                        id="correctAnswer"
                        className="bg-gray-100 border border-gray-300 p-3 w-full rounded-md"
                        placeholder="Which option is correct?"
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="text"
                        id="explaination"
                        className="bg-gray-100 border border-gray-300 p-3 w-full rounded-md"
                        placeholder="Explaination"
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="text"
                        id="image"
                        className="bg-gray-100 border border-gray-300 p-3 w-full rounded-md"
                        placeholder="Online image url"
                    />
                </div>
                <button
                    type="submit"
                    className=" bg-green-700 text-xl text-white p-3 rounded-md w-full hover:bg-green-600 transition-colors"
                >
                    SUBMIT
                </button>

            </form>
        </div>
    );
};

export default QuestionForm;