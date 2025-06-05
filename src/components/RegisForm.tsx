import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';

const RegisForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        email: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`${config.API_URL}/api/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                    email: formData.email
                })
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login'); // Redirect to login page on success
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Network error occurred');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-cyan-500">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[20px] w-96 border-8 border-sky-300">
                <h2 className="text-2xl font-bold mb-6 text-center">Register your account</h2>
                {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                <div className="mb-4">
                    <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="bg-gray-100 border border-gray-300 p-3 w-full rounded-md"
                        placeholder="Username"
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-gray-100 border border-gray-300 p-3 w-full rounded-md"
                        placeholder="Email"
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="bg-gray-100 border border-gray-300 p-3 w-full rounded-md"
                        placeholder="Password"
                        required
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="bg-gray-100 border border-gray-300 p-3 w-full rounded-md"
                        placeholder="Confirm Password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-700 text-xl text-white p-3 rounded-md w-full hover:bg-green-600 transition-colors"
                >
                    REGISTER
                </button>
                <div className="text-center mt-4">
                    <span className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Log in
                        </button>
                    </span>
                </div>
            </form>
        </div>
    );
};

export default RegisForm;