import { useState, useEffect } from "react";
import RecommendCrop from "../dashboard_components/RecommendCrop";
import RecommendFertilizer from "../dashboard_components/RecommendFertilizer";
import PredictPest from "../dashboard_components/PredictPest";
import PredictDisease from "../dashboard_components/PredictDisease";
import FarmOperationsAndStrategy from "../dashboard_components/FarmOperationsAndStrategy";
import FarmerInfo from "../dashboard_components/FarmerInfo";
import FarmInfo from "../dashboard_components/FarmInfo";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/get-farmer-profile", {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch profile');
      
      const data = await response.json();

      if (!data.success || !data.data) {
        setError("Farmer profile not found");
        return;
      }

      const transformedData = {
        profile: {
          ...data.data.basicInfo,
          ...data.data.farmDetails,
          technology: data.data.technology
        },
        currentCrops: data.data.farmDetails.currentCrops,
        plannedCrops: data.data.farmDetails.plannedCrops,
        challenges: data.data.challenges,
        goals: data.data.goals
      };

      setStats(transformedData);

    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
    // Close mobile menu after selection on mobile
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4a8b3f] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="text-red-600 text-xl">{error}</div>
        <a
          href="/get-started"
          className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
        >
          Create Profile
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Header */}
      <div className="md:hidden fixed w-full bg-white shadow-md z-50 px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-green-700">
          <i className="fas fa-leaf mr-2"></i>
          AgriHelp
        </h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-600 hover:text-green-700"
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>

      {/* Mobile Menu - Dropdown from top */}
      <div 
        className={`md:hidden fixed top-0 left-0 right-0 z-40 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0 mt-14' : '-translate-y-full'
        }`}
      >
        <div className="p-4">
          <nav className="space-y-2">
            <button
              onClick={() => handleMenuClick("profile")}
              className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer w-full ${
                selectedMenuItem === "profile"
                  ? "bg-green-700 text-white"
                  : "text-gray-700 hover:text-green-700"
              }`}
            >
              <i className="fas fa-user"></i>
              <span>Profile</span>
            </button>
            <button
              onClick={() => handleMenuClick("recommend-crop")}
              className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer w-full ${
                selectedMenuItem === "recommend-crop"
                  ? "bg-green-700 text-white"
                  : "text-gray-700 hover:text-green-700"
              }`}
            >
              <i className="fas fa-seedling"></i>
              <span>Recommend Crop</span>
            </button>
            <button
              onClick={() => handleMenuClick("recommend-fertilizer")}
              className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer w-full ${
                selectedMenuItem === "recommend-fertilizer"
                  ? "bg-green-700 text-white"
                  : "text-gray-700 hover:text-green-700"
              }`}
            >
              <i className="fas fa-flask"></i>
              <span>Recommend Fertilizer</span>
            </button>
            <button
              onClick={() => handleMenuClick("predict-pest")}
              className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer w-full ${
                selectedMenuItem === "predict-pest"
                  ? "bg-green-700 text-white"
                  : "text-gray-700 hover:text-green-700"
              }`}
            >
              <i className="fas fa-bug"></i>
              <span>Predict Pest</span>
            </button>
            <button
              onClick={() => handleMenuClick("predict-disease")}
              className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer w-full ${
                selectedMenuItem === "predict-disease"
                  ? "bg-green-700 text-white"
                  : "text-gray-700 hover:text-green-700"
              }`}
            >
              <i className="fas fa-disease"></i>
              <span>Predict Plant Disease</span>
            </button>
            <button 
              onClick={() => (window.location.href="/account/logout")}
              className="flex items-center space-x-2 p-3 rounded-lg cursor-pointer w-full text-red-600"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden md:block">
        <div
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } bg-white shadow-lg fixed h-full transition-all duration-300 ease-in-out`}
        >
          <div className="p-6 relative">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="absolute top-4 -right-1 bg-white p-2 rounded-lg hover:bg-gray-100"
              title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              <i
                className={`fas ${
                  sidebarOpen ? "fa-chevron-left" : "fa-chevron-right"
                } text-gray-600`}
              ></i>
            </button>
            {sidebarOpen ? (
              <h2 className="text-2xl font-bold text-green-700 mb-6">
                <i className="fas fa-leaf mr-2"></i>
                AgriHelp
              </h2>
            ) : (
              <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
                <i className="fas fa-leaf"></i>
              </h2>
            )}
            <nav className="space-y-2">
              <button
                onClick={() => setSelectedMenuItem("profile")}
                className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer w-full ${
                  selectedMenuItem === "profile"
                    ? "bg-green-700 text-white"
                    : "text-gray-700 hover:text-green-700"
                }`}
              >
                <i className="fas fa-user"></i>
                {sidebarOpen && <span>Profile</span>}
              </button>
              <button
                onClick={() => setSelectedMenuItem("recommend-crop")}
                className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer w-full ${
                  selectedMenuItem === "recommend-crop"
                    ? "bg-green-700 text-white"
                    : "text-gray-700 hover:text-green-700"
                }`}
              >
                <i className="fas fa-seedling"></i>
                {sidebarOpen && <span>Recommend Crop</span>}
              </button>
              <button
                onClick={() => setSelectedMenuItem("recommend-fertilizer")}
                className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer w-full ${
                  selectedMenuItem === "recommend-fertilizer"
                    ? "bg-green-700 text-white"
                    : "text-gray-700 hover:text-green-700"
                }`}
              >
                <i className="fas fa-flask"></i>
                {sidebarOpen && <span>Recommend Fertilizer</span>}
              </button>
              <button
                onClick={() => setSelectedMenuItem("predict-pest")}
                className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer w-full ${
                  selectedMenuItem === "predict-pest"
                    ? "bg-green-700 text-white"
                    : "text-gray-700 hover:text-green-700"
                }`}
              >
                <i className="fas fa-bug"></i>
                {sidebarOpen && <span>Predict Pest</span>}
              </button>
              <button
                onClick={() => setSelectedMenuItem("predict-disease")}
                className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer w-full ${
                  selectedMenuItem === "predict-disease"
                    ? "bg-green-700 text-white"
                    : "text-gray-700 hover:text-green-700"
                }`}
              >
                <i className="fas fa-disease"></i>
                {sidebarOpen && <span>Predict Plant Disease</span>}
              </button>
              <div className="flex-1"></div>
              <button 
                onClick={() => (window.location.href="/account/logout")}
                className="flex items-center space-x-2 p-3 rounded-lg cursor-pointer w-full hover:text-red-600 mt-auto"
                title="Logout"
              >
                <i className="fas fa-sign-out-alt"></i>
                {sidebarOpen && <span>Logout</span>}
              </button>
            </nav>
          </div>
        </div>
      </div>  

      {/* Main Content Area */}
      <div
        className={`flex-1 bg-green-700 transition-all duration-300 ease-in-out md:${
          sidebarOpen ? " md:ml-64 " : " md:ml-20"
        } 
        
        mt-14 md:mt-0`}
      >
        {/* Desktop Header */}
        <header className="hidden md:block bg-white shadow-sm bg-[url('/images/farm-header-bg.jpg')] bg-cover bg-center">
          <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center bg-white bg-opacity-80"> <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
            <div className="flex items-center space-x-4">
              <button 
                onClick={loadDashboard}
                className="p-2 text-green-700 hover:bg-green-50 rounded-lg disabled:opacity-50 transition-colors"
                title="Refresh Data"
                disabled={loading}
              >
                <i className={`fas fa-sync-alt ${loading ? "animate-spin" : ""}`}></i>
                <span className="sr-only">Refresh Data</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {selectedMenuItem === "profile" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FarmerInfo farmerData={stats?.profile} />
                <FarmInfo
                  farmData={stats?.profile}
                  currentCrops={stats?.currentCrops || []}
                  plannedCrops={stats?.currentCrops?.filter(
                    (crop) => crop.is_planned
                  )||[]}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FarmOperationsAndStrategy
                  challenges={stats?.challenges}
                  goals={stats?.goals}
                  technology={stats?.technology}
                />
              </div>
            </div>
          ) : selectedMenuItem === "recommend-crop" ? (
            <RecommendCrop />
          ) : selectedMenuItem === "recommend-fertilizer" ? (
            <RecommendFertilizer />
          ) : selectedMenuItem === "predict-pest" ? (
            <PredictPest />
          ) : selectedMenuItem === "predict-disease" ? (
            <PredictDisease />
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;