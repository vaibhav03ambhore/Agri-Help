import { useState } from "react";

const TechnologyStep=({ data = [], updateData, onBack, onSubmit, loading })=> {
    const [errors, setErrors] = useState({});
  
    const technologyOptions = [
      "Irrigation Systems",
      "Soil Testing",
      "Weather Monitoring",
      "Farm Management Software",
      "None",
    ];
  
    const validate = () => {
      const newErrors = {};
      if (!data || data.length === 0) {
        newErrors.technology = "Select at least one option";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleSubmit = () => {
      if (validate()) onSubmit();
    };
  
    const handleTechnologyChange = (tech, checked) => {
      let newTech = [...data];
      if (tech === "None") {
        newTech = checked ? ["None"] : [];
      } else {
        if (checked) {
          newTech = newTech.filter((t) => t !== "None");
          newTech.push(tech);
        } else {
          newTech = newTech.filter((t) => t !== tech);
        }
      }
      updateData(newTech);
    };
  
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Technology Usage
          </label>
          <div className="space-y-2">
            {technologyOptions.map((tech) => (
              <label key={tech} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={data.includes(tech)}
                  onChange={(e) => handleTechnologyChange(tech, e.target.checked)}
                  disabled={tech !== "None" && data.includes("None")}
                  className="rounded text-[#4a8b3f] focus:ring-[#4a8b3f]"
                />
                <span>{tech}</span>
              </label>
            ))}
          </div>
          {errors.technology && (
            <p className="mt-1 text-sm text-red-600">{errors.technology}</p>
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
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#4a8b3f] hover:bg-[#3a6d31] text-white font-bold py-2 px-6 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    );
  };

export default TechnologyStep;