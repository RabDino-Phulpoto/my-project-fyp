import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🧩 Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🧠 Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await loginUser(formData); // POST to Flask backend

      // ✅ Save authentication info to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.name || "User");

      setMessage("✅ Login successful! Redirecting...");

      // Redirect after short delay
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setMessage("❌ " + (err.response?.data?.error || "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Auto-redirect if already logged in
  if (localStorage.getItem("token")) {
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        {/* 🔷 Logo and Title */}
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

        {/* 🧾 Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={formData.password}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* 🔔 Message Feedback */}
        {message && <p className="text-sm text-blue-600 mt-4">{message}</p>}

        {/* 📎 Footer Links */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <Link
            to="/forgot-password"
            className="text-gray-500 hover:text-blue-600"
          >
            Forgot Password?
          </Link>

          <button
            type="button"
            onClick={() => navigate("/register")}
            className="border border-blue-600 text-blue-600 px-4 py-1 rounded-lg hover:bg-blue-50 transition"
          >
            Create Account
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          Prototype v1.0 | IADS © 2025
        </p>
      </div>
    </div>
  );
}
