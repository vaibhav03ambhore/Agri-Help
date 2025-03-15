import { useState,useEffect } from "react";

const Login = () => {
  const [method, setMethod] = useState("email");
  const [step, setStep] = useState("input");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorTimer, setErrorTimer] = useState(null);

  useEffect(() => {
    if (error) {
      if (errorTimer) clearTimeout(errorTimer);
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      setErrorTimer(timer);
    }
    return () => {
      if (errorTimer) clearTimeout(errorTimer);
    };
  }, [error]);

  const handleOtpRequest = async () => {
    setError(null);
    setLoading(true);

    try {
      if (method === "email") {
        if (!email) {
          throw new Error("Please enter your email");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error("Please enter a valid email address");
        }
      }

      if (method === "mobile") {
        if (!mobile) {
          throw new Error("Please enter your mobile number");
        }
        const mobileRegex = /^\+?\d{10,14}$/;
        if (!mobileRegex.test(mobile.replace(/\s+/g, ""))) {
          throw new Error("Please enter a valid mobile number (10-14 digits)");
        }
      }

      const response = await fetch("https://agri-help-backend.onrender.com/api/handle-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "send",
          email: method === "email" ? email : null,
          mobile: method === "mobile" ? mobile : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }

      const data = await response.json();
      if (data && data.success) {
        setStep("otp");
      } else {
        throw new Error(data?.error || "Failed to send OTP");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async () => {
    setError(null);
    setLoading(true);

    try {
      if (!otp) {
        throw new Error("Please enter the OTP");
      }

      const response = await fetch("https://agri-help-backend.onrender.com/api/handle-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "verify",
          email: method === "email" ? email : null,
          mobile: method === "mobile" ? mobile : null,
          otp,
        }),
        credentials: 'include',
      });

      
      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.error|| "Failed to verify OTP");
      }

      const data = await response.json();
      if (data && data.success) {
        window.location.href = "/dashboard";
      } else {
        throw new Error(data?.error || "Invalid OTP");
      }
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <div className="h-48 bg-gradient-to-r from-[#2c5530] to-[#1a331d] flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Login</h1>
      </div>

      <div className="max-w-md mx-auto mt-10 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col gap-6">
            <button
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => {}}
            >
              <i className="fab fa-google text-xl"></i>
              <span>Continue with Google</span>
            </button>
            <div className="relative flex items-center gap-4">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="text-gray-500">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <div className="flex gap-4 p-1 bg-gray-100 rounded-lg">
              <button
                className={`flex-1 py-2 rounded-lg text-center transition-colors ${
                  method === "email"
                    ? "bg-white shadow-sm"
                    : "hover:bg-white/50"
                }`}
                onClick={() => setMethod("email")}
              >
                Email
              </button>
              <button
                className={`flex-1 py-2 rounded-lg text-center transition-colors ${
                  method === "mobile"
                    ? "bg-white shadow-sm"
                    : "hover:bg-white/50"
                }`}
                onClick={() => setMethod("mobile")}
              >
                Mobile
              </button>
            </div>

            {step === "input" ? (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {method === "email" ? "Email Address" : "Mobile Number"}
                  </label>
                  <input
                    type={method === "email" ? "email" : "tel"}
                    name={method === "email" ? "email" : "mobile"}
                    value={method === "email" ? email : mobile}
                    onChange={(e) =>
                      method === "email"
                        ? setEmail(e.target.value)
                        : setMobile(e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#4a8b3f] focus:ring-1 focus:ring-[#4a8b3f] outline-none transition-colors"
                    placeholder={
                      method === "email"
                        ? "Enter your email"
                        : "Enter your mobile number"
                    }
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg transition-opacity duration-500 opacity-100">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleOtpRequest}
                  disabled={loading}
                  className="w-full bg-[#4a8b3f] hover:bg-[#3a6d31] text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#4a8b3f] focus:ring-1 focus:ring-[#4a8b3f] outline-none transition-colors"
                    placeholder="Enter OTP"
                    maxLength={6}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg transition-opacity duration-500 opacity-100">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleOtpVerify}
                  disabled={loading}
                  className="w-full bg-[#4a8b3f] hover:bg-[#3a6d31] text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <button
                  onClick={() => setStep("input")}
                  className="w-full text-[#4a8b3f] hover:text-[#3a6d31] transition-colors"
                >
                  Back to {method === "email" ? "email" : "mobile"} input
                </button>
              </>
            )}

            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{" "}
              <a
                href="/get-started"
                className="text-[#4a8b3f] hover:text-[#3a6d31]"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;