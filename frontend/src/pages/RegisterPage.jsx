import {
    AlertCircle,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Eye,
    EyeOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    pmdcId: "",
    fullName: "",
    email: "",
    mobile: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });

  // OTP Timer effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // ==================== VALIDATION ====================
  const validateStep1 = () => {
    const newErrors = {};

    // PMDC ID (any format accepted)
    if (!formData.pmdcId) {
      newErrors.pmdcId = "PMDC/PMC ID is required";
    } else if (formData.pmdcId.length < 2) {
      newErrors.pmdcId = "PMDC/PMC ID must be at least 2 characters";
    }

    // Name validation (letters only)
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!formData.fullName) {
      newErrors.fullName = "Full name is required";
    } else if (!nameRegex.test(formData.fullName)) {
      newErrors.fullName = "Name must contain letters only";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Mobile validation (0300-0000000 format)
    const mobileRegex = /^03\d{2}-\d{7}$/;
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Mobile must be in format 0300-0000000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.otp) {
      newErrors.otp = "OTP is required";
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = "OTP must be 6 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    // Password requirement: 8+ characters only
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== EVENT HANDLERS ====================
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Mobile number: auto-format to 0300-0000000
    if (name === "mobile") {
      const digits = value.split("").filter((c) => "0123456789".includes(c)).join("");
      if (digits.length <= 11) {
        if (digits.length <= 4) {
          processedValue = digits;
        } else {
          processedValue = `${digits.slice(0, 4)}-${digits.slice(4)}`;
        }
      }
    }

    // Name: allow only letters and spaces
    if (name === "fullName") {
      processedValue = value.split("").filter((c) => /[a-zA-Z\s]/.test(c)).join("");
    }

    // PMDC ID: accept any input
    if (name === "pmdcId") {
      processedValue = value;
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSendOTP = async () => {
    if (!validateStep1()) return;

    setLoading(true);
    try {
      console.log("📧 Sending OTP to:", formData.email);
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          fullName: formData.fullName,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to send OTP");

      console.log("✅ OTP sent successfully");
      setOtpSent(true);
      setOtpTimer(30);
      setErrors({});
      setCurrentStep(2);
    } catch (error) {
      console.error("❌ Send OTP Error:", error);
      setErrors({
        submit: `Failed to send OTP: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    try {
      console.log("🔐 Verifying OTP...");
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          otp: formData.otp,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Invalid OTP");

      console.log("✅ OTP verified successfully");
      setOtpVerified(true);
      setErrors({});
      setCurrentStep(3);
    } catch (error) {
      console.error("❌ OTP Verification Error:", error);
      setErrors({
        otp: `${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!validateStep3()) return;

    setLoading(true);
    try {
      console.log("📝 Registering user...");
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pmdcId: formData.pmdcId,
          fullName: formData.fullName,
          email: formData.email.toLowerCase(),
          mobile: formData.mobile,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");

      console.log("✅ Registration successful!");
      setCurrentStep(4);
    } catch (error) {
      console.error("❌ Registration Error:", error);
      setErrors({
        submit: `Registration failed: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Stepper Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                    currentStep >= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {currentStep > step ? <CheckCircle size={24} /> : step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-12 h-1 transition ${
                      currentStep > step ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Doctor Registration
            </h1>
            <p className="text-sm text-gray-600">
              {currentStep === 1 && "Professional Information"}
              {currentStep === 2 && "Verify Email"}
              {currentStep === 3 && "Set Password"}
              {currentStep === 4 && "Success"}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errors.submit && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700 text-sm flex items-center gap-2">
              <AlertCircle size={16} /> {errors.submit}
            </p>
          </div>
        )}

        {/* Step 1: Professional Information */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
            {/* PMDC ID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                PMDC/PMC ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pmdcId"
                value={formData.pmdcId}
                onChange={handleInputChange}
                placeholder="Enter your PMDC/PMC registration number"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                  errors.pmdcId
                    ? "border-red-500 bg-red-50"
                    : formData.pmdcId && !errors.pmdcId
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300"
                }`}
              />
              {errors.pmdcId && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.pmdcId}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="e.g., Dr. Ahmed Khan"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                  errors.fullName
                    ? "border-red-500 bg-red-50"
                    : formData.fullName && !errors.fullName
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300"
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="doctor@example.com"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                  errors.email
                    ? "border-red-500 bg-red-50"
                    : formData.email && !errors.email
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.email}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleInputChange}
                placeholder="0300-0000000"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition ${
                  errors.mobile
                    ? "border-red-500 bg-red-50"
                    : formData.mobile && !errors.mobile
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300"
                }`}
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.mobile}
                </p>
              )}
            </div>

            {/* Continue Button */}
            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin">⏳</div>
                  Sending OTP...
                </>
              ) : (
                <>
                  Continue <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900">
                📧 OTP sent to <strong>{formData.email}</strong>
              </p>
            </div>

            {/* OTP Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter OTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleInputChange}
                placeholder="000000"
                maxLength="6"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition text-center text-2xl tracking-widest font-mono ${
                  errors.otp
                    ? "border-red-500 bg-red-50"
                    : formData.otp && !errors.otp
                    ? "border-green-500 bg-green-50"
                    : "border-gray-300"
                }`}
              />
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.otp}
                </p>
              )}
            </div>

            {/* Timer */}
            <div className="text-center">
              {otpTimer > 0 ? (
                <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                  <Clock size={16} className="text-orange-500" />
                  OTP expires in <strong>{otpTimer}s</strong>
                </p>
              ) : (
                <p className="text-sm text-gray-600">OTP expired</p>
              )}
            </div>

            {/* Resend Button */}
            <button
              onClick={handleSendOTP}
              disabled={otpTimer > 0 || loading}
              className="w-full text-blue-600 hover:text-blue-700 disabled:text-gray-400 font-semibold py-2 text-sm transition"
            >
              {loading ? "Resending..." : "Resend OTP"}
            </button>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOTP}
              disabled={loading || !formData.otp}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin">⏳</div>
                  Verifying...
                </>
              ) : (
                <>
                  Verify OTP <ChevronRight size={20} />
                </>
              )}
            </button>

            {/* Back Button */}
            <button
              onClick={() => setCurrentStep(1)}
              className="w-full text-gray-600 hover:text-gray-900 font-semibold py-2 text-sm transition flex items-center justify-center gap-2"
            >
              <ChevronLeft size={20} /> Back
            </button>
          </div>
        )}

        {/* Step 3: Set Password */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-900 flex items-center gap-2">
                <CheckCircle size={18} className="text-green-600" />
                Email verified successfully ✓
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password (8+ characters)"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition pr-10 ${
                    errors.password
                      ? "border-red-500 bg-red-50"
                      : formData.password && !errors.password
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? (
                    <Eye size={18} />
                  ) : (
                    <EyeOff size={18} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm password"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition pr-10 ${
                    errors.confirmPassword
                      ? "border-red-500 bg-red-50"
                      : formData.confirmPassword && !errors.confirmPassword
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 transition"
                >
                  {showConfirmPassword ? (
                    <Eye size={18} />
                  ) : (
                    <EyeOff size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Create Account Button */}
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin">⏳</div>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account <ChevronRight size={20} />
                </>
              )}
            </button>

            {/* Back Button */}
            <button
              onClick={() => setCurrentStep(2)}
              className="w-full text-gray-600 hover:text-gray-900 font-semibold py-2 text-sm transition flex items-center justify-center gap-2"
            >
              <ChevronLeft size={20} /> Back
            </button>
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === 4 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome, Dr. {formData.fullName}!
            </h2>
            <p className="text-gray-600">
              Your account has been created successfully. You can now log in to the system.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
