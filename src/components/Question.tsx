import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { provinces } from '../data/provinceData';
import config from '../config';

interface Question {
    _id: string;
    provinceName: string;
    question: string;
    options: string[];
    correctAnswer: number;
    image?: string;
}

interface QuestionProps {
    provinceName?: string;
}

const normalizeVietnamese = (str: string) => {
    return str
        .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
        .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
        .replace(/[ìíịỉĩ]/g, 'i')
        .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
        .replace(/[ùúụủũưừứựửữ]/g, 'u')
        .replace(/[ỳýỵỷỹ]/g, 'y')
        .replace(/đ/g, 'd');
};

const QuestionTem: React.FC<QuestionProps> = ({ provinceName = 'Unknown Province' }) => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
    const [totalQuestions, setTotalQuestions] = useState(0);

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!provinceName) {
                setError('Province name is required');
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {                // Check authentication first
                const authResponse = await fetch(`${config.API_URL}/api/users/check-auth`, {
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (!authResponse.ok) {
                    setError('Please login to continue');
                    navigate('/login');
                    return;
                }

                // If authenticated, proceed with fetching questions
                const decodedProvinceName = decodeURIComponent(provinceName.replace(/-/g, ' '));
                const provinceData = provinces.find(p => {
                    // Normalize both strings for comparison
                    const normalizedProvinceName = normalizeVietnamese(decodedProvinceName.toLowerCase());
                    const normalizedDataName = normalizeVietnamese(p.name.toLowerCase());
                    
                    // Compare with and without spaces
                    return normalizedDataName === normalizedProvinceName ||
                           normalizedDataName.replace(/\s+/g, '') === normalizedProvinceName.replace(/\s+/g, '');
                });

                if (!provinceData) {
                    console.error('Province not found:', decodedProvinceName);
                    console.log('Available provinces:', provinces.map(p => p.name));
                    setError(`Province "${decodedProvinceName}" not found`);
                    setIsLoading(false);
                    return;
                }

                console.log('Fetching questions for province:', provinceData.name); // Debug log
                
                const response = await fetch(
                    `${config.API_URL}/api/questions/getQuestionByProvince/${encodeURIComponent(provinceData.name)}`,
                    { credentials: 'include' }
                );
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Received data:', data); // Debug log
                    
                    if (data.questions && data.questions.length > 0) {
                        setQuestions(data.questions);
                        setCurrentQuestion(data.questions[0]);
                        setTotalQuestions(data.total);
                    } else {
                        setError(`No questions found for ${provinceData.name}`);
                    }
                } else {
                    if (response.status === 401) {
                        setError('Please login to continue');
                        navigate('/login');
                    } else {
                        const errorData = await response.json();
                        setError(errorData.message || 'Failed to fetch questions');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                setError('Failed to load questions. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuestions();
    }, [provinceName, navigate]);

    const handleAnswerClick = async (selectedOptionIndex: number) => {
        if (selectedAnswer !== null || !currentQuestion) return;
        
        setSelectedAnswer(selectedOptionIndex);
        const isCorrect = selectedOptionIndex === currentQuestion.correctAnswer;
        setIsAnswerCorrect(isCorrect);
        
        if (isCorrect) {
            setScore(score + 1);
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setCurrentQuestion(questions[currentQuestionIndex + 1]);
            setSelectedAnswer(null);
            setIsAnswerCorrect(null);
        } else {
            setShowScore(true);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-128px)] bg-cyan-500">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="text-center mt-4">Loading questions...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-128px)] bg-cyan-500">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
                    <div className="text-center">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Return to Map
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showScore) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-128px)] bg-cyan-500">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
                    <h2 className="text-2xl font-bold text-center mb-4">Quiz Complete!</h2>
                    <div className="text-center mb-6">
                        <p className="text-4xl font-bold text-orange-500 mb-2">{score} / {questions.length}</p>
                        <p className="text-gray-600">
                            You answered {score} out of {questions.length} questions correctly!
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            ({totalQuestions} total questions available for this province)
                        </p>
                    </div>
                    
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Return to Map
                        </button>
                        <button
                            onClick={() => {
                                setCurrentQuestionIndex(0);
                                setScore(0);
                                setShowScore(false);
                                setSelectedAnswer(null);
                                setIsAnswerCorrect(null);
                                if (questions.length > 0) {
                                    setCurrentQuestion(questions[0]);
                                }
                            }}
                            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-center min-h-[calc(100vh-128px)] bg-cyan-500">
            <div className="w-full h-full p-8">
                <div className="max-w-4xl mx-auto bg-white rounded-[25px] shadow-lg p-8 relative">
                    {/* Province name and progress */}
                    <div className="absolute top-[-3px] left-[-1px] bg-orange-500 text-white font-bold px-3 sm:px-4 md:px-6 py-2 rounded-[25px] shadow-lg border-[3px] border-orange-700 whitespace-nowrap overflow-hidden text-sm sm:text-base md:text-lg max-w-[90%] transition-all duration-300">
                        🏖️ {provinceName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </div>

                    {/* Progress indicator */}
                    <div className="absolute top-[-3px] right-[-1px] bg-blue-500 text-white font-bold px-4 py-2 rounded-[25px] shadow-lg border-[3px] border-blue-700">
                        Question {currentQuestionIndex + 1} / {questions.length}
                    </div>

                    {currentQuestion ? (
                        <>
                            <div className="text-center mb-4 mt-12">
                                <h3 className="text-xl font-semibold">{currentQuestion.question}</h3>
                            </div>

                            {/* Question Image */}
                            {currentQuestion.image && (
                                <div className="mb-6 flex justify-center">
                                    <img
                                        src={`${config.API_URL}${currentQuestion.image}`}
                                        alt="Question visual"
                                        className="max-h-48 object-contain rounded-lg shadow-md"
                                    />
                                </div>
                            )}

                            {/* Options */}
                            <div className="grid gap-4 mt-6">
                                {currentQuestion.options.map((option, index) => {
                                    let buttonClass = "p-4 rounded-lg text-left transition-all duration-200 border-2 ";
                                    
                                    if (selectedAnswer === null) {
                                        buttonClass += "hover:bg-orange-50 hover:border-orange-500 border-gray-200";
                                    } else if (index === currentQuestion.correctAnswer) {
                                        buttonClass += "bg-green-100 border-green-500";
                                    } else if (index === selectedAnswer) {
                                        buttonClass += "bg-red-100 border-red-500";
                                    } else {
                                        buttonClass += "border-gray-200 opacity-50";
                                    }

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleAnswerClick(index)}
                                            disabled={selectedAnswer !== null}
                                            className={buttonClass}
                                        >
                                            <span className="mr-3 font-semibold">{String.fromCharCode(65 + index)}.</span>
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Feedback message */}
                            {selectedAnswer !== null && (
                                <div className="mt-6 text-center">
                                    {isAnswerCorrect ? (
                                        <span className="text-green-500 font-semibold">Correct! Well done!</span>
                                    ) : (
                                        <span className="text-red-500 font-semibold">
                                            Incorrect. The correct answer is {String.fromCharCode(65 + currentQuestion.correctAnswer)}.
                                        </span>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center mt-12">
                            <p className="text-gray-500">No question available</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionTem;