import { useNavigate } from "react-router-dom";

export default function LandingNavbar() {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white/80 backdrop-blur border-b sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold text-lg">
            AI
          </div>
          <h1 className="font-semibold text-sm text-gray-800">
            INTRACRANIAL ANEURYSM DETECTION SYSTEM
          </h1>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm text-gray-700">
          <a href="#top" className="hover:text-blue-600">Home</a>
          <a href="#about" className="hover:text-blue-600">About</a>
          <a href="#features" className="hover:text-blue-600">Features</a>
          <a href="#contact" className="hover:text-blue-600">Contact</a>
        </nav>

        {/* Right side buttons */}
        <button
          onClick={() => navigate("/login")}
          className="text-sm px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
        >
          Login
        </button>

      </div>
    </header>
  );
}
