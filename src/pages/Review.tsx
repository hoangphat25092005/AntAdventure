import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { provinces } from "../data/provinceData";

interface ProvinceDetails {
  id: string;
  name: string;
  introduction: string;
  imageUrl: string;
  famousFor: string[];
  attractions: string[];
}

interface Question {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  image?: string;
}

const ReviewContent: React.FC = () => {
  const { provinceName } = useParams<{ provinceName: string }>();
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [provinceDetails, setProvinceDetails] = useState<ProvinceDetails | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Load province details and questions
  useEffect(() => {
    const loadData = async () => {
      if (!provinceName) {
        navigate('/');
        return;
      }

      try {
        // Decode the province name from URL and preserve exact case
        const decodedName = decodeURIComponent(provinceName.replace(/-/g, ' '));
        
        // Find matching province from local data (case-insensitive search)
        const province = provinces.find(p => 
          p.name.toLowerCase() === decodedName.toLowerCase()
        );
        
        if (!province) {
          console.error('Province not found:', decodedName);
          navigate('/');
          return;
        }

        // Use the exact name from the provinces data for API calls
        const exactProvinceName = province.name;

        // Fetch province details
        const detailsResponse = await fetch(`http://localhost:3001/api/provinces/${province.id}`, {
          credentials: 'include'
        });

        if (detailsResponse.ok) {
          const details = await detailsResponse.json();
          setProvinceDetails(details);
        }        // Fetch questions for the province using exact name
        const questionsResponse = await fetch(`http://localhost:3001/api/questions/getQuestionByProvince/${encodeURIComponent(exactProvinceName)}`, {
          credentials: 'include'
        });        if (questionsResponse.ok) {
          const data = await questionsResponse.json();
          if (data.questions && data.questions.length > 0) {
            console.log('Loaded questions:', data.questions); // Debug log
            setQuestions(data.questions);
          } else {
            console.log('No questions found for province:', exactProvinceName);
          }
        } else {
          console.error('Failed to fetch questions:', await questionsResponse.text());
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, [provinceName, navigate]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div
      className={`bg-gradient-to-br from-[#5dbcc3] to-[#4a9ba1] w-full min-h-screen transition-opacity duration-1000 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Main Content */}      <div className="flex justify-center items-start py-12 px-8 gap-24">
        {/* Review Card */}
        <div className="group bg-gradient-to-br from-[#e8f4f6] to-[#d1e9ec] rounded-3xl p-6 w-[400px] shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          {/* Shine effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

          <div className="overflow-hidden rounded-lg mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
            {provinceDetails && (
              <img
                src={`http://localhost:3001${provinceDetails.imageUrl}`}
                alt={`${provinceDetails.name} view`}
                className="w-full h-48 object-cover rounded-lg transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/400x300?text=" + provinceDetails.name;
                }}
              />
            )}
          </div>

          <h2 className="text-xl font-medium text-black mb-4 group-hover:text-[#5dbcc3] transition-all duration-300 relative">
            {provinceDetails?.name}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#5dbcc3] transition-all duration-300 group-hover:w-full"></span>
          </h2>

          <div className="text-[16px] leading-relaxed text-black space-y-4 transition-all duration-300 group-hover:text-gray-700">
            <p className="transform transition-all duration-500 hover:translate-x-2">
              {provinceDetails?.introduction}
            </p>
            
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Famous For:</h3>
              <ul className="list-disc list-inside space-y-1">
                {provinceDetails?.famousFor.map((item, index) => (
                  <li key={index} className="transform transition-all duration-500 hover:translate-x-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Must-Visit Attractions:</h3>
              <ul className="list-disc list-inside space-y-1">
                {provinceDetails?.attractions.map((attraction, index) => (
                  <li key={index} className="transform transition-all duration-500 hover:translate-x-2">
                    {attraction}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Question Cards with navigation arrows */}
        <div className="w-[400px] relative">
          {/* Navigation arrows */}
          {/* Navigation arrows - Left */}
          <div className="absolute left-[-70px] top-1/2 transform -translate-y-1/2 z-10">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`group relative bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center transition-all duration-500 
                ${currentQuestionIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:from-red-600 hover:to-red-700 hover:shadow-[0_0_15px_5px_rgba(239,68,68,0.5)]'}
                active:scale-95`}
            >
              {/* Inner circle with gradient */}
              <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-red-400 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Main button content */}
              <div
                className="relative z-10 transition-all duration-300 
      group-hover:-translate-x-1 
      group-hover:scale-110 
      group-active:scale-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 transition-all duration-300
          group-hover:stroke-2
          group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M15 19l-7-7 7-7"
                    className="group-hover:stroke-white"
                  />
                </svg>
              </div>

              {/* Outer ring effect */}
              <div
                className="absolute -inset-1 rounded-full border-2 border-red-400/50 opacity-0 group-hover:opacity-100 
      group-hover:scale-110 transition-all duration-300 
      animate-[spin_3s_linear_infinite]"
              ></div>
            </button>
          </div>

          {/* Navigation arrows - Right */}
          <div className="absolute right-[-70px] top-1/2 transform -translate-y-1/2 z-10">
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className={`group relative bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center transition-all duration-500 
                ${currentQuestionIndex === questions.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:from-red-600 hover:to-red-700 hover:shadow-[0_0_15px_5px_rgba(239,68,68,0.5)]'}
                active:scale-95`}
            >
              {/* Inner circle with gradient */}
              <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-red-400 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Main button content */}
              <div
                className="relative z-10 transition-all duration-300 
      group-hover:translate-x-1 
      group-hover:scale-110 
      group-active:scale-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 transition-all duration-300
          group-hover:stroke-2
          group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M9 5l7 7-7 7"
                    className="group-hover:stroke-white"
                  />
                </svg>
              </div>

              {/* Outer ring effect */}
              <div
                className="absolute -inset-1 rounded-full border-2 border-red-400/50 opacity-0 group-hover:opacity-100 
      group-hover:scale-110 transition-all duration-300 
      animate-[spin_3s_linear_infinite]"
              ></div>
            </button>
          </div>

          {/* Flashcard */}
          <div
            className="h-[350px] w-full [perspective:1000px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className={`relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] ${
                isFlipped ? "[transform:rotateY(180deg)]" : ""
              } ${isHovered ? "shadow-2xl scale-105" : "shadow-md"}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Front face */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#e8f4f6] to-[#d1e9ec] rounded-3xl p-8 w-full flex flex-col overflow-y-auto max-h-[500px] [backface-visibility:hidden] cursor-pointer transition-all duration-300 hover:shadow-xl group overflow-x-hidden">
                <div className="relative">
                  <div className="transform transition-transform duration-300 group-hover:translate-x-2">
                    {currentQuestion ? (
                      <>
                        <h3 className="text-2xl font-medium text-black group-hover:text-orange-500 transition-colors duration-300 break-words">
                          Question {currentQuestionIndex + 1}: {currentQuestion.question}
                        </h3>
                        {currentQuestion.image && (
                          <div className="mt-4">
                            <img 
                              src={`http://localhost:3001${currentQuestion.image}`} 
                              alt="Question" 
                              className="max-w-full h-auto rounded-lg shadow-md"
                            />
                          </div>
                        )}
                        <div className="mt-4 space-y-2">
                          {currentQuestion.options.map((option, index) => (
                            <div 
                              key={index}
                              className="p-2 rounded-lg bg-white/50 hover:bg-white/70 transition-colors duration-300"
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-xl text-gray-500">No questions available</p>
                    )}
                  </div>
                  {/* Shine effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
              </div>

              {/* Back face */}
              <div className="overflow-x-hidden absolute inset-0 bg-gradient-to-br from-[#f6e8f4] to-[#ecd1e9] rounded-3xl p-8 w-full flex flex-col justify-between min-h-[350px] [backface-visibility:hidden] [transform:rotateY(180deg)] cursor-pointer transition-all duration-300 hover:shadow-xl group">
                <div className="relative overflow-hidden">
                  <div className="mb-28 transform transition-transform duration-300 group-hover:translate-x-2">
                    <h3 className="text-2xl font-medium text-black group-hover:text-purple-600 transition-colors duration-300">
                      Answer Explanation
                    </h3>
                  </div>
                  {/* Shine effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
                <div className="transform transition-all duration-300 group-hover:translate-x-2">
                  {currentQuestion && (
                    <div className="space-y-4">
                      <p className="text-xl text-black group-hover:text-purple-600 transition-colors duration-300">
                        Correct Answer: {currentQuestion.options[currentQuestion.correctAnswer]}
                      </p>
                      <div className="text-lg">
                        <p>This is the correct answer because it matches the historical and cultural facts about {provinceDetails?.name}.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewContent;