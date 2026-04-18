import { Check, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordStart, forgotPasswordVerify, resetPassword } from "../api";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  // ── Form States ──────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // ── UI States ────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [otpTimer, setOtpTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── OTP Timer Logic ──────────────────────────────────────────────────────
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // ── Validation Functions ─────────────────────────────────────────────────
  const validateEmail = (e) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(e);
  };

  const validatePassword = (pwd) => {
    const errors = [];
    if (!pwd) return ["Password is required"];
    if (pwd.length < 8) errors.push("At least 8 characters");
    if (!/[a-z]/.test(pwd)) errors.push("Lowercase letter");
    if (!/[A-Z]/.test(pwd)) errors.push("Uppercase letter");
    if (!/[0-9]/.test(pwd)) errors.push("Number");
    if (!/[!@#$%^&*()_+\-=\[\]{};:',.<>?]/.test(pwd)) errors.push("Special character");
    return errors;
  };

  // ── Step 1: Send OTP ─────────────────────────────────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setMessage({ text: "", type: "" });

    if (!email.trim()) {
      setFieldErrors({ email: "Email is required" });
      return;
    }

    if (!validateEmail(email)) {
      setFieldErrors({ email: "Invalid email format" });
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordStart({ email: email.toLowerCase() });
      setMessage({ text: "✅ OTP sent to your email", type: "success" });
      setOtpTimer(30);
      setStep(2);
    } catch (err) {
      setMessage({
        text: `❌ ${err.response?.data?.error || "Failed to send OTP"}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ───────────────────────────────────────────────────
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setMessage({ text: "", type: "" });

    if (!otp.trim()) {
      setFieldErrors({ otp: "OTP is required" });
      return;
    }

    if (otp.length !== 6) {
      setFieldErrors({ otp: "OTP must be 6 digits" });
      return;
    }

    setLoading(true);
    try {
      await forgotPasswordVerify({ email: email.toLowerCase(), otp });
      setMessage({ text: "✅ OTP verified successfully", type: "success" });
      setTimeout(() => setStep(3), 800);
    } catch (err) {
      setMessage({
        text: `❌ ${err.response?.data?.error || "Invalid OTP"}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Reset Password ───────────────────────────────────────────────
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setMessage({ text: "", type: "" });

    const errors = {};

    if (!password) errors.password = "Password is required";
    else {
      const pwdErrors = validatePassword(password);
      if (pwdErrors.length > 0) {
        errors.password = pwdErrors.join(", ");
      }
    }

    if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email: email.toLowerCase(),
        password,
        confirmPassword,
      });
      setMessage({ text: "✅ Password reset successful!", type: "success" });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage({
        text: `❌ ${err.response?.data?.error || "Failed to reset password"}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Status Banner ────────────────────────────────────────────────────────
  function StatusBanner({ message, type }) {
    if (!message) return null;
    const styles = {
      success: "bg-green-50 border-green-200 text-green-700",
      error: "bg-red-50 border-red-200 text-red-600",
    };
    const icons = {
      success: "✓",
      error: "✕",
    };
    return (
      <div className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium ${styles[type]}`}>
        <span className="text-base leading-none">{icons[type]}</span>
        {message}
      </div>
    );
  }

  // ── Step Indicator ───────────────────────────────────────────────────────
  function StepIndicator() {
    const steps = [
      { num: 1, label: "Email" },
      { num: 2, label: "OTP" },
      { num: 3, label: "Password" },
    ];

    return (
      <div className="flex items-center gap-3 mb-8">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all
                ${step >= s.num ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}
              `}
            >
              {step > s.num ? <Check className="w-5 h-5" /> : s.num}
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`h-1 w-8 mx-2 transition-all ${
                  step > s.num ? "bg-blue-600" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-8">
      <div className="w-full max-w-md">
        {/* ── Header ── */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            AI
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-sm text-gray-600 mt-2">Recover your account securely</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* ── Step Indicator ── */}
          <StepIndicator />

          {/* ── Status Message ── */}
          <div className="mb-6">
            <StatusBanner message={message.text} type={message.type} />
          </div>

          {/* ── STEP 1: Email ── */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div>
                <p className="text-gray-600 text-sm mb-4">
                  Enter your registered email address to receive a verification OTP.
                </p>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition pr-10 ${
                        fieldErrors.email
                          ? "border-red-500 bg-red-50"
                          : email && !fieldErrors.email
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300"
                      }`}
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                  </div>
                  {fieldErrors.email && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Send OTP
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── STEP 2: OTP Verification ── */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div>
                <p className="text-gray-600 text-sm mb-4">
                  Enter the 6-digit OTP sent to <strong>{email}</strong>
                </p>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="otp" className="text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="000000"
                    maxLength="6"
                    inputMode="numeric"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ""));
                      if (fieldErrors.otp) setFieldErrors({ ...fieldErrors, otp: "" });
                    }}
                    className={`w-full rounded-xl border px-4 py-3 text-center text-2xl tracking-widest font-mono text-gray-900 placeholder-gray-400
                      bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-150
                      ${
                        fieldErrors.otp
                          ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                          : "border-gray-200 focus:ring-blue-100 focus:border-blue-400"
                      }
                    `}
                  />
                  {fieldErrors.otp && <p className="text-xs text-red-500">{fieldErrors.otp}</p>}
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <p className="text-gray-600">
                    {otpTimer > 0 ? (
                      <>
                        Resend in <span className="font-semibold text-blue-600">{otpTimer}s</span>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Resend OTP
                      </button>
                    )}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Verify Code
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── STEP 3: New Password ── */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <p className="text-gray-600 text-sm mb-4">
                  Create a strong new password for your account.
                </p>

                {/* New Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition pr-10 ${
                        fieldErrors.password
                          ? "border-red-500 bg-red-50"
                          : password && !fieldErrors.password
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
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (fieldErrors.confirmPassword)
                          setFieldErrors({ ...fieldErrors, confirmPassword: "" });
                      }}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition pr-10 ${
                        fieldErrors.confirmPassword
                          ? "border-red-500 bg-red-50"
                          : confirmPassword && !fieldErrors.confirmPassword
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
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Reset Password
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── Footer ── */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <a href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign In
              </a>
            </p>
          </div>
        </div>

        {/* ── Bottom Note ── */}
        <p className="text-xs text-gray-500 text-center mt-6">
          Prototype v1.0 | IADS © 2025 | For research use only
        </p>
      </div>
    </div>
  );
}
