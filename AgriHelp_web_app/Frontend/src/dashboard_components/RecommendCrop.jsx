import { useState } from "react";
import api from "../utils/apiService";

const RecommendCrop=({ onSubmit, initialData }) =>{
  const [formData, setFormData] = useState({
    Temperature: initialData?.Temperature || "",
    pH: initialData?.pH || "",
    Rainfall: initialData?.Rainfall || "",
    Soil_color: initialData?.Soil_color || "",
    Nitrogen: initialData?.Nitrogen || "",
    Phosphorus: initialData?.Phosphorus || "",
    Potassium: initialData?.Potassium || "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence,setConfidence]=useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch('http://localhost:5004/predict', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to get crop prediction");
      }

      const data = await response.json();

      const cropData = {
        ...formData,
        recommendation: data.recommendation,
        Confidence: data.result.confidence
      };
      
      // Store the crop data with the recommendation
      console.log('sending crop data: '+cropData);
      await api.storeCropResponse(cropData);
      
      if (data.recommendation) {
        setPrediction(data.recommendation);
        setConfidence(data.result.confidence);
        if (onSubmit) {
          onSubmit(data.recommendation);
        }
      } else {
        throw new Error("Failed to get crop prediction");
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-b from-green-50 to-white p-8 rounded-xl shadow-lg border border-green-100">
        <h2 className="text-3xl font-semibold text-green-800 mb-8 text-center">
          Crop Recommendation
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperature (°C)
              </label>
              <input
                type="number"
                name="Temperature"
                value={formData.Temperature}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
                min="-50"
                max="60"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                pH Level
              </label>
              <input
                type="number"
                name="pH"
                value={formData.pH}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
                min="0"
                max="14"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rainfall (mm)
              </label>
              <input
                type="number"
                name="Rainfall"
                value={formData.Rainfall}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Soil Color
              </label>
              <select
                name="Soil_color"
                value={formData.Soil_color}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select soil color</option>
                {[
                  "Black",
                  "Red",
                  "Medium Brown",
                  "Dark Brown",
                  "Red",
                  "Light Brown",
                  "Reddish Brown",
                  "Brown",
                  "Reddish",
                ].map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nitrogen (mg/kg)
              </label>
              <input
                type="number"
                name="Nitrogen"
                value={formData.Nitrogen}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
                min="0"
                max="140"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phosphorus (mg/kg)
              </label>
              <input
                type="number"
                name="Phosphorus"
                value={formData.Phosphorus}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
                min="0"
                max="140"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Potassium (mg/kg)
              </label>
              <input
                type="number"
                name="Potassium"
                value={formData.Potassium}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
                min="0"
                max="140"
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Predicting...
                </span>
              ) : (
                "Get Crop Recommendation"
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <p className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </p>
          </div>
        )}

        {prediction && (
          <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Recommended Crop
            </h3>
            <p className="text-3xl font-bold text-green-700">{prediction}</p>
            <p className="text-3xl font-bold text-[#4a8b3f] mb-2">
            Confidence: {confidence*100}% 
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecommendCrop;