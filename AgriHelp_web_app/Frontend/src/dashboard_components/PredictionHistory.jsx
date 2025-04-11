import { useState, useEffect } from "react";
import api from "../utils/apiService";

const PredictionHistory=({ userId })=> {
  
  const [predictions, setPredictions] = useState({
    crops: [],
    fertilizers: [],
    pests: [],
    diseases: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("crops");
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        const [
          userCropPredictionRes,
          userFertilizerPredictionRes,
          userPestPredictionRes,
          userDiseasePredictionRes,
        ] = await Promise.all([
          api.getUserCropResults(),
          api.getUserFertilizerResults(),
          api.getUserPestResults(),
          api.getUserDiseaseResults(),
        ]);
  
        console.log("Raw API Responses:", 
          userCropPredictionRes.data,
          userFertilizerPredictionRes.data,
          userPestPredictionRes.data,
          userDiseasePredictionRes.data
        );
  
        // Updating the state and immediately logging the new values
        setPredictions(prev => {
          const newPredictions = {
            crops: userCropPredictionRes.data,
            fertilizers: userFertilizerPredictionRes.data,
            pests: userPestPredictionRes.data,
            diseases: userDiseasePredictionRes.data,
          };
          console.log("Updated predictions inside setState:", newPredictions);
          return newPredictions;
        });
  
      } catch (error) {
        console.error("Failed to load predictions:", error);
      } finally {
        setLoading(false);
      }
    };
  
    loadPredictions();
  }, [userId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderSimpleCard = (pred, type,key) => {
    
    const getMainInfo = () => {
      switch (type) {
        case "crops":
          return {
            title: pred.recommendation,
            confidence: pred.otherParameters?.confidence,
          };
        case "fertilizers":
          return {
            title: pred.recommendation,
            confidence: pred.otherParameters?.confidence,
          };
        case "pests":
          return {
            title: pred.prediction,
            confidence: pred.confidence,
          };
        case "diseases":
          return {
            title: pred.prediction,
            confidence: pred.confidence,
          };
        default:
          return { title: "", confidence: null };
      }
    };

    const { title, confidence } = getMainInfo();

    return (
      <div
        key={pred.id}
        className="border rounded-lg p-3 bg-white shadow-sm cursor-pointer hover:border-green-500 transition-colors"
        onClick={() => setSelectedPrediction({ ...pred, type })}
      >
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <h3 className="text-sm sm:text-base font-medium text-gray-800">
              {title}
            </h3>
            <span className="text-xs text-gray-400">
              {formatDate(pred.createdAt)}
            </span>
          </div>

          {confidence !== undefined && (
            <p className="text-xs text-gray-500">
              Confidence: {type === "crops" || type === "fertilizers" 
                ? (confidence * 100).toFixed(2) 
                : confidence.toFixed(2)} %
            </p>
          )}
        </div>
      </div>
    );
  };


  const renderDetailedView = () => {
    if (!selectedPrediction) return null;

    const { type } = selectedPrediction;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Prediction Details
              </h2>
              <button
                onClick={() => setSelectedPrediction(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {type === "crops" && selectedPrediction.recommendation}
                    {type === "fertilizers" && selectedPrediction.recommendation}
                    {type === "pests" && selectedPrediction.prediction}
                    {type === "diseases" && selectedPrediction.prediction}
                  </h3>
                  {(type === "crops" ||
                    type === "pests" ||
                    type === "diseases" ||
                    type === "fertilizers") && (
                    <p className="text-sm text-gray-600 mt-1">
                      Confidence:{" "}
                      {(
                        (type === "pests" || type === "diseases"
                          ? selectedPrediction.confidence
                          : selectedPrediction.otherParameters?.confidence*100) 
                      ).toFixed(2)}
                      %
                    </p>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(selectedPrediction.createdAt)}
                </span>
              </div>

              {type === "crops" && (
              <div className="space-y-4">                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-3">Input Parameters</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Soil Color</p>
                      <p className="text-sm font-medium">
                        {selectedPrediction.otherParameters?.soilColor}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rainfall</p>
                      <p className="text-sm font-medium">
                        {selectedPrediction.otherParameters?.rainfall}mm
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Temperature</p>
                      <p className="text-sm font-medium">
                        {selectedPrediction.otherParameters?.temperature}°C
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">pH Level</p>
                      <p className="text-sm font-medium">
                        {selectedPrediction.otherParameters?.pH}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nitrogen (N)</p>
                      <p className="text-sm font-medium">
                        {selectedPrediction.otherParameters?.nitrogen}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phosphorus (P)</p>
                      <p className="text-sm font-medium">
                        {selectedPrediction.otherParameters?.phosphorus}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Potassium (K)</p>
                      <p className="text-sm font-medium">
                        {selectedPrediction.otherParameters?.potassium}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {type === "fertilizers" && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-3">Input Parameters</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Soil Color</p>
                      <p className="text-sm font-medium">
                        {selectedPrediction.otherParameters?.soilColor}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Crop Type</p>
                      <p className="text-sm font-medium">
                        {selectedPrediction.otherParameters?.cropType}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Rainfall</p>
                      <p className="text-sm font-medium">
                        {selectedPrediction.otherParameters?.rainfall}mm
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Temperature</p>
                      <p className="text-sm font-medium">
                        {selectedPrediction.otherParameters?.temperature}°C
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">pH Level</p>
                      <p className="text-sm font-medium">
                        {selectedPrediction.otherParameters?.pH}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nitrogen (N)</p>
                      <p className="text-sm font-medium">
                        {selectedPrediction.otherParameters?.nitrogen}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phosphorus (P)</p>
                      <p className="text-sm font-medium">
                        {selectedPrediction.otherParameters?.phosphorus}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Potassium (K)</p>
                      <p className="text-sm font-medium">
                        {selectedPrediction.otherParameters?.potassium}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

              {type === "pests" && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  {/* <h4 className="font-medium text-gray-700 mb-3">Pest Details</h4> */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Original Image Name</p>
                      <p className="text-sm font-medium">{selectedPrediction.originalImageName}</p>
                    </div>
                  </div>
                </div>
                {selectedPrediction.imageUrl && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-3">Pest Image</h4>
                    <img 
                      src={selectedPrediction.imageUrl} 
                      alt={selectedPrediction.prediction} 
                      className="max-w-full h-auto rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            )}
            
            {type === "diseases" && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  {/* <h4 className="font-medium text-gray-700 mb-3">Disease Details</h4> */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Original Image Name</p>
                      <p className="text-sm font-medium">{selectedPrediction.originalImageName}</p>
                    </div>
                  </div>
                </div>
                {selectedPrediction.imageUrl && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-3">Disease Image</h4>
                    <img 
                      src={selectedPrediction.imageUrl} 
                      alt={selectedPrediction.prediction} 
                      className="max-w-full h-auto rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getSortedPredictions = (predictionsList) => {
    return [...predictionsList].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
  };

  const SortButton = () => (
    <button
      onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 border rounded-lg hover:bg-gray-50"
    >
      <span>Date</span>
      {sortOrder === "desc" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e4e6e4] mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-2 sm:p-4 md:p-6">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
          Prediction History
        </h2>
        <SortButton />
      </div>

      <div className="flex mb-3 sm:mb-4 border-b overflow-x-auto">
        {["crops", "fertilizers", "pests", "diseases"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSelectedPrediction(null);
            }}
            className={`px-3 py-2 text-xs sm:text-sm font-medium capitalize whitespace-nowrap
              ${
                activeTab === tab
                  ? "border-b-2 border-green-700 text-green-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-2 sm:space-y-4">
        {predictions[activeTab].length > 0 ? (
          getSortedPredictions(predictions[activeTab]).map((pred,index) =>
            renderSimpleCard(pred, activeTab,pred.id||index)
          )
        ) : (
          <div className="text-center py-4 text-xs sm:text-sm text-gray-500">
            No {activeTab} predictions found
          </div>
        )}
      </div>

      {selectedPrediction && renderDetailedView()}
    </div>
  );
}



export default PredictionHistory;