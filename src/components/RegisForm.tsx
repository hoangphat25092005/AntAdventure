import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisForm: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-128px)] bg-cyan-500">
            <form className="bg-white p-8 rounded-[20px] w-96 border-8 border-sky-300">
                <h2 className="text-2xl font-bold mb-6 text-center">Register your account</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        id="username"
                        className="bg-gray-100 border border-gray-300 p-3 w-full rounded-md"
                        placeholder="Username"
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="password"
                        id="password"
                        className="bg-gray-100 border border-gray-300 p-3 w-full rounded-md"
                        placeholder="Password"
                    />
                </div>
                <div className="mb-6">
                    <input
                        type="password"
                        id="confirmpassword"
                        className="bg-gray-100 border border-gray-300 p-3 w-full rounded-md"
                        placeholder="Password confirm"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-700 text-xl text-white p-3 rounded-md w-full hover:bg-green-600 transition-colors"
                >
                    REGISTER
                </button>
                <div className="text-right mt-4">
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