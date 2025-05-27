import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { provinces } from '../data/provinceData';

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

    useEffect(() => {
        checkAdminStatus();
        fetchQuestions();
    }, []);

    const checkAdminStatus = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/users/checkAdmin', {
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
            const response = await fetch('http://localhost:3001/api/questions/getAllQuestions', {
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
            } else if (editMode) {
                // If editing and no new file selected, tell the server to keep the existing image
                formDataToSend.append('keepExistingImage', 'true');
            }            // Log form data contents for debugging
            console.log('Form data preview:', {
                provinceName: formData.provinceName,
                question: formData.question,
                options: formData.options,
                correctAnswer: formData.correctAnswer,
                hasImage: !!selectedFile
            });
            const url = editMode
                ? `http://localhost:3001/api/questions/updateQuestion/${selectedQuestionId}`
                : 'http://localhost:3001/api/questions/addQuestion';            console.log(`Submitting to ${url} with method ${editMode ? 'PUT' : 'POST'}`);
            
            const response = await fetch(url, {
                method: editMode ? 'PUT' : 'POST',
                credentials: 'include',
                body: formDataToSend
            });
            
            const data = await response.json();
            
            if (response.ok) {
                console.log('Question saved successfully:', data);
                fetchQuestions();
                resetForm();
            } else {
                console.error('Server error response:', data);
                setError(data.message || 'Failed to save question');
            }
        } catch (err) {
            console.error('Error saving question:', err);
            setError('Failed to save question');
        }
    };    const handleEdit = (question: Question) => {
        setFormData({
            provinceName: question.provinceName,
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer
        });
        setSelectedQuestionId(question._id || '');
        setEditMode(true);
        // Clear any previously selected file when editing
        setSelectedFile(null);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this question?')) return;

        try {            const response = await fetch(`http://localhost:3001/api/questions/deleteQuestion/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                fetchQuestions();
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

    if (!isAdmin) {
        return <div>Access denied</div>;
    }    return (
        <div className="min-h-screen bg-cyan-500 p-8">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
                {/* Header */}                <div className="mb-8 flex justify-between items-center">                    <h2 className="text-2xl font-bold">
                        {editMode ? 'Edit Question' : 'Add New Question'}
                    </h2>
                    <select
                        name="provinceName"
                        id="provinceName"
                        className="p-2 border rounded-lg"
                        onChange={(e) => {
                            const province = provinces.find(p => p.name === e.target.value);
                            if (province) {
                                setFormData(prev => ({ ...prev, provinceName: province.name }));
                            }
                        }}
                        value={formData.provinceName}
                    >
                        <option value="">Select Province</option>
                        {provinces
                            .sort((a, b) => a.name.localeCompare(b.name, 'vi-VN'))
                            .map(province => (
                                <option key={province.id} value={province.name}>
                                    {province.name}
                                </option>
                            ))
                        }
                    </select>
                </div>

                {error && (
                    <div className="mb-4 text-red-500">{error}</div>
                )}

                {/* Question Form */}
                <form onSubmit={handleSubmit} className="space-y-4">                    {/* Province Name is selected from the dropdown above, so this field is hidden */}
                    <div className="hidden">
                        <label className="block mb-2">Province Name:</label>
                        <input
                            type="text"
                            name="provinceName"
                            value={formData.provinceName}
                            readOnly
                            className="w-full p-2 border rounded bg-gray-100"
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
                                    <span className="inline-block w-6 h-6 text-center leading-6 rounded-full bg-gray-100">
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
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            {editMode ? 'Update Question' : 'Add Question'}
                        </button>
                        {editMode && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                            >
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>

                {/* Questions List */}                <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Questions by Province</h3>
                    <div className="space-y-6">
                        {Array.from(new Set(questions.map(q => q.provinceName)))
                            .sort((a, b) => a.localeCompare(b, 'vi-VN'))
                            .map(provinceName => (
                                <div key={provinceName} className="border rounded-lg p-4">
                                    <h4 className="text-lg font-semibold mb-3 bg-orange-100 p-2 rounded">
                                        Province: {provinceName}
                                    </h4>
                                    <div className="space-y-4">
                                        {questions
                                            .filter(q => q.provinceName === provinceName)
                                            .map((question) => (
                                                <div key={question._id} className="border p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                                                    <div className="flex justify-between">
                                                        <div className="flex-grow">
                                                            <h4 className="font-bold text-lg mb-2">{question.question}</h4>
                                                            <div className="space-y-2 ml-4">
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
                                                            <div className="ml-4 flex-shrink-0">
                                                                <img
                                                                    src={`http://localhost:3001${question.image}`}
                                                                    alt="Question visual"
                                                                    className="w-32 h-32 object-cover rounded-lg"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mt-4 flex space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(question)}
                                                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => question._id && handleDelete(question._id)}
                                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionManager;
