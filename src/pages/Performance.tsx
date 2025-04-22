import React from 'react';

const Performance: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-teal-500 pt-10 pb-10 bg-cyan-500"
    >
      <div className="container mx-auto px-8">
        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch mt-10">
          {/* Left Column - Student Information */}
          <div className="md:w-1/3 bg-sky-100/90 rounded-2xl p-8 shadow-2xl flex flex-col h-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white rounded-2xl p-4 w-60 h-44 flex items-center justify-center shadow-lg">
                <div className="w-32 h-32 bg-sky-300 rounded-full flex items-center justify-center shadow-md"> 
                  <svg
                    className="w-24 h-24 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Student's Information</h2>

            <p className="text-sm leading-relaxed text-gray-700 flex-grow">
              Student Information
            </p>

            {/* Empty space filler to match the Performance Report height */}
            <div className="flex-grow"></div>
          </div>

          {/* Right Column - Performance Report */}
          <div className="md:w-1/2 bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl flex flex-col h-auto">
            <h2 className="text-3xl font-bold mb-10">Performance Report</h2>
            <div className="space-y-8 flex-grow">
              <div>
                <p className="mb-3">Các tỉnh đã làm</p>
                <div className="h-8 bg-sky-100 rounded-full overflow-hidden shadow-inner blur-xs border-4 border-slate-550">
                  <div
                    className="h-full bg-orange-400 rounded-full shadow-md"
                    style={{ width: '65%' }}
                  ></div>
                </div>
              </div>

              <div>
                <p className="mb-3  ">Thời gian đã làm</p>
                <div className="h-8 bg-sky-100 rounded-full overflow-hidden shadow-inner blur-xs border-4 border-slate-550 ">
                  <div
                    className="h-full bg-orange-400 rounded-full shadow-md"
                    style={{ width: '70%' }}
                  ></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Performance;