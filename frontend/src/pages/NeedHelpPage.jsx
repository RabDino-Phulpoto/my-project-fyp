import { Book, Mail, Phone } from "lucide-react";

export default function NeedHelpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
        {/* Logo and Title */}
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

        {/* Need Help Section */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Need Help</h2>
        <p className="text-gray-500 text-sm mb-6">
          If you’re experiencing any issues or need assistance,
          please don’t hesitate to reach out to our support team.
        </p>

        {/* Contact Options */}
        <div className="space-y-3">
          <div className="flex items-center bg-blue-600 text-white rounded-lg px-4 py-3 space-x-3 shadow hover:bg-blue-700 transition">
            <Mail className="w-5 h-5" />
            <div className="text-left">
              <p className="font-medium text-sm">Email us</p>
              <p className="text-xs opacity-90">support@example.com</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-600 text-white rounded-lg px-4 py-3 space-x-3 shadow hover:bg-blue-700 transition">
            <Phone className="w-5 h-5" />
            <div className="text-left">
              <p className="font-medium text-sm">Call us</p>
              <p className="text-xs opacity-90">+92 3003488181</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-600 text-white rounded-lg px-4 py-3 space-x-3 shadow hover:bg-blue-700 transition">
            <Book className="w-5 h-5" />
            <div className="text-left">
              <p className="font-medium text-sm">Visit our documentation</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          Prototype v1.0 | IADS © 2025
        </p>
      </div>
    </div>
  );
}
