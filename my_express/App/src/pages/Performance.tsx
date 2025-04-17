import React from 'react';
const Performance: React.FC = () => {
    // Dữ liệu mẫu - sẽ được thay thế bằng dữ liệu từ API sau này
    const studentInfo = {
      bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril"
    };
  
    const skills = [
      { id: 1, name: "Skill #1", progress: 65 },
      { id: 2, name: "Skill #2", progress: 70 },
      { id: 3, name: "Skill #3", progress: 80 },
      { id: 4, name: "Skill #4", progress: 90 },
    ];
  
    return (
      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Student Information Card */}
          <div className="bg-sky-200/80 rounded-lg p-8 shadow-lg">
            <div className="flex flex-col items-center mb-6">
              <div className="w-36 h-36 bg-blue-300 rounded-full flex items-center justify-center mb-4">
                <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Student's Information</h2>
            </div>
            
            <div className="text-sm text-gray-700">
              <p>{studentInfo.bio}</p>
              <p className="mt-4">{studentInfo.bio}</p>
              <p className="mt-4">{studentInfo.bio.substring(0, studentInfo.bio.length / 2)}</p>
            </div>
          </div>
          
          {/* Performance Report Card */}
          <div className="bg-sky-200/80 rounded-lg p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-8">Performance Report</h2>
            
            <div className="space-y-8">
              {skills.map((skill) => (
                <div key={skill.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{skill.name}</span>
                  </div>
                  <div className="h-8 bg-sky-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${skill.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

export default Performance;