import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:5000/auth";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // step 1 = email, 2 = otp, 3 = reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1 — Send OTP to email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${API_URL}/forgot-start`, { email });
      setMessage("✅ " + res.data.message);
      setStep(2);
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.error || "Failed to send OTP"));
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${API_URL}/forgot-verify-otp`, { email, otp });
      setMessage("✅ " + res.data.message);
      setStep(3);
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.error || "Invalid OTP"));
    } finally {
      setLoading(false);
    }
  };

  // Step 3 — Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${API_URL}/forgot-reset`, {
        email,
        password,
        confirmPassword,
      });
      setMessage("✅ " + res.data.message);
      setTimeout(() => navigate("/"), 1500); // Go back to login page
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.error || "Failed to reset password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              AI
            </div>
          </div>
          <h1 className="text-lg font-semibold text-gray-800">
            INTRACRANIAL ANEURYSM DETECTION SYSTEM (IADS)
          </h1>
        </div>

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Forgot Password?</h2>
            <p className="text-gray-500 text-sm mb-6">
              Enter your registered email and we'll send an OTP for password reset.
            </p>
            <form onSubmit={handleSendOTP} className="space-y-4 text-left">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          </>
        )}

        {/* STEP 2: Enter OTP */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Verify OTP</h2>
            <p className="text-gray-500 text-sm mb-6">
              Enter the 6-digit OTP sent to your email.
            </p>
            <form onSubmit={handleVerifyOTP} className="space-y-4 text-left">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </>
        )}

        {/* STEP 3: Reset Password */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Reset Password</h2>
            <p className="text-gray-500 text-sm mb-6">Enter your new password below.</p>
            <form onSubmit={handleResetPassword} className="space-y-4 text-left">
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </>
        )}

        {/* Response Message */}
        {message && (
          <p className="text-sm text-blue-600 mt-4 font-medium">{message}</p>
        )}

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-8">
          Prototype v1.0 | IADS © 2025
        </p>
      </div>
    </div>
  );
}
