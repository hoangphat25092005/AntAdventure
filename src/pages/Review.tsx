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

        {/* Question Cards (with shadow effect) */}
        <div className="w-[400px] relative">
          {/* Background tilted card (shadow) */}
          <div 
            className="absolute bg-[#e8f4f6] opacity-60 rounded-3xl w-full h-[350px] z-10"
            style={{ 
              transform: "rotate(-5deg)",
              top: "10px",
              left: "-15px"
            }}
          ></div>
          
          {/* Front card (straight) */}
          <div className="bg-[#e8f4f6] rounded-3xl p-8 w-full flex flex-col justify-between min-h-[350px] shadow-md relative z-20">
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
        </div>
      </div>
      
      
    </div>
  );
};

export default ReviewContent;
