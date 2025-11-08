import {
    BarChart2,
    File,
    FileText,
    HelpCircle,
    Home,
    LogOut,
    PlayCircle,
    Settings,
    Upload,
} from "lucide-react";

export default function AboutHelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col justify-between rounded-r-2xl">
        <div>
          <div className="p-6 flex items-center space-x-2 border-b">
            <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full font-bold text-lg">
              AI
            </div>
            <h1 className="font-semibold text-sm text-gray-700 leading-tight">
              Intracranial Aneurysm Detection System
            </h1>
          </div>

          {/* Navigation */}
          <nav className="mt-6 space-y-1">
            <button className="flex items-center w-full px-6 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
              <Home className="w-4 h-4 mr-3" />
              Dashboard
            </button>
            <button className="flex items-center w-full px-6 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
              <Upload className="w-4 h-4 mr-3" />
              Upload Scan
            </button>
            <button className="flex items-center w-full px-6 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
              <BarChart2 className="w-4 h-4 mr-3" />
              Results
            </button>
            <button className="flex items-center w-full px-6 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
              <FileText className="w-4 h-4 mr-3" />
              Reports
            </button>
            <button className="flex items-center w-full px-6 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </button>
            <button className="flex items-center w-full px-6 py-2 bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600">
              <HelpCircle className="w-4 h-4 mr-3" />
              About & Help
            </button>
          </nav>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex items-center space-x-2 text-gray-500 hover:text-red-500 cursor-pointer transition">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">
          About & Help
        </h2>

        {/* About Section */}
        <section className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            About IADS:
          </h3>
          <p className="text-gray-700 leading-relaxed max-w-3xl">
            IADS is an AI-driven aneurysm application designed to assist
            clinicians in detecting intracranial aneurysms from MRI and CT
            scans. It integrates advanced deep learning models to improve
            diagnostic accuracy and speed—empowering early diagnosis through
            artificial intelligence.
          </p>
        </section>

        {/* Info Boxes */}
        <div className="grid grid-cols-3 gap-4 mb-10 max-w-3xl">
          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <h4 className="text-gray-800 font-medium">Version Info</h4>
            <p className="text-gray-600 text-sm mt-1">
              v1.0 - Prototype 2025
            </p>
          </div>

          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <h4 className="text-gray-800 font-medium">Support Email</h4>
            <a
              href="mailto:help@iads.al"
              className="text-blue-600 text-sm mt-1 inline-block"
            >
              help@iads.al
            </a>
          </div>

          <div className="bg-white border rounded-lg shadow-sm p-4 text-center">
            <h4 className="text-gray-800 font-medium">Credits</h4>
            <p className="text-gray-600 text-sm mt-1">
              Sukkur IBA University <br />
              Department of Computer Science
            </p>
          </div>
        </div>

        {/* Quick Help Section */}
        <div className="grid grid-cols-3 gap-6 max-w-3xl">
          <div className="bg-white border rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer">
            <File className="w-8 h-8 text-blue-600 mb-3" />
            <p className="font-medium text-gray-700">Documentation</p>
          </div>

          <div className="bg-white border rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer">
            <PlayCircle className="w-8 h-8 text-blue-600 mb-3" />
            <p className="font-medium text-gray-700">Tutorials</p>
          </div>

          <div className="bg-white border rounded-xl p-6 flex flex-col items-center hover:shadow-lg transition cursor-pointer">
            <HelpCircle className="w-8 h-8 text-blue-600 mb-3" />
            <p className="font-medium text-gray-700">FAQs</p>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-10 text-center">
          Prototype v1.0 | IADS © 2025
        </p>
      </main>
    </div>
  );
}
