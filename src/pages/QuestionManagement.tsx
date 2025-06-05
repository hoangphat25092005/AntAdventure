import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { provinces } from '../data/provinceData';
import config from '../config';

interface Question {
    _id?: string;
    provinceName: string;
    question: string;
    options: string[];
    correctAnswer: number;
    image?: string;
}

const QuestionManager: React.FC = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [formData, setFormData] = useState<Question>({
        provinceName: '',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');
    const [error, setError] = useState('');
    const [questionListSearchTerm, setQuestionListSearchTerm] = useState('');

    useEffect(() => {
        checkAdminStatus();
        fetchQuestions();
    }, []);

    const checkAdminStatus = async () => {
        try {
            const response = await fetch(`${config.API_URL}/api/users/checkAdmin`, {
                credentials: 'include'
            });
            if (response.ok) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
                navigate('/'); // Redirect non-admin users
            }
        } catch (err) {
            console.error('Admin check failed:', err);
            navigate('/');
        }
    };    const fetchQuestions = async () => {
        try {
            const response = await fetch(`${config.API_URL}/api/questions/getAllQuestions`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                // Sort questions by province name for consistent display
                const sortedData = data.sort((a: Question, b: Question) => 
                    a.provinceName.localeCompare(b.provinceName, 'vi')
                );
                setQuestions(sortedData);
                console.log('Fetched questions:', sortedData); // Debug log
            } else {
                const errorData = await response.json();
                console.error('Failed to fetch questions:', errorData);
                setError(errorData.message || 'Failed to fetch questions');
            }
        } catch (err) {
            console.error('Error fetching questions:', err);
            setError('Failed to fetch questions');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData(prev => ({
            ...prev,
            options: newOptions
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAdmin) return;

        try {
            // Ensure the province name is selected from the dropdown
            if (!formData.provinceName) {
                setError('Please select a province');
                return;
            }

            const formDataToSend = new FormData();
            // Use the exact province name from the provinces data to ensure consistency
            const selectedProvince = provinces.find(p => p.name === formData.provinceName);
            if (!selectedProvince) {
                setError('Invalid province selected');
                return;
            }

            formDataToSend.append('provinceName', selectedProvince.name);
            formDataToSend.append('question', formData.question.trim());
            formDataToSend.append('options', JSON.stringify(formData.options.map(opt => opt.trim())));
            formDataToSend.append('correctAnswer', formData.correctAnswer.toString());

            if (selectedFile) {
                formDataToSend.append('image', selectedFile);
            }            // Log form data contents for debugging
            console.log('Form data preview:', {
                provinceName: formData.provinceName,
                question: formData.question,
                options: formData.options,
                correctAnswer: formData.correctAnswer,
                hasImage: !!selectedFile
            });
            const url = editMode
                ? `${config.API_URL}/api/questions/updateQuestion/${selectedQuestionId}`
                : `${config.API_URL}/api/questions/addQuestion`;

            const response = await fetch(url, {
                method: editMode ? 'PUT' : 'POST',
                credentials: 'include',
                body: formDataToSend
            });            if (response.ok) {
                console.log('Question saved successfully');
                fetchQuestions();
                resetForm();
            } else {
                const data = await response.json();
                console.error('Server error response:', data);
                setError(data.message || 'Failed to save question');
            }
        } catch (err) {
            console.error('Error saving question:', err);
            setError('Failed to save question');
        }
    };

     const handleEdit = (question: Question) => {
        setFormData({
        provinceName: question.provinceName,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer
    });
    setSelectedQuestionId(question._id || '');
    setEditMode(true);
    
    // Scroll to the top of the form for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;

        try {
            const response = await fetch(`${config.API_URL}/api/questions/deleteQuestion/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                await fetchQuestions();
                // Scroll to top after deleting
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            console.error('Error deleting question:', err);
        }
    };

    const resetForm = () => {
        setFormData({
            provinceName: '',
            question: '',
            options: ['', '', '', ''],
            correctAnswer: 0
        });
        setSelectedFile(null);
        setEditMode(false);
        setSelectedQuestionId('');
        setError('');
    };

    const handleQuestionListSearch = (value: string) => {
        setQuestionListSearchTerm(value);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Filter provinces based on search term
    const filteredProvinces = provinces.filter(province =>
        province.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter questions list based on search term
    const filteredQuestionsByProvince = Array.from(new Set(questions.map(q => q.provinceName)))
        .filter((provinceName: string) => 
            provinceName.toLowerCase().includes(questionListSearchTerm.toLowerCase())
        )
        .sort((a: string, b: string) => a.localeCompare(b, 'vi-VN'));

    if (!isAdmin) {
        return <div>Access denied</div>;
    }    return (
        <div className="min-h-screen p-8 bg-cyan-500">
            <div className="max-w-6xl p-6 mx-auto bg-white rounded-lg shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold">
                        {editMode ? 'Edit Question' : 'Add New Question'}
                    </h2>
                    <div className="relative">
                        <div className="flex items-center overflow-hidden border rounded-lg">
                            <input
                                type="text"
                                placeholder="Search province..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setIsDropdownOpen(true);
                                }}
                                onFocus={() => setIsDropdownOpen(true)}
                                className="w-64 p-2 focus:outline-none"
                            />
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="p-2 text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                                </svg>
                            </button>
                        </div>
                        {isDropdownOpen && (
                            <div className="absolute z-10 w-full mt-1 overflow-y-auto bg-white border rounded-lg shadow-lg max-h-60">
                                {filteredProvinces.length > 0 ? (
                                    filteredProvinces
                                        .sort((a, b) => a.name.localeCompare(b.name, 'vi-VN'))
                                        .map(province => (
                                            <button
                                                key={province.id}
                                                className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, provinceName: province.name }));
                                                    setSearchTerm(province.name);
                                                    setIsDropdownOpen(false);
                                                    // Add smooth scroll to top
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                            >
                                                {province.name}
                                            </button>
                                        ))
                                ) : (
                                    <div className="px-4 py-2 text-gray-500">No provinces found</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mb-4 text-red-500">{error}</div>
                )}

                {/* Question Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Province Name Input */}
                    <div>
                        <label className="block mb-2">Province Name:</label>
                        <input
                            type="text"
                            name="provinceName"
                            value={formData.provinceName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    {/* Question Input */}
                    <div>
                        <label className="block mb-2">Question:</label>
                        <input
                            type="text"
                            name="question"
                            value={formData.question}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    {/* Options Input */}
                    <div>
                        <label className="block mb-2">Options:</label>
                        {formData.options.map((option, index) => (
                            <div key={index} className="mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="inline-block w-6 h-6 leading-6 text-center bg-gray-100 rounded-full">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        className="flex-1 p-2 border rounded"
                                        placeholder={`Option ${index + 1}`}
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Correct Answer Input */}
                    <div>
                        <label className="block mb-2">Correct Answer:</label>
                        <div className="flex gap-4">
                            {formData.options.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, correctAnswer: index }))}
                                    className={`flex-1 p-2 rounded-lg border-2 transition-colors ${
                                        index === formData.correctAnswer
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                >
                                    Option {String.fromCharCode(65 + index)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image Input */}
                    <div>
                        <label className="block mb-2">Image:</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full p-2"
                            accept="image/*"
                        />
                    </div>

                    {/* Form Buttons */}
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="px-4 py-2 text-white transition-colors bg-blue-500 rounded hover:bg-blue-600"
                        >
                            {editMode ? 'Update Question' : 'Add Question'}
                        </button>
                        {editMode && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 text-white transition-colors bg-gray-500 rounded hover:bg-gray-600"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>

                {/* Questions List */}
                <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold">Questions by Province</h3>
                        <div className="relative">
                            <div className="flex items-center">                                <input
                                    type="text"
                                    placeholder="Search provinces in list..."
                                    value={questionListSearchTerm}
                                    onChange={(e) => handleQuestionListSearch(e.target.value)}
                                    className="w-64 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                                {questionListSearchTerm && (
                                    <button
                                        onClick={() => {
                                            setQuestionListSearchTerm('');
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className="absolute text-gray-500 right-3 hover:text-gray-700"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        {filteredQuestionsByProvince.map(provinceName => (
                            <div key={provinceName} className="p-4 border rounded-lg">
                                <h4 className="p-2 mb-3 text-lg font-semibold bg-orange-100 rounded">
                                    Province: {provinceName}
                                </h4>
                                <div className="space-y-4">
                                    {questions
                                        .filter(q => q.provinceName === provinceName)
                                        .map((question) => (
                                            <div key={question._id} className="p-4 transition-colors border rounded-lg bg-gray-50 hover:bg-gray-100">
                                                <div className="flex justify-between">
                                                    <div className="flex-grow">
                                                        <h4 className="mb-2 text-lg font-bold">{question.question}</h4>
                                                        <div className="ml-4 space-y-2">
                                                            {question.options.map((option, index) => (
                                                                <p
                                                                    key={index}
                                                                    className={`${
                                                                        index === question.correctAnswer ? 'text-green-600 font-medium' : 'text-gray-600'
                                                                    } flex items-center gap-2`}
                                                                >
                                                                    <span className={`inline-block w-6 h-6 text-center leading-6 rounded-full 
                                                                        ${index === question.correctAnswer ? 'bg-green-100' : 'bg-gray-100'}`}
                                                                    >
                                                                        {String.fromCharCode(65 + index)}
                                                                    </span>
                                                                    {option}
                                                                </p>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {question.image && (
                                                        <div className="flex-shrink-0 ml-4">
                                                            <img
                                                                src={`${config.API_URL}${question.image}`}
                                                                alt="Question visual"
                                                                className="object-cover w-32 h-32 rounded-lg"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex mt-4 space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(question)}
                                                        className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-yellow-500 rounded-lg hover:bg-yellow-600"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => question._id && handleDelete(question._id)}
                                                        className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ))}
                        {filteredQuestionsByProvince.length === 0 && (
                            <div className="p-4 text-center text-gray-500">
                                No provinces found matching your search
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionManager;
