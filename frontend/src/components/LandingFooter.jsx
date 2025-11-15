export default function LandingFooter() {
  return (
    <footer className="mt-16 border-t bg-white">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-gray-400">
        Prototype v1.0 | IADS © {new Date().getFullYear()} | Intracranial Aneurysm Detection System
      </div>
    </footer>
  );
}
