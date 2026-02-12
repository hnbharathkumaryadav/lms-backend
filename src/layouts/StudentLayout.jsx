import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function StudentLayout({ children }) {
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const menuItems = [
    { title: "Dashboard", path: "/student/dashboard", icon: "📊", desc: "Overview & Analytics" },
    { title: "Browse Courses", path: "/courses", icon: "🔍", desc: "Discover New Courses" },
    { title: "My Learning", path: "/student/learning", icon: "📚", desc: "Your Courses & Progress" },
    { title: "Certificates", path: "/student/certificates", icon: "📜", desc: "Earned Certifications" },
    { title: "Community Forum", path: "/student/forum", icon: "💬", desc: "Discuss & Learn" },
  ];

  const userData = localStorage.getItem("userData");
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Sidebar */}
      <div
        className={`bg-white/95 backdrop-blur-xl w-80 shadow-2xl fixed lg:sticky lg:top-0 lg:h-screen transform transition-all duration-500 z-50 border-r border-gray-200/60 flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="p-6 border-b border-gray-200/60 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🎓</span>
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Learnix</h2>
              <p className="text-xs text-gray-500 font-medium">Student Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-6 space-y-3 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`group flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border border-transparent ${location.pathname === item.path
                ? "bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg border-blue-200 text-blue-700"
                : "text-gray-600 hover:bg-white hover:shadow-lg hover:text-gray-900"
                }`}
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{item.icon}</span>
              <div className="flex-1">
                <span className="font-semibold block leading-tight">{item.title}</span>
                <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">{item.desc}</span>
              </div>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-200/60 bg-white/80 mt-auto">
          <Link
            to="/student/profile"
            className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-slate-100 to-blue-50 rounded-2xl hover:bg-blue-100 transition-all group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-sm">{user?.username?.charAt(0) || "S"}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-sm truncate group-hover:text-blue-600">{user?.username || "Student"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
            </div>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group"
          >
            <span className="text-lg group-hover:scale-110 transition-transform">🚪</span>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 min-w-0 flex flex-col">
        <header className={`bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-40 transition-all ${scrolled ? "shadow-lg" : "shadow-sm"}`}>
          <div className="flex justify-between items-center p-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 rounded-2xl hover:bg-gray-100 lg:hidden transition-all">
                <span className="text-xl">☰</span>
              </button>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Welcome back, {user?.username || "Student"}! 👋
                </h1>
              </div>
            </div>

            <div className="relative">
              <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-100 transition-all group border border-transparent hover:border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                  <span className="text-white font-bold text-sm">{user?.username?.charAt(0) || "S"}</span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="font-semibold text-gray-800 text-sm">{user?.username || "Student"}</p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-14 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/60 min-w-64 py-3 z-50 animate-in">
                  <div className="px-4 py-3 border-b border-gray-200/60">
                    <p className="font-bold text-gray-900">{user?.username || "Student"}</p>
                    <p className="text-sm text-gray-500 truncate">{user?.email || ""}</p>
                  </div>
                  <Link to="/student/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 transition-all group" onClick={() => setShowDropdown(false)}>
                    <span className="text-lg group-hover:scale-110 transition-transform">👤</span>
                    <span>My Profile</span>
                  </Link>

                  <div className="border-t border-gray-200/60 mt-2 pt-2">
                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-all group">
                      <span className="text-lg group-hover:scale-110 transition-transform">🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {isSidebarOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
