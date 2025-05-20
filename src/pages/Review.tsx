import React, { useState, useEffect } from "react";

const ReviewContent: React.FC = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className={`bg-gradient-to-br from-[#5dbcc3] to-[#4a9ba1] w-full min-h-screen transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Main Content */}
      <div className="flex justify-center items-start py-12 px-8 gap-24">
        {/* Review Card */}
        <div className="group bg-gradient-to-br from-[#e8f4f6] to-[#d1e9ec] rounded-3xl p-6 w-[400px] shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
          {/* Shine effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          
          <div className="overflow-hidden rounded-lg mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
            <img
              src="https://www.icisequynhon.com/wp-content/uploads/2020/05/quynhon-binhdinh.jpg"
              alt="Aerial view of Bình Định coast"
              className="w-full h-36 object-cover rounded-lg transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
            />
          </div>
          
          <h2 className="text-xl font-medium text-black mb-2 group-hover:text-[#5dbcc3] transition-all duration-300 relative">
            Review for Bình Định
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#5dbcc3] transition-all duration-300 group-hover:w-full"></span>
          </h2>
          
          <div className="text-[20px] leading-tight text-black space-y-2 transition-all duration-300 group-hover:text-gray-700">
            <p className="transform transition-all duration-500 hover:translate-x-2">
              It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here'
            </p>
            <p className="transform transition-all duration-500 hover:translate-x-2">
              Lorem ipsum dolor sit amet...
            </p>
          </div>
        </div>

        {/* Question Cards with navigation arrows */}
        <div className="w-[400px] relative">
          {/* Navigation arrows */}
          {/* Navigation arrows - Left */}
<div className="absolute left-[-70px] top-1/2 transform -translate-y-1/2 z-10">
  <button className="group relative bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center transition-all duration-500 
    hover:from-red-600 hover:to-red-700
    hover:shadow-[0_0_15px_5px_rgba(239,68,68,0.5)]
    active:scale-95 
    before:content-[''] 
    before:absolute 
    before:inset-0 
    before:rounded-full 
    before:bg-red-500 
    before:animate-ping 
    before:opacity-0
    hover:before:opacity-20"
  >
    {/* Inner circle with gradient */}
    <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-red-400 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    {/* Main button content */}
    <div className="relative z-10 transition-all duration-300 
      group-hover:-translate-x-1 
      group-hover:scale-110 
      group-active:scale-90"
    >
      <svg xmlns="http://www.w3.org/2000/svg" 
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
    <div className="absolute -inset-1 rounded-full border-2 border-red-400/50 opacity-0 group-hover:opacity-100 
      group-hover:scale-110 transition-all duration-300 
      animate-[spin_3s_linear_infinite]"
    ></div>
  </button>
</div>

{/* Navigation arrows - Right */}
<div className="absolute right-[-70px] top-1/2 transform -translate-y-1/2 z-10">
  <button className="group relative bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center transition-all duration-500 
    hover:from-red-600 hover:to-red-700
    hover:shadow-[0_0_15px_5px_rgba(239,68,68,0.5)]
    active:scale-95 
    before:content-[''] 
    before:absolute 
    before:inset-0 
    before:rounded-full 
    before:bg-red-500 
    before:animate-ping 
    before:opacity-0
    hover:before:opacity-20"
  >
    {/* Inner circle with gradient */}
    <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-red-400 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    {/* Main button content */}
    <div className="relative z-10 transition-all duration-300 
      group-hover:translate-x-1 
      group-hover:scale-110 
      group-active:scale-90"
    >
      <svg xmlns="http://www.w3.org/2000/svg" 
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
    <div className="absolute -inset-1 rounded-full border-2 border-red-400/50 opacity-0 group-hover:opacity-100 
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
                isFlipped ? '[transform:rotateY(180deg)]' : ''
              } ${isHovered ? 'shadow-2xl scale-105' : 'shadow-md'}`}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              {/* Mặt trước */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#e8f4f6] to-[#d1e9ec] rounded-3xl p-8 w-full flex flex-col justify-between min-h-[350px] [backface-visibility:hidden] cursor-pointer transition-all duration-300 hover:shadow-xl group">
                <div className="relative overflow-hidden">
                  <div className="mb-28 transform transition-transform duration-300 group-hover:translate-x-2">
                    <h3 className="text-2xl font-medium text-black group-hover:text-[#5dbcc3] transition-colors duration-300">
                      Question 1: Lorem ipsum dolor sit ame?
                    </h3>
                  </div>
                  {/* Shine effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
                <div className="transform transition-all duration-300 group-hover:translate-x-2">
                  <p className="text-xl font-medium text-black group-hover:text-[#5dbcc3] transition-colors duration-300">
                    Correct Answer
                  </p>
                </div>
              </div>
              
              {/* Mặt sau */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#f6e8f4] to-[#ecd1e9] rounded-3xl p-8 w-full flex flex-col justify-between min-h-[350px] [backface-visibility:hidden] [transform:rotateY(180deg)] cursor-pointer transition-all duration-300 hover:shadow-xl group">
                <div className="relative overflow-hidden">
                  <div className="mb-28 transform transition-transform duration-300 group-hover:translate-x-2">
                    <h3 className="text-2xl font-medium text-black group-hover:text-purple-600 transition-colors duration-300">
                      Giải thích chi tiết
                    </h3>
                  </div>
                  {/* Shine effect */}
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
                <div className="transform transition-all duration-300 group-hover:translate-x-2">
                  <p className="text-xl text-black group-hover:text-purple-600 transition-colors duration-300">
                    Đây là giải thích cho câu trả lời đúng...
                  </p>
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