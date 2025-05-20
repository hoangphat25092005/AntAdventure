import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLoginForm: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        secretKey: '' // Admin secret key
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

        try {            const response = await fetch('http://localhost:3001/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/manage-questions'); // Redirect to question management on success
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error occurred');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-cyan-500">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[20px] w-96 border-8 border-red-300">
                <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Admin Login</h2>
                {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
                <div className="mb-4">
                    <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="bg-gray-100 border border-gray-300 p-3 w-full rounded-md"
                        placeholder="Admin Username"
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
                        id="secretKey"
                        value={formData.secretKey}
                        onChange={handleChange}
                        className="bg-gray-100 border border-gray-300 p-3 w-full rounded-md"
                        placeholder="Admin Secret Key"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-red-600 text-xl text-white p-3 rounded-md w-full hover:bg-red-700 transition-colors"
                >
                    ADMIN LOGIN
                </button>
                <div className="text-center mt-4">
                    <span className="text-sm text-gray-600">
                        Need an admin account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/admin-register')}
                            className="text-red-600 hover:text-red-800 font-medium"
                        >
                            Register as Admin
                        </button>
                    </span>
                </div>
            </form>
        </div>
    );
};

export default AdminLoginForm;
