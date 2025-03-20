import React from 'react';

const Review: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-cyan-100">
            <h1 className="text-3xl font-bold mb-4">Review Page</h1>
            <p className="text-lg">This is the review page where users can leave their feedback.</p>
        </div>
    );
};

export default Review;