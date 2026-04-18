import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api";

// ── Small reusable input component ────────────────────────────────────────────
function FormInput({ label, id, error, rightSlot, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400
            bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all duration-150
            ${error
              ? "border-red-300 focus:ring-red-200"
              : "border-gray-200 focus:ring-blue-100 focus:border-blue-400"
            }
            ${rightSlot ? "pr-11" : ""}
          `}
          {...props}
        />
        {rightSlot && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightSlot}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Status banner ──────────────────────────────────────────────────────────────
function StatusBanner({ message, type }) {
  if (!message) return null;
  const styles = {
    success: "bg-green-50 border-green-200 text-green-700",
    error:   "bg-red-50 border-red-200 text-red-600",
  };
  const icons = {
    success: "✓",
    error:   "✕",
  };
  return (
    <div className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium ${styles[type]}`}>
      <span className="text-base leading-none">{icons[type]}</span>
      {message}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData]   = useState({ email: "", password: "" });
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [status, setStatus]       = useState({ message: "", type: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/dashboard");
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error on change
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Client-side validation
  const validate = () => {
    const errors = {};
    if (!formData.email)    errors.email    = "Email is required.";
    if (!formData.password) errors.password = "Password is required.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: "", type: "" });

    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(formData);
      localStorage.setItem("token",    res.data.token);
      localStorage.setItem("userName", res.data.user?.fullName || "User");

      setStatus({ message: "Login successful! Redirecting…", type: "success" });
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err) {
      setStatus({
        message: err.response?.data?.error || "Incorrect email or password.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-blue-100">

      {/* ── Left panel (decorative, hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-blue-600 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white"
              style={{
                width:  `${(i + 1) * 120}px`,
                height: `${(i + 1) * 120}px`,
                top:    "50%",
                left:   "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-sm border border-white/30">
            IA
          </div>
          <span className="text-white font-semibold text-sm tracking-wide">IADS</span>
        </div>

        {/* Center content */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-3 py-1 mb-6">
            <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
            <span className="text-white/90 text-xs font-medium">AI System Online</span>
          </div>

          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Early detection
            <br />
            saves lives.
          </h2>
          <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
            IADS analyzes CT and MR angiography to help clinicians detect intracranial
            aneurysms before they become life-threatening.
          </p>

          {/* Stat chips */}
          <div className="mt-8 flex flex-col gap-3">
            {[
              { value: "97.4%", label: "Detection accuracy" },
              { value: "< 3s",  label: "Average analysis time" },
              { value: "50+",   label: "Clinicians using IADS" },
            ].map(({ value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center border border-white/20">
                  <span className="text-white text-xs font-bold">{value}</span>
                </div>
                <span className="text-blue-200 text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <p className="relative text-white/40 text-xs">
          Prototype v1.0 · For research use only
        </p>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-12 sm:px-10">

        {/* Mobile logo (shown only when left panel is hidden) */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-200">
            IA
          </div>
          <span className="font-bold text-sm text-gray-800">IADS</span>
        </div>

        <div className="w-full max-w-sm">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Sign in to your IADS account to continue.
            </p>
          </div>

          {/* Status banner */}
          <div className="mb-5">
            <StatusBanner message={status.message} type={status.type} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            <FormInput
              label="Email address"
              id="email"
              type="email"
              name="email"
              placeholder="doctor@hospital.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={fieldErrors.email}
            />

            <FormInput
              label="Password"
              id="password"
              type={showPass ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={fieldErrors.password}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye     className="w-4 h-4" />}
                </button>
              }
            />

            {/* Forgot password */}
            <div className="flex justify-end -mt-1">
              <Link
                to="/forgot-password"
                className="text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white
                hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-150 shadow-md shadow-blue-200"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Register CTA */}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200
              bg-white py-3 text-sm font-medium text-gray-700
              hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50
              active:scale-[0.98] transition-all duration-150"
          >
            Create a new account
          </button>

          {/* Disclaimer */}
          <p className="mt-8 text-center text-[11px] text-gray-400 leading-relaxed">
            IADS is a research prototype · Not for standalone clinical diagnosis ·
            {" "}<span className="text-gray-500">© {new Date().getFullYear()} IADS</span>
          </p>
        </div>
      </div>
    </div>
  );
}
