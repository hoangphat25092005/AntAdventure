import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import config from '../config';

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    // Check for login success from Google redirect
    useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const loginSuccess = urlParams.get('loginSuccess');
    const loginError = urlParams.get('error');
    
    if (loginSuccess === 'true') {
        setSuccessMessage('Google login successful! Redirecting...');
        // Clean up the URL
        window.history.replaceState({}, document.title, location.pathname);
        // Redirect to home after a short delay
        setTimeout(() => {
            navigate('/');
        }, 1500);
    } else if (loginError) {
        setError('Google authentication failed. Please try again.');
        // Clean up the URL
        window.history.replaceState({}, document.title, location.pathname);
    }
    }, [location.search, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
       const response = await fetch(`${config.API_URL}/api/users/login`, {
       method: 'POST',
       headers: {
        'Content-Type': 'application/json',
       },
       credentials: 'include',
       body: JSON.stringify(formData)
     });

            const data = await response.json();

            if (response.ok) {
                navigate('/'); // Redirect to home page on success
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error occurred');
        }
    };    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-cyan-500">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[20px] w-96 border-8 border-sky-300">
                <h2 className="mb-6 text-2xl font-bold text-center">Log into your account</h2>
                {error && <div className="mb-4 text-center text-red-500">{error}</div>}
                {successMessage && <div className="mb-4 text-center text-green-500">{successMessage}</div>}
                <div className="mb-4">
                    <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
                        placeholder="Username"
                        required
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-100 border border-gray-300 rounded-md"
                        placeholder="Password"
                        required
                    />
                </div>                <button
                    type="submit"
                    className="w-full p-3 text-xl text-white transition-colors bg-green-700 rounded-md hover:bg-green-600"
                >
                    LOGIN
                </button>
    <div className="flex justify-center">
    {process.env.REACT_APP_GOOGLE_CLIENT_ID ? (
        <button
            type="button"
            onClick={() => {
                // Direct navigation to Google OAuth endpoint
                window.location.href = `${config.API_URL}/api/users/auth/google`;
            }}
            className="flex items-center justify-center w-full p-3 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
        </button>
    ) : (
        <div className="text-sm text-gray-500 text-center">
            Google Sign-in not available
        </div>
    )}
    </div>
                
                <div className="mt-4 text-center">                    <div className="mb-2">
                        <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            Forgot your password?
                        </button>
                    </div>
                    <span className="text-sm text-gray-600">
                        Don't have an account yet?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="font-medium text-blue-600 hover:text-blue-800"
                        >
                            Register
                        </button>
                    </span>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;

