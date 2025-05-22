import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import QuestionTem from '../components/Question';

const Question: React.FC = () => {
    const { provinceName } = useParams<{ provinceName: string }>();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {                const response = await fetch('http://localhost:3001/api/users/check-auth', {
                    credentials: 'include',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                setIsAuthenticated(response.ok);
            } catch (err) {
                console.error('Auth check failed:', err);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-cyan-500">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="text-center mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!provinceName) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="h-full">
            <QuestionTem provinceName={provinceName} />
        </div>
    );
};

export default Question;