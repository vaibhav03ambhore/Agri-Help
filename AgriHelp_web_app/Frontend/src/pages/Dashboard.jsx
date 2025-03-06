import { useState } from "react";
import { useEffect } from "react";

const Dashboard=()=> {
  const [farmerData, setFarmerData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [activeView, setActiveView] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setFarmerData({
        basicInfo: {
          fullName: "John Smith",
          location: "Sacramento Valley, CA",
          farmSize: "150",
          farmSizeUnit: "acres",
          farmingType: "Organic Mixed Farming",
        },
        technology: [
          "Smart Irrigation System",
          "Soil Sensors",
          "Drone Mapping",
          "Weather Station",
        ],
        farmDetails: {
          currentCrops: ["Tomatoes", "Sweet Corn", "Bell Peppers"],
          plannedCrops: ["Winter Wheat", "Cover Crops", "Soybeans"],
        },
        goals: [
          { type: "Increase Crop Yield by 20%", priority: 1 },
          { type: "Implement Water Conservation", priority: 2 },
          { type: "Expand Organic Certification", priority: 3 },
        ],
        challenges: [
          { type: "Water Management", details: "Drought conditions" },
          { type: "Pest Control", details: "Organic solutions needed" },
          { type: "Labor Shortage", details: "Peak season staffing" },
          { type: "Market Access", details: "Transportation costs" },
        ],
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-[#4a8b3f] text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  if (!farmerData) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center gap-4">
        <div className="text-[#4a8b3f] text-xl">No profile found</div>
        <a
          href="/get-started"
          className="bg-[#4a8b3f] hover:bg-[#3a6d31] text-white font-bold py-2 px-6 rounded-lg transition duration-300"
        >
          Create Profile
        </a>
      </div>
    );
  }

  const menuItems = [
    { id: "overview", icon: "fa-home", label: "Farm Overview" },
    { id: "analysis", icon: "fa-brain", label: "AI Analysis" },
    { id: "reports", icon: "fa-file-alt", label: "Reports" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      <div
        className={`fixed hidden md:block h-screen bg-gradient-to-b from-[#2c5530] to-[#1a331d] transition-all duration-300 ease-in-out ${
          isSidebarExpanded ? "w-[240px]" : "w-[64px]"
        }`}
      >
        <div className="p-4 flex justify-end">
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <i
              className={`fas ${
                isSidebarExpanded ? "fa-chevron-left" : "fa-chevron-right"
              }`}
            ></i>
          </button>
        </div>
        <nav className="mt-8">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center px-4 py-3 transition-colors ${
                activeView === item.id ? "bg-white/10" : "hover:bg-white/5"
              } ${isSidebarExpanded ? "justify-start" : "justify-center"}`}
            >
              <i className={`fas ${item.icon} text-white`}></i>
              {isSidebarExpanded && (
                <span className="ml-3 text-white">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-[#2c5530] to-[#1a331d] z-50 md:hidden animate-slideDown">
            <div className="p-4">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <nav className="py-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 transition-colors ${
                      activeView === item.id
                        ? "bg-white/10"
                        : "hover:bg-white/5"
                    } rounded-lg mb-1`}
                  >
                    <i className={`fas ${item.icon} text-white`}></i>
                    <span className="ml-3 text-white">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}

      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarExpanded ? "md:ml-[240px]" : "md:ml-[64px]"
        }`}
      >
        <div className="py-12 bg-gradient-to-r from-[#2c5530] to-[#1a331d]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">
                  Welcome, {farmerData.basicInfo.fullName}
                </h1>
                <p className="text-xl opacity-90">
                  {farmerData.basicInfo.location}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-white hover:text-gray-200 transition-colors md:hidden"
                >
                  <i
                    className={`fas ${
                      isMobileMenuOpen ? "fa-times" : "fa-bars"
                    }`}
                  ></i>
                </button>
                <a
                  href="/get-started"
                  className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-white/10"
                  title="Edit Profile"
                >
                  <i className="fas fa-edit text-xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {activeView === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#2c5530] mb-4">
                  Farm Summary
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Size:</span>{" "}
                    {farmerData.basicInfo.farmSize}{" "}
                    {farmerData.basicInfo.farmSizeUnit}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Type:</span>{" "}
                    {farmerData.basicInfo.farmingType}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#2c5530] mb-4">
                  Technology Usage
                </h2>
                <div className="space-y-2">
                  {farmerData.technology.map((tech, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-[#4a8b3f]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#2c5530] mb-4">
                  Crops
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Current Crops
                    </h3>
                    <ul className="space-y-1">
                      {farmerData.farmDetails.currentCrops.map(
                        (crop, index) => (
                          <li key={index} className="text-gray-600">
                            {crop}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">
                      Planned Crops
                    </h3>
                    <ul className="space-y-1">
                      {farmerData.farmDetails.plannedCrops.map(
                        (crop, index) => (
                          <li key={index} className="text-gray-600">
                            {crop}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#2c5530] mb-4">
                  Top Goals
                </h2>
                <div className="space-y-4">
                  {farmerData.goals.map((goal, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#4a8b3f] text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{goal.type}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#2c5530] mb-4">
                  Current Challenges
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {farmerData.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-[#4a8b3f]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <span className="text-gray-700">
                        {challenge.type}
                        {challenge.details && ` - ${challenge.details}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {activeView === "analysis" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#2c5530] mb-4">
                AI Analysis
              </h2>
              <p className="text-gray-600">
                AI analysis content will be displayed here.
              </p>
            </div>
          )}
          {activeView === "reports" && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-[#2c5530] mb-4">
                Reports
              </h2>
              <p className="text-gray-600">
                Reports content will be displayed here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;