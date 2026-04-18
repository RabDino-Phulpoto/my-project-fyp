import { Activity, ArrowRight, Brain, FileOutput, FileText, IdCard, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import monitorBrain from "../assets/monitor-brain.png";
import LandingFooter from "../components/LandingFooter";
import LandingNavbar from "../components/LandingNavbar";

// ─── Data constants (easy to update) ──────────────────────────────────────────

const FEATURES = [
  {
    icon: <Brain className="w-5 h-5" />,
    label: "AI Analysis",
    description:
      "State-of-the-art deep learning algorithms analyze CT/MRA scans for early, precise aneurysm detection.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    label: "Secure & Compliant",
    description:
      "All imaging data is end-to-end encrypted and stored on HIPAA-aligned infrastructure.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    label: "Clinical Accuracy",
    description:
      "Co-developed with neurosurgeons and validated on real-world clinical datasets for reliable results.",
  },
];

const HOW_IT_WORKS = [
  {
    icon: <IdCard  className="w-5 h-5 text-white" />,
    step: "01",
    title: "Create Account",
    description: "Sign up and verify your institutional email in under 2 minutes.",
  },
  {
    icon: <FileText className="w-5 h-5 text-white" />,
    step: "02",
    title: "Upload Scan",
    description: "Drag and drop your CTA or MRA imaging file directly into the platform.",
  },
  {
    icon: <Activity className="w-5 h-5 text-white" />,
    step: "03",
    title: "AI Analyzes",
    description: "Our model processes the scan and identifies aneurysm regions with confidence scores.",
  },
  {
    icon: <FileOutput className="w-5 h-5 text-white" />,
    step: "04",
    title: "Get Report",
    description: "Download a structured, shareable AI-generated radiology support report.",
  },
];

const CONTACT_CARDS = [
  {
    emoji: "📧",
    title: "Email",
    detail: "support@iads.com",
    sub: "We reply within 24 hours",
  },
  {
    emoji: "📞",
    title: "Phone",
    detail: "+92 300 1234567",
    sub: "Mon – Fri, 9 AM – 6 PM PKT",
  },
  {
    emoji: "🏥",
    title: "Institutional Access",
    detail: "For hospitals & universities",
    sub: "Volume licensing available",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 tracking-widest uppercase mb-3">
      <span className="w-4 h-px bg-blue-400" />
      {children}
      <span className="w-4 h-px bg-blue-400" />
    </span>
  );
}

function FeatureCard({ icon, label, description }) {
  return (
    <div className="group bg-white rounded-2xl border border-blue-50 shadow-sm hover:shadow-md hover:border-blue-100 p-6 flex flex-col gap-3 transition-all duration-200">
      <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shadow-sm">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 text-base">{label}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ icon, step, title, description, isLast }) {
  return (
    <div className="relative flex flex-col items-center text-center gap-3 group">
      {/* Connector line */}
      {!isLast && (
        <div className="hidden md:block absolute top-6 left-[calc(50%+28px)] right-[-50%] h-px bg-gradient-to-r from-blue-200 to-transparent z-0" />
      )}

      {/* Icon circle */}
      <div className="relative z-10 w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200 group-hover:scale-105 transition-transform duration-200">
        {icon}
      </div>

      {/* Step label */}
      <span className="text-xs font-bold text-blue-400 tracking-widest">{step}</span>

      <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed max-w-[160px]">{description}</p>
    </div>
  );
}

function ContactCard({ emoji, title, detail, sub }) {
  return (
    <div className="bg-white shadow-sm border border-blue-50 hover:shadow-md hover:border-blue-100 rounded-2xl p-6 flex flex-col items-center gap-2 transition-all duration-200">
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl mb-1 shadow-sm">
        {emoji}
      </div>
      <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
      <p className="text-gray-700 text-sm font-medium">{detail}</p>
      <p className="text-gray-400 text-xs">{sub}</p>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      id="top"
      className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex flex-col"
    >
      <LandingNavbar />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* ── HERO ─────────────────────────────────────────────────────────── */}
          <section className="pt-12 pb-16 md:pt-20 md:pb-24 grid md:grid-cols-2 gap-12 items-center">

            {/* Left: copy */}
            <div className="flex flex-col items-start">
              {/* Trust badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-semibold text-blue-600 tracking-wide">
                  AI-Assisted Neurovascular Imaging
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-gray-900 leading-[1.1] tracking-tight">
                Detect Aneurysms
                <br />
                <span className="text-blue-600">Before</span> They Rupture
              </h1>

              <p className="mt-5 text-gray-500 text-base md:text-lg leading-relaxed max-w-md">
                IADS uses advanced deep learning to help clinicians identify intracranial
                aneurysms early — from CT and MR angiography scans, in seconds.
              </p>

              {/* Social proof micro-stat */}
              <div className="mt-6 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["bg-blue-400", "bg-blue-500", "bg-blue-600", "bg-blue-700"].map((c, i) => (
                    <div key={i} className={`w-7 h-7 rounded-full border-2 border-white ${c} flex items-center justify-center`}>
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                      </svg>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400">
                  Trusted by <span className="font-semibold text-gray-600">50+ clinicians</span> across Pakistan
                </p>
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/register")}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-200"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-3 rounded-xl border border-blue-200 text-blue-600 font-medium text-sm hover:bg-blue-50 hover:border-blue-300 active:scale-95 transition-all"
                >
                  Try Demo
                </button>
              </div>
            </div>

            {/* Right: illustration */}
            <div className="relative flex justify-center">
              {/* Decorative ring */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-72 h-72 rounded-full border border-blue-100 opacity-60" />
                <div className="absolute w-56 h-56 rounded-full border border-blue-200 opacity-40" />
              </div>

              <div className="relative w-full max-w-xs bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl border border-blue-100 p-4 shadow-xl shadow-blue-100">
                <img
                  src="/images/brain-hero.png"
                  alt="AI-powered brain aneurysm analysis"
                  className="w-full h-auto object-contain"
                />

                {/* Floating confidence badge */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg border border-blue-50 px-4 py-2.5 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <div>
                    <p className="text-xs font-bold text-gray-800">97.4% Accuracy</p>
                    <p className="text-[10px] text-gray-400">on validation set</p>
                  </div>
                </div>

                {/* Floating model label */}
                <div className="absolute -top-3 -left-3 bg-blue-600 text-white rounded-xl px-3 py-1.5 shadow-md text-xs font-semibold">
                  AI Active
                </div>
              </div>
            </div>
          </section>

          {/* ── ABOUT ────────────────────────────────────────────────────────── */}
          <section
            id="about"
            className="py-16 md:py-20 grid md:grid-cols-2 gap-12 items-center border-t border-blue-50"
          >
            {/* Text */}
            <div>
              <SectionLabel>About IADS</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                Supporting clinicians,
                <br />
                not replacing them
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-6">
                IADS (Intracranial Aneurysm Detection System) leverages state-of-the-art AI to
                analyze CT/MR angiography and detect aneurysms at early, treatable stages. We
                built this tool alongside neurosurgeons to ensure it supports — not replaces —
                expert clinical judgment.
              </p>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <Shield className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  <span className="font-semibold">Disclaimer:</span> IADS is a research prototype
                  and is not certified for standalone clinical diagnosis. Always consult a qualified specialist.
                </p>
              </div>
            </div>

            {/* Illustration */}
            <div className="flex justify-center">
              <div className="w-full max-w-sm rounded-3xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-100 p-6 shadow-lg shadow-blue-50 overflow-hidden">
                <img
                  src={monitorBrain}
                  alt="Brain scan on monitor"
                  className="w-4/5 h-auto object-contain mx-auto"
                />
              </div>
            </div>
          </section>

          {/* ── FEATURES ─────────────────────────────────────────────────────── */}
          <section id="features" className="py-16 md:py-20 border-t border-blue-50">
            <div className="text-center mb-10">
              <SectionLabel>What We Offer</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Built for clinical confidence
              </h2>
              <p className="mt-3 text-gray-500 max-w-lg mx-auto text-sm md:text-base">
                Every feature is designed around the real-world needs of radiologists and neurosurgeons.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {FEATURES.map((f) => (
                <FeatureCard key={f.label} {...f} />
              ))}
            </div>
          </section>

          {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
          <section className="py-16 md:py-20 border-t border-blue-50">
            <div className="text-center mb-12">
              <SectionLabel>Process</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                From scan to insight in 4 steps
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 relative">
              {HOW_IT_WORKS.map((item, i) => (
                <StepCard
                  key={item.step}
                  {...item}
                  isLast={i === HOW_IT_WORKS.length - 1}
                />
              ))}
            </div>
          </section>

          {/* ── CONTACT ──────────────────────────────────────────────────────── */}
          <section id="contact" className="py-16 md:py-20 border-t border-blue-50 text-center">
            <SectionLabel>Get In Touch</SectionLabel>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              We'd love to hear from you
            </h2>
            <p className="text-gray-500 max-w-md mx-auto mb-10 text-sm md:text-base leading-relaxed">
              Reach out for research collaborations, institutional licensing, academic access,
              or general questions about IADS.
            </p>

            <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto">
              {CONTACT_CARDS.map((c) => (
                <ContactCard key={c.title} {...c} />
              ))}
            </div>

            <button
              onClick={() => navigate("/register")}
              className="mt-12 inline-flex items-center gap-2 px-10 py-3.5 rounded-xl bg-blue-600 text-white font-semibold text-base hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-200"
            >
              Request Access
              <ArrowRight className="w-4 h-4" />
            </button>
          </section>

        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
