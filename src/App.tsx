import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Performance from './pages/Performance';
import Review from './pages/Review';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import Register from './pages/Register';
import Question from './pages/MultiChoice';
import Feedback from './pages/Feedback';
import CopperDrumImage from './assets/CopperDrum.png';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow relative bg-transparent">
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<div className="bg-opacity-80"><Home /></div>} />
              <Route path="/login" element={<div className="bg-opacity-80"><Login /></div>} />
              <Route path="/register" element={<div className="bg-opacity-80"><Register /></div>} />
              <Route path="/performance" element={<div className="bg-opacity-80"><Performance /></div>} />
              <Route path="/review" element={<div className="bg-opacity-80"><Review /></div>} />
              <Route path="/about-us" element={<div className="bg-opacity-80"><AboutUs /></div>} />
              <Route path="/multichoice" element={<div className="bg-opacity-80"><Question /></div>} />
              <Route path="/feedback" element={<div className="bg-opacity-80"><Feedback /></div>} />
             
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;