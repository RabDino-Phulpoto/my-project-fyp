import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { completeRegistration, startRegistration } from "../api";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await startRegistration({ name, email });
      setMsg("✅ OTP sent to your email. Please check your inbox.");
      setStep(2);
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.error || "Failed to send OTP"));
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await completeRegistration({ email, otp, password, confirmPassword });
      setMsg("✅ Account created! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.error || "Failed to complete registration"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        
         <div className="mb-6">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              AI
            </div>
          </div>
          <h1 className="text-lg font-semibold text-gray-800">
            INTRACRANIAL ANEURYSM DETECTION SYSTEM (IADS)
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Empowering Early Diagnosis through AI
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleStart} className="mt-6 space-y-4 text-left">
            <input
              type="text" placeholder="Name" value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
            <input
              type="email" placeholder="Email" value={email}
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleComplete} className="mt-6 space-y-4 text-left">
            <input
              type="text" value={email} disabled
              className="w-full border rounded-lg px-4 py-2 bg-gray-100"
            />
            <input
              type="text" placeholder="Enter OTP" value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
            <input
              type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
            <input
              type="password" placeholder="Confirm Password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Verify & Create Account"}
            </button>
          </form>
        )}

        {msg && <p className="text-sm text-blue-600 mt-4">{msg}</p>}

        <div className="mt-4 text-sm">
          <Link to="/" className="text-gray-500 hover:text-blue-600">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
