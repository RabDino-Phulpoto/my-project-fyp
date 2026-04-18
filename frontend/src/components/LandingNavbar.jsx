import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NAV_LINKS = [
  { label: "Home",     href: "#top"      },
  { label: "About",    href: "#about"    },
  { label: "Features", href: "#features" },
  { label: "Contact",  href: "#contact"  },
];

export default function LandingNavbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`w-full sticky top-0 z-30 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-blue-100"
          : "bg-white/80 backdrop-blur border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <a href="#top" className="flex items-center gap-3 group flex-shrink-0">
          <div className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-xl font-bold text-sm shadow-md shadow-blue-200 group-hover:bg-blue-700 transition-colors">
            IA
          </div>
          <span className="font-semibold text-xs sm:text-sm text-gray-800 leading-tight hidden sm:block">
            <span className="text-blue-600 font-bold">IADS</span>
            <span className="text-gray-400 font-normal ml-1 hidden md:inline">
              · Intracranial Aneurysm Detection
            </span>
          </span>
        </a>

        {/* ── Desktop nav links ── */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150 font-medium"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* ── Right side ── */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => navigate("/login")}
            className="hidden sm:block text-sm px-4 py-2 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all font-medium"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/register")}
            className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all font-medium shadow-sm shadow-blue-200"
          >
            Get Started
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen
                ? <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-blue-50 px-4 pb-4 pt-2 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all font-medium"
            >
              {label}
            </a>
          ))}
          <button
            onClick={() => navigate("/login")}
            className="mt-2 text-sm px-4 py-2.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 font-medium w-full"
          >
            Sign In
          </button>
        </div>
      )}
    </header>
  );
}
