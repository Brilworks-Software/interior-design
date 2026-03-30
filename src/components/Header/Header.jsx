import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, User, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showResourcesMenu, setShowResourcesMenu] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
    setShowUserMenu(false);
  };

  const resources = [
    { label: "Design Guide", path: "/resources/design-guide" },
    { label: "Furniture Library", path: "/resources/furniture" },
    { label: "Color Palettes", path: "/resources/colors" },
    { label: "Tutorials", path: "/resources/tutorials" },
    { label: "FAQ", path: "/resources/faq" },
  ];

  const handleResourceClick = (path) => {
    navigate(path);
    setShowResourcesMenu(false);
  };

  const isActive = (path) => location.pathname === path;
  const isResourceActive = resources.some((r) => isActive(r.path));

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6 flex-1">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">3D</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              3D Room Designer
            </h1>
            <p className="text-xs text-gray-500">Beautiful interior designs</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex items-center gap-1 ml-auto">
          {/* Home Link */}
          <button
            onClick={() => navigate("/")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/")
                ? "text-primary bg-primary/10"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Home
          </button>

          {/* Resources Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowResourcesMenu(!showResourcesMenu)}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-colors ${
                isResourceActive || showResourcesMenu
                  ? "text-primary bg-primary/10"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Resources
              <ChevronDown
                size={16}
                className={`transition-transform ${showResourcesMenu ? "rotate-180" : ""}`}
              />
            </button>

            {/* Resources Dropdown Menu */}
            {showResourcesMenu && (
              <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  {resources.map((resource, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleResourceClick(resource.path)}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        isActive(resource.path)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {resource.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Affiliate Link */}
          <button
            onClick={() => navigate("/affiliate")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive("/affiliate")
                ? "text-primary bg-primary/10"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Affiliate
          </button>
        </nav>
      </div>

      {/* Auth Section */}
      <div className="flex items-center gap-3 ml-6">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-secondary transition-colors"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
