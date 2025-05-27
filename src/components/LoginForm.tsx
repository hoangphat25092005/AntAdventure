import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

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
        
        if (loginSuccess === 'true') {
            setSuccessMessage('Login successful');
            // Clean up the URL
            window.history.replaceState({}, document.title, location.pathname);
            // Redirect to home after a short delay
            setTimeout(() => {
                navigate('/');
            }, 1500);
        }
    }, [location, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:3001/api/users/login', {
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
                  <div className="mt-6 text-center">
                    <p className="mb-3 text-sm text-gray-600">Or continue with</p>                    <div className="flex justify-center">
                        <GoogleLogin 
                            onSuccess={credentialResponse => {
                                console.log('Google login success:', credentialResponse);
                                // Direct redirection to the Google Auth endpoint - this is the simplest approach
                                window.location.href = `http://localhost:3001/api/users/auth/google`;
                            }}
                            onError={() => {
                                console.log('Google login failed');
                                setError('Google login failed');
                            }}
                            useOneTap
                        />
                    </div>
                </div>
                
                <div className="mt-4 text-center">
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

