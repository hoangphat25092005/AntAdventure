import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FeedBackForm: React.FC = () => {
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState('');
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check authentication status when component mounts
        checkAuth();
    }, []);    const checkAuth = async () => {
        try {            const response = await fetch('http://localhost:3001/api/users/check-auth', {
                credentials: 'include' // Important for sending cookies
            });
            if (response.ok) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        } catch (err) {
            console.error('Auth check failed:', err);
            setIsAuthenticated(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isAuthenticated) {
            setError('Please log in to submit feedback');
            return;
        }

        if (!feedback.trim()) {
            setError('Please enter your feedback');
            return;
        }        try {            const response = await fetch('http://localhost:3001/api/feedback/addFeedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ feedback: feedback })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Feedback submitted successfully!');
                setFeedback('');
                navigate('/'); // Navigate to home page after successful submission
            } else {
                setError(data.message || 'Failed to submit feedback');
            }
        } catch (err) {
            setError('Network error occurred');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-cyan-500">
            <form onSubmit={handleSubmit} className="bg-sky-100 p-8 rounded-[20px] w-full max-w-4xl">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-xl font-bold">Feedback</p>
                    <button 
                        type="submit"
                        className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-sky-600 transition-colors"
                        disabled={!isAuthenticated}
                    >
                        {isAuthenticated ? 'SEND' : 'Please Login'}
                    </button>
                </div>
                {error && (
                    <div className="mb-4 text-red-500 text-center">
                        {error}
                        {!isAuthenticated && (
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="ml-2 text-blue-600 hover:text-blue-800 underline"
                            >
                                Login now
                            </button>
                        )}
                    </div>
                )}
                <div className="mb-4">
                    <textarea
                        id="feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="bg-white border border-gray-300 p-3 w-full rounded-md min-h-[200px] resize-y"
                        placeholder={isAuthenticated ? "Enter your feedback here..." : "Please login to submit feedback"}
                        disabled={!isAuthenticated}
                    />
                </div>
            </form>
        </div>
    );
};

export default FeedBackForm;