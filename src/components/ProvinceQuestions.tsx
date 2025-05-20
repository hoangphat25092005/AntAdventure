import React from 'react';
import { provinces } from '../data/provinceData';

interface Question {
    _id?: string;
    provinceName: string;
    question: string;
    options: string[];
    correctAnswer: number;
    image?: string;
}

interface ProvinceQuestionsProps {
    questions: Question[];
    onEditQuestion: (question: Question) => void;
    onDeleteQuestion: (id: string) => void;
}

const ProvinceQuestions: React.FC<ProvinceQuestionsProps> = ({ questions, onEditQuestion, onDeleteQuestion }) => {
    const provinceNames = Array.from(new Set(questions.map(q => q.provinceName))).sort();

    return (
        <div className="space-y-8">
            {provinceNames.map(provinceName => {
                const provinceQuestions = questions.filter(q => q.provinceName === provinceName);
                const province = provinces.find(p => p.name === provinceName);
                
                return (
                    <div key={provinceName} className="border rounded-lg p-4 bg-white shadow">
                        <div className="flex justify-between items-center bg-orange-100 p-3 rounded-lg mb-4">
                            <h3 className="text-lg font-semibold">
                                {province?.name || provinceName}
                            </h3>
                            <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                                {provinceQuestions.length} questions
                            </span>
                        </div>
                        
                        <div className="space-y-4">
                            {provinceQuestions.map((question, index) => (
                                <div 
                                    key={question._id} 
                                    className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex justify-between">
                                        <div className="flex-grow">
                                            <div className="font-medium text-gray-700 mb-2">
                                                Question {index + 1}: {question.question}
                                            </div>
                                            <div className="space-y-1 ml-4">
                                                {question.options.map((option, optIndex) => (
                                                    <div 
                                                        key={optIndex}
                                                        className={`${
                                                            optIndex === question.correctAnswer 
                                                                ? 'text-green-600 font-medium' 
                                                                : 'text-gray-600'
                                                        }`}
                                                    >
                                                        {String.fromCharCode(65 + optIndex)}. {option}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="flex space-x-2 ml-4">
                                            <button
                                                onClick={() => onEditQuestion(question)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => question._id && onDeleteQuestion(question._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {question.image && (
                                        <div className="mt-3">
                                            <img 
                                                src={question.image} 
                                                alt="Question visual" 
                                                className="h-24 object-cover rounded"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProvinceQuestions;
