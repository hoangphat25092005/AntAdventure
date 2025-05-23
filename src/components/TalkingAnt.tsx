import React, { useState, useEffect } from 'react';
import Logo from '../assets/Logo.png';
import './LogoAnimation.css';
import { useLocation } from 'react-router-dom';

// Array of messages that the ant can say
const generalMessages = [
  "Welcome to AntVenture!",
  "Explore Vietnam with me!",
  "Did you know there are 63 provinces in Vietnam?",
  "Try our quiz and test your knowledge!",
  "Don't forget to check out the leaderboard!",
  "Need help? Check out our About Us page!",
  "Have feedback? We'd love to hear from you!"
];

// Array of province-specific messages
const provinceMessages = [
  "Click on a province to learn more!",
  "Each province has its own unique culture and history!",
  "Test your knowledge with our province quizzes!",
  "Vietnam has a rich cultural heritage across all provinces.",
  "Look at the details of each province to learn interesting facts!",
  "Did you know? Vietnam's provinces vary greatly in size and population.",
  "The northern provinces have different cultures than the southern ones!"
];

const TalkingAnt: React.FC = () => {
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();
  
  // Determine if we're on a province-related page
  const isProvincePage = location.pathname.includes('/review/') || 
                         location.pathname.includes('/multichoice/') || 
                         location.pathname === '/';

  // Select appropriate messages based on current page
  useEffect(() => {
    const selectedMessages = isProvincePage ? provinceMessages : generalMessages;
    // Replace the current message with one from the appropriate set
    if (showMessage) {
      const randomIndex = Math.floor(Math.random() * selectedMessages.length);
      setMessage("Hi! " + selectedMessages[randomIndex]);
    }
  }, [location.pathname, isProvincePage, showMessage]); // Re-run when path changes

  // Change message every 10 seconds
  useEffect(() => {
    const changeMessage = () => {
      const selectedMessages = isProvincePage ? provinceMessages : generalMessages;
      const randomIndex = Math.floor(Math.random() * selectedMessages.length);
      // Make the ant say "Hi!" first, then display the selected message
      setMessage("Hi! " + selectedMessages[randomIndex]);
      setShowMessage(true);
      setIsAnimating(true);
      
      // Hide message after 7 seconds
      setTimeout(() => {
        setShowMessage(false);
        setIsAnimating(false);
      }, 7000);
    };

    // Show first message with a delay
    const initialTimer = setTimeout(() => {
      changeMessage();
    }, 2000);

    // Set up interval for changing messages
    const intervalId = setInterval(changeMessage, 15000);

    // Clean up
    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalId);
    };
  }, [isProvincePage]);

  // Position based on current page
  const positionClass = isProvincePage 
    ? "fixed bottom-32 right-10 z-30" // Below province details
    : "fixed bottom-24 right-6 z-30"; // Default position
  // Always keep the ant running unless it's talking
  useEffect(() => {
    if (!isAnimating) {
      // Make sure the ant is in walking state when not talking
      const walkingInterval = setInterval(() => {
        // This empty interval ensures React keeps rerendering the component
        // which maintains the animation state
      }, 100);
      
      return () => clearInterval(walkingInterval);
    }
  }, [isAnimating]);

  return (
    <div className={`${positionClass} flex items-end`}>
      {/* Speech bubble */}
      {showMessage && (
        <div className="relative mr-4 mb-4 p-4 bg-white rounded-lg shadow-lg max-w-xs border-2 border-orange-400 speech-bubble-appear">
          <p className="text-base text-gray-800 font-medium">{message}</p>
          {/* Speech bubble tail */}
          <div className="absolute bottom-3 right-[-10px] w-5 h-5 bg-white border-b-2 border-r-2 border-orange-400 transform rotate-45"></div>
        </div>
      )}
        {/* Talking ant */}
      <div className={`logo-container ${isAnimating ? 'ant-talking' : 'ant-walking'}`}>
        <img 
          src={Logo} 
          alt="Talking Ant" 
          className={`cursor-pointer logo-image logo-hover-shake ${isProvincePage ? 'w-24 h-24' : 'w-20 h-20'}`}
          onClick={() => {
            if (!showMessage) {
              const selectedMessages = isProvincePage ? provinceMessages : generalMessages;
              const randomIndex = Math.floor(Math.random() * selectedMessages.length);
              setMessage("Hi! " + selectedMessages[randomIndex]);
              setShowMessage(true);
              setIsAnimating(true);
              
              setTimeout(() => {
                setShowMessage(false);
                setIsAnimating(false);
              }, 7000);
            }
          }}
        />
      </div>
    </div>
  );
};

export default TalkingAnt;
