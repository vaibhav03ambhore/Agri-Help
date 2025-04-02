import React, { useRef, useEffect } from "react";

const OTPModal = ({ 
  otpType, 
  currentOTP, 
  setCurrentOTP, 
  otpError, 
  setOtpError, 
  otpLoading, 
  onVerify, 
  onCancel 
}) => {
  // Add a ref for the OTP input field
  const otpInputRef = useRef(null);

  // Effect to focus the OTP input when modal opens
  useEffect(() => {
    if (otpInputRef.current) {
      setTimeout(() => {
        otpInputRef.current.focus();
      }, 100);
    }
  }, []);

  // Handle OTP input change - avoiding unnecessary re-renders
  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setCurrentOTP(value);
    if (otpError) setOtpError("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h3 className="text-lg font-semibold mb-4">
          {otpType === "email" ? "Email Verification" : "Mobile Verification"}
        </h3>
        <p className="mb-4 text-sm">
          An OTP has been sent to your {otpType === "email" ? "email" : "mobile number"}. Please enter it below to continue.
        </p>    
        <div className="mb-4">
          <input
            ref={otpInputRef}
            type="text"
            maxLength={6}
            placeholder="Enter OTP"
            value={currentOTP}
            onChange={handleOTPChange}
            className="w-full px-3 py-2 border rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {otpError && (
          <p className="text-red-500 text-sm mb-2">{otpError}</p>
        )}
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded text-gray-600"
            disabled={otpLoading}
          >
            Cancel
          </button>
          <button
            onClick={onVerify}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={otpLoading}
          >
            {otpLoading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;