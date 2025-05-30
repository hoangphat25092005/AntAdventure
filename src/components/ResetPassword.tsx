import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();
    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isValidToken, setIsValidToken] = useState(false);

    useEffect(() => {
        // Verify token validity when component mounts
        const verifyToken = async () => {
            try {                const response = await fetch(`http://localhost:3001/api/reset/verify-reset-token/${token}`);
                setIsValidToken(response.ok);
                if (!response.ok) {
                    setError('Invalid or expired reset link');
                }
            } catch (err) {
                setError('Failed to verify reset link');
                setIsValidToken(false);
            }
        };

        if (token) {
            verifyToken();
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (passwords.password !== passwords.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (passwords.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);

        try {            const response = await fetch(`http://localhost:3001/api/reset/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: passwords.password })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Password has been reset successfully!');
                // Clear form after successful reset
                setPasswords({ password: '', confirmPassword: '' });
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setError(data.message || 'Failed to reset password');
            }
        } catch (err) {
            setError('Network error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isValidToken) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-cyan-500">
                <div className="bg-white p-8 rounded-[20px] w-96 border-8 border-sky-300">
                    <div className="text-center text-red-500">
                        {error || 'Invalid reset link'}
                    </div>
                    <div className="mt-4 text-center">
                        <button
                            onClick={() => navigate('/forgot-password')}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Request a new reset link
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-cyan-500">
            <div className="bg-white p-8 rounded-[20px] w-96 border-8 border-sky-300">
                <h2 className="mb-6 text-2xl font-bold text-center">Reset Password</h2>
                {error && <div className="mb-4 text-center text-red-500">{error}</div>}
                {success && <div className="mb-4 text-center text-green-500">{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="password"
                            value={passwords.password}
                            onChange={(e) => setPasswords(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
                            placeholder="New Password"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
                            placeholder="Confirm New Password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
