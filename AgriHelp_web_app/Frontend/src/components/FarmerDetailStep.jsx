import { useState } from "react";

const FarmDetailsStep=({ data, updateData, onBack, onNext })=> {
    const [errors, setErrors] = useState({});
  
    const cropOptions = [
      "Corn",
      "Wheat",
      "Soybeans",
      "Rice",
      "Cotton",
      "Potatoes",
      "Tomatoes",
      "Lettuce",
      "Carrots",
      "Other",
    ];
  
    const validate = () => {
      const newErrors = {};
      if (!data.farmSize) newErrors.farmSize = "Required";
      if (!data.farmingType) newErrors.farmingType = "Required";
      if (data.currentCrops.length === 0)
        newErrors.currentCrops = "Select at least one crop";
      if (!data.growingSeason) newErrors.growingSeason = "Required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleNext = () => {
      if (validate()) onNext();
    };
  
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Farm Size
            </label>
            <input
              type="number"
              name="farmSize"
              value={data.farmSize}
              onChange={(e) => updateData({ farmSize: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-[#4a8b3f] focus:border-[#4a8b3f]"
            />
            {errors.farmSize && (
              <p className="mt-1 text-sm text-red-600">{errors.farmSize}</p>
            )}
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <select
              name="farmSizeUnit"
              value={data.farmSizeUnit}
              onChange={(e) => updateData({ farmSizeUnit: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-[#4a8b3f] focus:border-[#4a8b3f]"
            >
              <option value="acres">Acres</option>
              <option value="hectares">Hectares</option>
            </select>
          </div>
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Farming Type
          </label>
          <select
            name="farmingType"
            value={data.farmingType}
            onChange={(e) => updateData({ farmingType: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-[#4a8b3f] focus:border-[#4a8b3f]"
          >
            <option value="">Select type</option>
            <option value="Traditional">Traditional</option>
            <option value="Organic">Organic</option>
            <option value="Mixed">Mixed</option>
            <option value="Greenhouse">Greenhouse</option>
            <option value="Other">Other</option>
          </select>
          {errors.farmingType && (
            <p className="mt-1 text-sm text-red-600">{errors.farmingType}</p>
          )}
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Crops
          </label>
          <div className="grid grid-cols-2 gap-2">
            {cropOptions.map((crop) => (
              <label key={crop} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={data.currentCrops.includes(crop)}
                  onChange={(e) => {
                    const newCrops = e.target.checked
                      ? [...data.currentCrops, crop]
                      : data.currentCrops.filter((c) => c !== crop);
                    updateData({ currentCrops: newCrops });
                  }}
                  className="rounded text-[#4a8b3f] focus:ring-[#4a8b3f]"
                />
                <span>{crop}</span>
              </label>
            ))}
          </div>
          {errors.currentCrops && (
            <p className="mt-1 text-sm text-red-600">{errors.currentCrops}</p>
          )}
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Planned Crops
          </label>
          <div className="grid grid-cols-2 gap-2">
            {cropOptions.map((crop) => (
              <label key={crop} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={data.plannedCrops.includes(crop)}
                  onChange={(e) => {
                    const newCrops = e.target.checked
                      ? [...data.plannedCrops, crop]
                      : data.plannedCrops.filter((c) => c !== crop);
                    updateData({ plannedCrops: newCrops });
                  }}
                  className="rounded text-[#4a8b3f] focus:ring-[#4a8b3f]"
                />
                <span>{crop}</span>
              </label>
            ))}
          </div>
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Growing Season
          </label>
          <select
            name="growingSeason"
            value={data.growingSeason}
            onChange={(e) => updateData({ growingSeason: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-[#4a8b3f] focus:border-[#4a8b3f]"
          >
            <option value="">Select season</option>
            <option value="Spring">Spring</option>
            <option value="Summer">Summer</option>
            <option value="Fall">Fall</option>
            <option value="Winter">Winter</option>
            <option value="Year-round">Year-round</option>
          </select>
          {errors.growingSeason && (
            <p className="mt-1 text-sm text-red-600">{errors.growingSeason}</p>
          )}
        </div>
  
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="border-2 border-[#4a8b3f] text-[#4a8b3f] hover:bg-[#4a8b3f] hover:text-white font-bold py-2 px-6 rounded-lg transition duration-300"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-[#4a8b3f] hover:bg-[#3a6d31] text-white font-bold py-2 px-6 rounded-lg transition duration-300"
          >
            Next
          </button>
        </div>
      </div>
    );
  }
  
    export default FarmDetailsStep;  