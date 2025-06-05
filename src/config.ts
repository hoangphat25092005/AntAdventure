const config = {
    API_URL: process.env.NODE_ENV === 'production' 
        ? window.location.origin // Uses the same domain as your frontend
        : 'http://localhost:3001'
};

export default config;