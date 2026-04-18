import { ChevronRight } from "lucide-react";

export default function QuickActionCard({ icon: Icon, title, description, onClick, color = "blue" }) {
  const colorClasses = {
    blue: "hover:bg-blue-50 border-blue-200",
    green: "hover:bg-green-50 border-green-200",
    purple: "hover:bg-purple-50 border-purple-200",
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-2xl p-6 border border-gray-200 ${colorClasses[color]} transition-all duration-200 hover:border-gray-300 group`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Icon className="w-5 h-5 text-gray-600" />
            <h4 className="font-semibold text-gray-900">{title}</h4>
          </div>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
      </div>
    </button>
  );
}
