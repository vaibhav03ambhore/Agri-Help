import { useState, useEffect } from "react";
import RecommendCrop from "../dashboard_components/RecommendCrop";
import RecommendFertilizer from "../dashboard_components/RecommendFertilizer";
import PredictPest from "../dashboard_components/PredictPest";
import PredictDisease from "../dashboard_components/PredictDisease";
import FarmOperationsAndStrategy from "../dashboard_components/FarmOperationsAndStrategy";
import FarmerInfo from "../dashboard_components/FarmerInfo";
import FarmInfo from "../dashboard_components/FarmInfo";
import PredictionHistory from "../dashboard_components/PredictionHistory";

import { api } from '../utils/apiService';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState("profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  
  const navigate = useNavigate();

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await api.getFarmerProfile();
      // console.log("status of success:", data.success);
      // console.log("profile data:", data); // Use comma instead of + for better logging

      if (!data.success || !data.data) {
        setError("Farmer profile not found");
        return;
      }

      // Now you can access the profile data using data.data
      const profileData = data.data;
      // console.log("profileData:", profileData);

      const transformedData = {
        profile: {
          ...profileData.basicInfo,
          ...profileData.farmDetails,
          technology: profileData.technology
        },
        currentCrops: profileData.farmDetails.currentCrops,
        plannedCrops: profileData.farmDetails.plannedCrops,
        challenges: profileData.challenges,
        goals: profileData.goals,
        cropSelections: profileData.cropSelections
      };
      
      // console.log("Transformed data:", transformedData);

      setStats(transformedData);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogo=()=>{
    navigate('/');
  }

  // Logout functionality
  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const data = await api.logout();
      
      if (data.success) {
        // Redirect to login page after successful logout
        navigate("/");
      } else {
        console.error("Logout failed:", data.message);
        // Still redirect to login page even if logout fails on the server
        // This ensures the user can start a new session
        navigate("/");
      }
    } catch (err) {
      console.error("Error during logout:", err);
      // Redirect anyway to let the user start fresh
      navigate("/");
    } finally {
      setLoggingOut(false);
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
    const initializeServices = async () => {
      try {
        await api.warmupServices();
        console.log('Backend services initialized');
      } catch (error) {
        console.error('Failed to initialize backend services:', error);
      }
    };
    
    // initializeServices();
    loadDashboard();
  }, []);
  
  const handleCropSubmit = (data) => {
    // Handle the crop recommendation submission
    console.log("Crop recommendation data:", data);
    // Add your logic here to process the crop recommendation data
  };
  
  const handleFertilizerSubmit = (data) => {
    // Handle the fertilizer recommendation submission
    console.log("Fertilizer recommendation data:", data);
    // Add your logic here to process the fertilizer recommendation data
  };

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
        
        <Link to="/get-started" className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-6 rounded-lg transition duration-300">
          Create Profile
        </Link>
  
      </div>
    );
  }
 
  // console.log("stats:", stats);
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Header */}
      <div className="md:hidden fixed w-full bg-white shadow-md z-50 px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-green-700" 
          onClick={handleLogo}
        >
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
              onClick={() => handleMenuClick("prediction-history")}
              className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer w-full ${
                selectedMenuItem === "prediction-history"
                  ? "bg-green-700 text-white"
                  : "text-gray-700 hover:text-green-700"
              }`}
            >
              <i className="fas fa-history"></i>
              <span>Prediction History</span>
            </button>

            <button 
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center space-x-2 p-3 rounded-lg cursor-pointer w-full text-red-600 disabled:opacity-50"
              title="Logout"
            >
              <i className={`fas ${loggingOut ? "fa-spinner fa-spin" : "fa-sign-out-alt"}`}></i>
              <span>{loggingOut ? "Logging out..." : "Logout"}</span>
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
              <h2 className="text-2xl font-bold text-green-700 mb-6"
              onClick={handleLogo}
              >
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

              <button
                onClick={() => setSelectedMenuItem("prediction-history")}
                className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer w-full ${
                  selectedMenuItem === "prediction-history"
                    ? "bg-green-700 text-white"
                    : "text-gray-700 hover:text-green-700"
                }`}
              >
                <i className="fas fa-history"></i>
                {sidebarOpen && <span>Prediction History</span>}
              </button>

              <div className="flex-1"></div>
              <button 
                onClick={handleLogout}
                disabled={loggingOut}
                className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer w-full hover:text-red-600 mt-auto ${loggingOut ? 'text-red-400' : ''} disabled:opacity-50`}
                title="Logout"
              >
                <i className={`fas ${loggingOut ? "fa-spinner fa-spin" : "fa-sign-out-alt"}`}></i>
                {sidebarOpen && <span>{loggingOut ? "Logging out..." : "Logout"}</span>}
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
                  plannedCrops={stats?.plannedCrops||[]}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FarmOperationsAndStrategy
                  challenges={stats?.challenges}
                  goals={stats?.goals}
                  technology={stats?.profile?.technology}
                />
              </div>
            </div>
          ) : selectedMenuItem === "recommend-crop" ? (
            <RecommendCrop 
              onSubmit={handleCropSubmit} 
              initialData={{
                "Soil_color": "Black",
                "Nitrogen": 80,
                "Phosphorus": 50,
                "Potassium": 40,
                "pH": 6.5,
                "Rainfall": 100,
                "Temperature": 25
              }}
            />
          ) : selectedMenuItem === "recommend-fertilizer" ? (
            <RecommendFertilizer 
              onSubmit={handleFertilizerSubmit} 
              initialData={{
                "Nitrogen": 35,
                "Phosphorus": 25,
                "Potassium": 40,
                "pH": 6.5,
                "Rainfall": 600,
                "Temperature": 30,
                "Soil_color": "Black",
                "Crop": "Jowar"
              }}
            />
          ) : selectedMenuItem === "predict-pest" ? (
            <PredictPest />
          ) : selectedMenuItem === "predict-disease" ? (
            <PredictDisease />
          ) : selectedMenuItem === "prediction-history" ? (
            <PredictionHistory userId={stats?.profile?.userId} />
          ) : null}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;