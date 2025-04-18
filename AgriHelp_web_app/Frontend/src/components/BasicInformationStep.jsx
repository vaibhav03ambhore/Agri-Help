import { useState, useEffect } from "react";
import { api } from "../utils/apiService";
import OTPModal from "./OTPModel";

const BasicInformationStep = ({ data, updateData, onNext }) => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // OTP-related state
  const [emailVerified, setEmailVerified] = useState(data.emailVerified || false);
  const [mobileVerified, setMobileVerified] = useState(data.mobileVerified || false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [currentOTP, setCurrentOTP] = useState("");
  const [otpType, setOtpType] = useState(null); // 'email' or 'mobile'
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Email validation check
  const isEmailValid = (email) => {
    return email && /\S+@\S+\.\S+/.test(email);
  };

  // Contact number validation check
  const isContactValid = (contact) => {
    return contact && /^\d{10}$/.test(contact);
  };

  // Validate fields whenever data changes
  useEffect(() => {
    // Clear general error when any field changes
    setError(null);
    
    // Live validation for email
    if (data.email !== undefined) {
      if (data.email && !isEmailValid(data.email)) {
        setErrors(prev => ({ ...prev, email: "Invalid email format" }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }
    }
    
    // Live validation for contact number
    if (data.contactNumber !== undefined) {
      if (data.contactNumber && !isContactValid(data.contactNumber)) {
        setErrors(prev => ({ ...prev, contactNumber: "Invalid number format (10 digits required)" }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.contactNumber;
          return newErrors;
        });
      }
    }
    
    // Reset verifications if fields are cleared
    if (data.email === "") {
      setEmailVerified(false);
      updateData({ emailVerified: false });
    }
    
    if (data.contactNumber === "") {
      setMobileVerified(false);
      updateData({ mobileVerified: false });
    }
  }, [data.email, data.contactNumber]);

  const validate = () => {
    const newErrors = {};

    // Full Name validation
    if (!data.fullName) newErrors.fullName = "Required";

    // Ensure at least one contact method is provided
    if (!data.email && !data.contactNumber) {
      newErrors.emailOrContact = "Please provide either email or contact number";
    }

    // Email validation if provided
    if (data.email && !isEmailValid(data.email)) {
      newErrors.email = "Invalid email format";
    }

    // Contact number validation if provided
    if (data.contactNumber && !isContactValid(data.contactNumber)) {
      newErrors.contactNumber = "Invalid number format (10 digits required)";
    }

    // Location validation
    if (!data.location) newErrors.location = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;

    // Check if email or mobile needs verification
    if (data.email && !emailVerified) {
      await initiateVerification("email");
      return;
    }
    
    if (data.contactNumber && !mobileVerified) {
      await initiateVerification("mobile");
      return;
    }

    // If both are verified or not needed, proceed to next step
    onNext();
  };

  // Start verification process after form validation
  const initiateVerification = async (type) => {
    setOtpError("");
    setOtpLoading(true);
    setOtpType(type);
    
    try {
      if (type === "email") {
        const response = await api.getStartedSendOTP({ email: data.email });
        if (response.success) {
          setShowOTPModal(true);
        } else {
          throw new Error(response.error || "Failed to send OTP to email");
        }
      } else if (type === "mobile") {
        const response = await api.getStartedSendOTP({ mobile: data.contactNumber });
        if (response.success) {
          setShowOTPModal(true);
        } else {
          throw new Error(response.error || "Failed to send OTP to mobile");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  // Called when user verifies the OTP in the modal
  const handleVerifyOTP = async () => {
    setOtpError("");
    setOtpLoading(true);
    
    if (currentOTP.length !== 6) {
      setOtpError("Please enter a 6-digit OTP");
      setOtpLoading(false);
      return;
    }
    
    try {
      if (otpType === "email") {
        const response = await api.getStartedVerifyOTP({ email: data.email, otp: currentOTP });
        if (response.success) {
          setEmailVerified(true);
          // Save verification status in main form data
          updateData({ emailVerified: true });
          setShowOTPModal(false);
          setCurrentOTP("");
          
          // Show success popup
          setSuccessMessage("Email verified successfully!");
          setShowSuccessPopup(true);
          
          // Check if mobile also needs verification
          if (data.contactNumber && !mobileVerified) {
            // Add delay before initiating next verification
            setTimeout(() => {
              setShowSuccessPopup(false);
              initiateVerification("mobile");
            }, 1500);
          } else {
            // Move to next step after popup closes
            setTimeout(() => {
              setShowSuccessPopup(false);
              onNext();
            }, 1500);
          }
        } else {
          throw new Error(response.error || "Invalid OTP for email");
        }
      } else if (otpType === "mobile") {
        const response = await api.getStartedVerifyOTP({ mobile: data.contactNumber, otp: currentOTP });
        if (response.success) {
          setMobileVerified(true);
          // Save verification status in main form data
          updateData({ mobileVerified: true });
          setShowOTPModal(false);
          setCurrentOTP("");
          
          // Show success popup
          setSuccessMessage("Mobile number verified successfully!");
          setShowSuccessPopup(true);
          
          // Move to next step after popup closes
          setTimeout(() => {
            setShowSuccessPopup(false);
            onNext();
          }, 1500);
        } else {
          throw new Error(response.error || "Invalid OTP for mobile");
        }
      }
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleCancelOTP = () => {
    setShowOTPModal(false);
    setCurrentOTP("");
  };

  return (
    <div className="space-y-4">
      <p className="text-gray-600 text-sm p-3 border-l-4 border-blue-500 bg-blue-50">
        <span className="font-semibold">Note: </span> You can provide your email, your mobile, or both. Only one is required, but adding both is welcome.
      </p>

      <div>
        <label className="block mb-1">Full Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={data.fullName || ""}
          onChange={(e) => updateData({ fullName: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-[#4a8b3f] focus:border-[#4a8b3f]"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Email</label>
        <input
          type="email"
          placeholder="your.email@example.com"
          value={data.email || ""}
          onChange={(e) => {
            updateData({ email: e.target.value });
            // Reset email verification when email changes
            if (emailVerified) {
              setEmailVerified(false);
              updateData({ emailVerified: false });
            }
          }}
          className="w-full px-4 py-2 border rounded-lg focus:ring-[#4a8b3f] focus:border-[#4a8b3f]"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
        {emailVerified && (
          <p className="text-green-600 text-sm mt-1 font-semibold">Email Verified ✓</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Contact Number</label>
        <input
          type="tel"
          placeholder="1234567890"
          value={data.contactNumber || ""}
          onChange={(e) => {
            updateData({ contactNumber: e.target.value });
            // Reset mobile verification when contact changes
            if (mobileVerified) {
              setMobileVerified(false);
              updateData({ mobileVerified: false });
            }
          }}
          className="w-full px-4 py-2 border rounded-lg focus:ring-[#4a8b3f] focus:border-[#4a8b3f]"
        />
        {errors.contactNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
        )}
        {mobileVerified && (
          <p className="text-green-600 text-sm mt-1 font-semibold">Mobile Verified ✓</p>
        )}
      </div>

      <div>
        {errors.emailOrContact && (
          <p className="text-red-500 text-sm mt-1">{errors.emailOrContact}</p>
        )}
      </div>

      <div>
        <label className="block mb-1">Location</label>
        <input
          type="text"
          placeholder="Your city or address"
          value={data.location || ""}
          onChange={(e) => updateData({ location: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-[#4a8b3f] focus:border-[#4a8b3f]"
        />
        {errors.location && (
          <p className="text-red-500 text-sm mt-1">{errors.location}</p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={loading}
        className="mt-4 px-6 py-2 bg-[#4a8b3f] text-white rounded-lg"
      >
        {otpLoading ? "Sending Verification..." : emailVerified || mobileVerified ? "Next" : "Verify & Continue"}
      </button>

      {/* OTP Modal */}
      {showOTPModal && (
        <OTPModal
          otpType={otpType}
          currentOTP={currentOTP}
          setCurrentOTP={setCurrentOTP}
          otpError={otpError}
          setOtpError={setOtpError}
          otpLoading={otpLoading}
          onVerify={handleVerifyOTP}
          onCancel={handleCancelOTP}
        />
      )}

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <div className="text-green-500 mb-3">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Success!</h3>
            <p className="text-gray-600">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicInformationStep;