import { useNavigate } from "react-router-dom";
import monitorBrain from "../assets/monitor-brain.png";
import LandingFooter from "../components/LandingFooter";
import LandingNavbar from "../components/LandingNavbar";
// adjust "../" if your path is different
import { Activity, FileOutput, FileText, IdCard } from "lucide-react";



export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div id="top" className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex flex-col">
      <LandingNavbar />

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4">

          {/* HERO SECTION */}
          <section className="py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
            {/* Left: text */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Empowering Early Diagnosis
                <br />
                through <span className="text-blue-600">AI</span>
              </h1>
              <p className="mt-4 text-gray-600 text-sm md:text-base max-w-md">
                A+ powered platform for detecting intracranial aneurysms early and accurately
                from CT/MR angiography.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate("/register")}
                  className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition shadow-sm"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-3 rounded-lg border border-blue-600 text-blue-600 font-medium text-sm hover:bg-blue-50 transition"
                >
                  Try Demo
                </button>
              </div>
            </div>
{/* Right: illustration image */}
<div className="relative flex justify-center">
  <div className="w-full max-w-sm rounded-3xl bg-blue-100 flex items-center justify-center">
    <img
      src="/images/brain-hero.png"
      alt="AI-powered brain analysis illustration"
      className="w-full h-auto object-contain"
    />
  </div>
</div>


          </section>

          {/* ABOUT SECTION */}
          <section id="about" className="py-12 md:py-16 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
                About IADS
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                IADS leverages advanced artificial intelligence technology to analyze medical
                imaging and detect intracranial aneurysms at an early stage. Our goal is to
                support clinicians with reliable and interpretable AI assistance, not to replace
                their expertise.
              </p>
            </div>

            {/* Monitor illustration */}
<div className="flex justify-center">
  <div className="w-full max-w-sm rounded-3xl bg-blue-100 flex items-center justify-center overflow-hidden">
    <img
      src={monitorBrain}
      alt="Brain scan on monitor"
      className="w-4/5 h-auto object-contain"
    />
  </div>
</div>

          </section>

          {/* FEATURES SECTION */}
          <section id="features" className="py-12 md:py-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 text-center mb-8">
              Features
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  AI
                </div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                  AI Analysis
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  State-of-the-art algorithms analyze your scans for early and precise aneurysm detection.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  🔒
                </div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                  Secure Cloud
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  All data is encrypted and stored securely in the cloud for easy and compliant access.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                  ✓
                </div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                  Medical Accuracy
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  Designed with input from medical experts and validated on real-world clinical datasets.
                </p>
              </div>
            </div>
          </section>

          {/* HOW IT WORKS SECTION */}
<section className="py-12 md:py-16">
  <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 text-center mb-8">
    How It works
  </h2>

  <div className="grid md:grid-cols-4 gap-6 text-center text-sm md:text-base">
    {/* Step 1 */}
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-md">
        <IdCard className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-semibold text-gray-900 text-sm md:text-base">
        Create Account
      </h3>
      <p className="text-xs md:text-sm text-gray-600">
        Sign up and verify <br /> your email.
      </p>
    </div>

    {/* Step 2 */}
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-md">
        <FileText className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-semibold text-gray-900 text-sm md:text-base">
        Upload Medical
      </h3>
      <p className="text-xs md:text-sm text-gray-600">
        Upload your brain <br /> MRI/MRA image.
      </p>
    </div>

    {/* Step 3 */}
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-md">
        <Activity className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-semibold text-gray-900 text-sm md:text-base">
        AI Analysis Begins
      </h3>
      <p className="text-xs md:text-sm text-gray-600">
        Our algorithms analyze <br /> your scan.
      </p>
    </div>

    {/* Step 4 */}
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center gap-3">
      <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-md">
        <FileOutput className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-semibold text-gray-900 text-sm md:text-base">
        Download / View Report
      </h3>
      <p className="text-xs md:text-sm text-gray-600">
        Access your detailed <br /> results.
      </p>
    </div>
  </div>
</section>


          {/* CONTACT SECTION */}
<section id="contact" className="py-16 md:py-20 text-center">
  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
    Contact Us
  </h2>

  <p className="text-gray-600 max-w-lg mx-auto mb-10">
    Reach out for collaborations, research support, enterprise access, or academic use.
  </p>

  <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
    <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3">
        📧
      </div>
      <h3 className="font-semibold text-gray-800 text-lg">Email</h3>
      <p className="text-gray-600 text-sm">support@iads.com</p>
    </div>

    <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3">
        📞
      </div>
      <h3 className="font-semibold text-gray-800 text-lg">Phone</h3>
      <p className="text-gray-600 text-sm">+92 300 1234567</p>
    </div>

    <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-3">
        🏥
      </div>
      <h3 className="font-semibold text-gray-800 text-lg">Institutional Access</h3>
      <p className="text-gray-600 text-sm">Available for hospitals & universities</p>
    </div>
  </div>

  <button
    onClick={() => navigate("/register")}
    className="mt-10 px-10 py-3 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 transition shadow-lg"
  >
    Request Access
  </button>
</section>

        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
