import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
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
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-cyan-500">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[20px] w-96 border-8 border-sky-300">
                <h2 className="text-2xl font-bold mb-6 text-center">Log into your account</h2>
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
                <div className="mb-6">
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
                <button
                    type="submit"
                    className="bg-green-700 text-xl text-white p-3 rounded-md w-full hover:bg-green-600 transition-colors"
                >
                    LOGIN
                </button>
                <div className="text-center mt-4">
                    <span className="text-sm text-gray-600">
                        Don't have an account yet?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="text-blue-600 hover:text-blue-800 font-medium"
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