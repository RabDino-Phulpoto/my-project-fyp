const FOOTER_LINKS = [
  { label: "Home",     href: "#top"      },
  { label: "About",    href: "#about"    },
  { label: "Features", href: "#features" },
  { label: "Contact",  href: "#contact"  },
];

export default function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-blue-100 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-xl font-bold text-sm shadow-sm shadow-blue-200">
              IA
            </div>
            <div>
              <p className="font-bold text-sm text-gray-800">IADS</p>
              <p className="text-xs text-gray-400">Intracranial Aneurysm Detection System</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {FOOTER_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>Prototype v1.0 &nbsp;·&nbsp; © {year} IADS. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Built for clinical research &nbsp;·&nbsp;
            <span className="text-blue-400">Not for diagnostic use</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
