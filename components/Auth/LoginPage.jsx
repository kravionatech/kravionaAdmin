import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";

const LoginPage = () => {
  const backendApi = import.meta.env.VITE_BACKEND_API;

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); // Added to replace ugly browser alerts

  // Single state for Email, Phone, or Username
  const [loginId, setLoginId] = useState("");
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  // Handle requesting the OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    if (!loginId.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      // Note: Make sure your initial send endpoint is correct.
      // Often it's '/auth/send-otp' rather than 'resend-otp' for the first request.
      const res = await fetch(`${backendApi}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginId }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStep(2);
      } else {
        setError(data.message || "Failed to send OTP. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verifying the OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${backendApi}/auth/login-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginId, otp }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        console.log(data);

        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/");
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
        setOtp("");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header/Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">
          Kraviona
        </h1>
        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Admin Portal Login
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your details to receive a secure access code.
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-xl sm:px-10 border border-gray-100">
          {/* Error Message Display */}
          {error && (
            <div className="mb-4 p-3 rounded bg-red-50 text-red-600 text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          {/* ================= STEP 1: SINGLE INPUT ================= */}
          {step === 1 && (
            <form
              onSubmit={handleSendOtp}
              className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
            >
              <div>
                <label
                  htmlFor="loginId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="loginId"
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder="Enter email"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !loginId.trim()}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Send OTP"
                )}
                {!isLoading && <ArrowRight size={18} />}
              </button>
            </form>
          )}

          {/* ================= STEP 2: VERIFY OTP ================= */}
          {step === 2 && (
            <form
              onSubmit={handleVerifyOtp}
              className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <ShieldCheck className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Security Verification
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  We've sent a 6-digit code to <br />
                  <span className="font-semibold text-gray-900">{loginId}</span>
                </p>
              </div>

              <div>
                <label htmlFor="otp" className="sr-only">
                  One Time Password
                </label>
                <input
                  id="otp"
                  type="text"
                  maxLength="6"
                  required
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  className="block w-full text-center tracking-[0.5em] font-mono text-2xl py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="------"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length < 4}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Verify & Login"
                )}
              </button>

              <div className="flex justify-between items-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp(""); // Reset OTP when going back
                    setError("");
                  }}
                  className="text-sm flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  type="button"
                  onClick={handleSendOtp} // Wired up the Resend button
                  disabled={isLoading}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors disabled:opacity-50"
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
