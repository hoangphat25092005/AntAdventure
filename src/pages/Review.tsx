import React from "react";

const ReviewContent: React.FC = () => {
  return (
    <div className="bg-[#5dbcc3] w-full min-h-screen">
      
      {/* Main Content */}
      <div className="flex justify-center items-start py-12 px-8 gap-24">
        {/* Review Card */}
        <div className="bg-[#e8f4f6] rounded-3xl p-6 w-[400px] shadow-md">
          <img
            src="https://www.icisequynhon.com/wp-content/uploads/2020/05/quynhon-binhdinh.jpg"
            alt="Aerial view of Bình Định coast"
            className="w-full h-36 object-cover rounded-lg mb-4"
          />
          <h2 className="text-xl font-medium text-black mb-2">
            Review for Bình Định
          </h2>
          <div className="text-[11px] leading-tight text-black space-y-2">
            <p>
              Lorem Ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisi ut aliquip ex ea commodo consequat. Duis autem vel cum Irure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit present luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisi ut aliquip ex ea commodo consequat. Lorem Ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud 
            </p>
          </div>
        </div>

        {/* Question Cards with navigation arrows - CONTAINER chứa cả flashcard và mũi tên */}
        <div className="w-[400px] relative">
          
          {/* Navigation arrows - đặt bên ngoài flashcard */}
          <div className="absolute left-[-70px] top-1/2 transform -translate-y-1/2 z-10">
            <button className="bg-red-500 hover:bg-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center transition-colors shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          <div className="absolute right-[-70px] top-1/2 transform -translate-y-1/2 z-10">
            <button className="bg-red-500 hover:bg-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center transition-colors shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Flashcard */}
          <div className="group h-[350px] w-full [perspective:1000px]">
            {/* Card container */}
            <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
              
              {/* Mặt trước */}
              <div className="absolute inset-0 bg-[#e8f4f6] rounded-3xl p-8 w-full flex flex-col justify-between min-h-[350px] shadow-md [backface-visibility:hidden]">
                <div className="mb-28">
                  <h3 className="text-2xl font-medium text-black">
                    Question 1: Lorem ipsum dolor sit ame?
                  </h3>
                </div>
                <div>
                  <p className="text-xl font-medium text-black">
                    Correct Answer
                  </p>
                </div>
              </div>
              
              {/* Mặt sau */}
              <div className="absolute inset-0 bg-[#f6e8f4] rounded-3xl p-8 w-full flex flex-col justify-between min-h-[350px] shadow-md [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div className="mb-28">
                  <h3 className="text-2xl font-medium text-black">
                    Giải thích chi tiết
                  </h3>
                </div>
                <div>
                  <p className="text-xl text-black">
                    Đây là giải thích cho câu trả lời đúng. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
