import { useState } from "react";
import api from "../utils/apiService";

const PredictPest=({ onSubmit, initialData })=> {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch('http://localhost:5002/predict', {
        method: "POST",
        body: formData,
      });

      // console.log("this is the repo: "+response);
      if (!response.ok) {
        throw new Error("Failed to get pest prediction");
      }

      const data = await response.json();
      const confidence= (data.confidence * 100).toFixed(2);
      setPrediction({
        name: data.prediction,
        confidence,
      });

      // Append prediction data to formData
      formData.append("prediction", data.prediction);
      formData.append("confidence", confidence);

      setLoading(false);
      // Second API Call - Store Disease Data
      await api.storePestResponse(formData);
      if (onSubmit) {
        onSubmit(data);
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
        <h2 className="text-3xl font-semibold text-[#2c5530] mb-8 text-center">
          Pest Detection
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                name="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer block">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <p className="text-sm text-gray-500">
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="text-sm text-gray-600">
                      <span className="text-[#4a8b3f] font-medium">
                        Upload an image
                      </span>{" "}
                      or drag and drop
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-[#4a8b3f] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#3a6d31] transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading || !selectedImage}
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
                  Analyzing...
                </span>
              ) : (
                "Detect Pest"
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
            <h3 className="text-xl font-semibold text-[#2c5530] mb-2">
              Detected Pest
            </h3>
            <p className="text-3xl font-bold text-[#4a8b3f] mb-2">
              {prediction.name}
            </p>
            <p className="text-3xl font-bold text-[#4a8b3f] mb-2">
            Confidence: {prediction.confidence}%
            </p>
           
          </div>
        )}
      </div>
    </div>
  );
}

export default PredictPest;