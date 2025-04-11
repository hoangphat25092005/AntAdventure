import React from "react";

const Review: React.FC = () => {
  return (
    <div className="bg-[#5dbcc3] w-full min-h-[calc(100vh-100px)] px-16 py-10 flex justify-between items-start">
      {/* Review Card */}
      <div className="bg-[#b8dde1] rounded-3xl p-8 w-[500px] shadow-lg">
        <img
          src="/mnt/data/476497109_674295498397300_7601207872967508631_n.jpg"
          alt="Binh Định"
          className="rounded-3xl mb-6 w-full h-[250px] object-cover"
        />
        <h2 className="text-xl font-semibold mb-4">Review for Bình Định</h2>
        <p className="text-sm text-justify text-gray-800 leading-relaxed">
          Lorem ipsum dolor sit amet, consectet ur adipiscing elit, sed diam
          nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
          volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation
          ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
          Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse
          molestie consequat, vel illum dolore eu feugiat nulla facilisis at
          vero eros et accumsan et iusto odio dignissim qui blandit praesent
          luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
        </p>
      </div>

      {/* Quiz Card */}
      <div className="relative w-[400px] h-[250px] flex justify-center items-center">
        {/* Background shadow card */}
        <div className="absolute top-4 left-4 w-full h-full bg-[#b8dde1] rounded-3xl shadow-md"></div>
        {/* Front card */}
        <div className="relative w-full h-full bg-[#b8dde1] rounded-3xl shadow-lg p-6 flex flex-col justify-center items-center text-center">
          <h3 className="text-lg font-semibold mb-4">
            Question 1: Lorem ipsum dolor sit ame?
          </h3>
          <p className="text-base">Correct Answer</p>
        </div>
      </div>
    </div>
  );
};

export default Review;