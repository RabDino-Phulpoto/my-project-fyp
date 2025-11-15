import { useNavigate } from "react-router-dom";

export default function LandingNavbar() {
  const navigate = useNavigate();

  return (
    <header className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
         <div className="p-6 flex items-center space-x-2 border-b">
          <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold text-lg">
            AI
          </div>
          <h1 className="font-semibold text-sm text-gray-700 leading-tight">
            INTRACRANIAL ANEURYSM DETECTION SYSTEM
          </h1>
        </div>
       {/**
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            AI
          </div>
          <span className="hidden sm:block text-sm font-semibold text-gray-800">
            IADS
          </span>
        </div>
           */}
           
        {/* Center nav links (scroll to sections on same page) */}
        <nav className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
          <a href="#top" className="hover:text-blue-600">
            Home
          </a>
          <a href="#about" className="hover:text-blue-600">
            About
          </a>
          <a href="#features" className="hover:text-blue-600">
            Features
          </a>
          <a href="#contact" className="hover:text-blue-600">
            Contact
          </a>
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate("/login")}
            className="text-sm px-4 py-2 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition"
          >
            Login
          </button>
        </div>
      </div>
    </header>
  );
}
