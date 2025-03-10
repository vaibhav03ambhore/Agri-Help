//FarmerInfo.jsx
const FarmerInfo=({ farmerData })=> {
  console.log(farmerData);
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Farmer Information
      </h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <i className="fas fa-user text-green-600 w-6"></i>
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-gray-800 font-medium">
              {farmerData?.fullName || "Not provided"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <i className="fas fa-envelope text-green-600 w-6"></i>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-gray-800 font-medium">
              {farmerData?.email || "Not provided"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <i className="fas fa-phone text-green-600 w-6"></i>
          <div>
            <p className="text-sm text-gray-500">Contact Number</p>
            <p className="text-gray-800 font-medium">
              {farmerData?.contactNumber || "Not provided"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <i className="fas fa-map-marker-alt text-green-600 w-6"></i>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="text-gray-800 font-medium">
              {farmerData?.location || "Not provided"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerInfo;