import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);

        try {            const response = await fetch('http://localhost:3001/api/reset/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Reset password link has been sent to your email!');
                // Clear email field after successful submission
                setEmail('');
            } else {
                setError(data.message || 'Failed to process request');
            }
        } catch (err) {
            setError('Network error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-cyan-500">
            <div className="bg-white p-8 rounded-[20px] w-96 border-8 border-sky-300">
                <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
                {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                {success && <div className="mb-4 text-green-500 text-center">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-100 border border-gray-300 p-3 w-full rounded-md"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-3 rounded-md w-full hover:bg-blue-700 transition-colors"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    <div className="text-center mt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Back to Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
