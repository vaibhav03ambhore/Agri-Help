import { useState } from "react";

const BasicInformationStep=({ data, updateData, onNext })=> {
    const [errors, setErrors] = useState({});
  
    const validate = () => {
      const newErrors = {};
      if (!data.fullName) newErrors.fullName = "Required";
      if (!data.email) newErrors.email ;
      else if (!/\S+@\S+\.\S+/.test(data.email))
        newErrors.email = "Invalid email";
      if (!data.contactNumber) newErrors.contactNumber = "Required";
      if (!data.location) newErrors.location = "Required";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleNext = () => {
      if (validate()) onNext();
    };
  
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={data.fullName}
            onChange={(e) => updateData({ fullName: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-[#4a8b3f] focus:border-[#4a8b3f]"
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-[#4a8b3f] focus:border-[#4a8b3f]"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number
          </label>
          <input
            type="tel"
            name="contactNumber"
            value={data.contactNumber}
            onChange={(e) => updateData({ contactNumber: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-[#4a8b3f] focus:border-[#4a8b3f]"
          />
          {errors.contactNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
          )}
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={data.location}
            onChange={(e) => updateData({ location: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-[#4a8b3f] focus:border-[#4a8b3f]"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>
  
        <div className="flex justify-end">
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

  export default BasicInformationStep;