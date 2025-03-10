//FarmInfo.jsx
const FarmInfo= ({ farmData, currentCrops, plannedCrops })=> {
  console.log(farmData);
  console.log(currentCrops);
  console.log(plannedCrops);
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Farm Information
      </h2>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <i className="fas fa-ruler text-green-600 w-6"></i>
          <div>
            <p className="text-sm text-gray-500">Farm Size</p>
            <p className="text-gray-800 font-medium">
              {farmData?.farmSize
                ? `${farmData?.farmSize} ${farmData?.farmSizeUnit}`
                : "Not provided"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <i className="fas fa-tractor text-green-600 w-6"></i>
          <div>
            <p className="text-sm text-gray-500">Farming Type</p>
            <p className="text-gray-800 font-medium">
              {farmData?.farmingType || "Not provided"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <i className="fas fa-seedling text-green-600 w-6"></i>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Current Crops</p>
              {currentCrops && currentCrops.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {currentCrops.map((crop, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-800">No current crops</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <i className="fas fa-clock text-green-600 w-6"></i>
            <div className="flex-1">
              <p className="text-sm text-gray-500">Planned Crops</p>
              {plannedCrops && plannedCrops.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {plannedCrops.map((crop, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {crop}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-800">No planned crops</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmInfo;