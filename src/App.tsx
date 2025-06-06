import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header';
import Footer from './components/Footer';
import TalkingAnt from './components/TalkingAnt';
import Home from './pages/Home';
import Performance from './pages/Performance';
import Review from './pages/Review';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import Register from './pages/Register';
import Question from './pages/MultiChoice';
import Feedback from './pages/Feedback';
import QuestionManagement from './pages/QuestionManagement';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import ProvinceManagement from './pages/ProvinceManagement';
import CopperDrumImage from './assets/CopperDrum.png';
import QuestionImport from './pages/Import';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

const App: React.FC = () => {
  useEffect(() => {
    console.log('Google Client ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);
    
    if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
      console.error('❌ REACT_APP_GOOGLE_CLIENT_ID is not set in environment variables');
    }
  }, []);

  // If no Google Client ID, render without GoogleOAuthProvider
  if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
    console.warn('Google OAuth disabled: No client ID found');
    return (
      <Router>
        <div className="fixed flex flex-col w-full h-screen">
          <Header className="z-20" />
          <main className="flex-1 overflow-y-auto bg-transparent">
            <div className="relative z-10">
              <Routes>
                <Route path="/" element={<div className="bg-opacity-80"><Home /></div>} />
                <Route path="/login" element={<div className="bg-opacity-80"><Login /></div>} />
                <Route path="/register" element={<div className="bg-opacity-80"><Register /></div>} />
                <Route path="/performance" element={<div className="bg-opacity-80"><Performance /></div>} />
                <Route path="/review/:provinceName" element={<div className="bg-opacity-80"><Review /></div>} />
                <Route path="/about-us" element={<div className="bg-opacity-80"><AboutUs /></div>} />
                <Route path="/multichoice/:provinceName" element={<div className="bg-opacity-80"><Question /></div>} />
                <Route path="/feedback" element={<div className="bg-opacity-80"><Feedback /></div>} />
                <Route path="/manage-questions" element={<div className="bg-opacity-80"><QuestionManagement /></div>} />
                <Route path="/manage-provinces" element={<div className="bg-opacity-80"><ProvinceManagement /></div>} />
                <Route path="/admin-login" element={<div className="bg-opacity-80"><AdminLogin /></div>} />
                <Route path="/admin-register" element={<div className="bg-opacity-80"><AdminRegister /></div>} />
                <Route path="/import" element={<QuestionImport />} />
                <Route path="/forgot-password" element={<div className="bg-opacity-80"><ForgotPasswordPage /></div>} />
                <Route path="/reset-password/:token" element={<div className="bg-opacity-80"><ResetPasswordPage /></div>} />
              </Routes>
            </div>
          </main>
          <TalkingAnt />
          <Footer />
        </div>
      </Router>
    );
  }

  // Render with GoogleOAuthProvider only when client ID exists
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <div className="fixed flex flex-col w-full h-screen">
          <Header className="z-20" />
          <main className="flex-1 overflow-y-auto bg-transparent">
            <div className="relative z-10">
              <Routes>
                <Route path="/" element={<div className="bg-opacity-80"><Home /></div>} />
                <Route path="/login" element={<div className="bg-opacity-80"><Login /></div>} />
                <Route path="/register" element={<div className="bg-opacity-80"><Register /></div>} />
                <Route path="/performance" element={<div className="bg-opacity-80"><Performance /></div>} />
                <Route path="/review/:provinceName" element={<div className="bg-opacity-80"><Review /></div>} />
                <Route path="/about-us" element={<div className="bg-opacity-80"><AboutUs /></div>} />
                <Route path="/multichoice/:provinceName" element={<div className="bg-opacity-80"><Question /></div>} />
                <Route path="/feedback" element={<div className="bg-opacity-80"><Feedback /></div>} />
                <Route path="/manage-questions" element={<div className="bg-opacity-80"><QuestionManagement /></div>} />
                <Route path="/manage-provinces" element={<div className="bg-opacity-80"><ProvinceManagement /></div>} />
                <Route path="/admin-login" element={<div className="bg-opacity-80"><AdminLogin /></div>} />
                <Route path="/admin-register" element={<div className="bg-opacity-80"><AdminRegister /></div>} />
                <Route path="/import" element={<QuestionImport />} />
                <Route path="/forgot-password" element={<div className="bg-opacity-80"><ForgotPasswordPage /></div>} />
                <Route path="/reset-password/:token" element={<div className="bg-opacity-80"><ResetPasswordPage /></div>} />
              </Routes>
            </div>
          </main>
          <TalkingAnt />
          <Footer />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;