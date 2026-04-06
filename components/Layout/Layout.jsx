import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { menuList } from "../../utils/menuList.jsx"; // Adjust path if necessary

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Used for the logout redirect

  // Improved to keep menu active even on sub-routes (e.g., /posts/new)
  const getLinkClass = (path) => {
    const isActive =
      path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(path);

    return `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive
        ? "bg-[#295c5e] text-white shadow-lg shadow-[#295c5e]/20"
        : "text-gray-500 hover:bg-gray-100 hover:text-[#295c5e]"
    }`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="w-full h-screen flex bg-[#f8fafc] overflow-hidden font-sans">
      {/* ================= SIDEBAR OVERLAY (Mobile) ================= */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close Sidebar"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#295c5e] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              Kraviona
            </h1>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
            Main Menu
          </p>
          {menuList.map((menu) => {
            const isActive =
              menu.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(menu.href);

            return (
              <Link
                key={menu.href}
                to={menu.href}
                className={getLinkClass(menu.href)}
                onClick={() => setIsSidebarOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <span className="shrink-0">{menu.icon}</span>
                  <span className="font-semibold text-sm">{menu.name}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-100 space-y-1 shrink-0">
          <Link
            to="/settings"
            className={getLinkClass("/settings")}
            onClick={() => setIsSidebarOpen(false)}
          >
            <div className="flex items-center gap-3">
              <Settings size={20} />
              <span className="font-semibold text-sm">Settings</span>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            >
              <Menu size={24} />
            </button>

            {/* Search Bar */}
            <div className="relative hidden sm:block group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#295c5e] transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search analytics..."
                className="w-64 lg:w-80 pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 transition-all text-sm outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl relative transition-all">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>

            {/* Profile */}
            <button className="flex items-center gap-3 p-1 pr-3 hover:bg-gray-100 rounded-xl transition-all group">
              <div className="w-10 h-10 bg-[#295c5e] text-white rounded-xl flex items-center justify-center font-bold shadow-md shadow-[#295c5e]/20 group-hover:scale-105 transition-transform">
                A
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-bold text-gray-800 leading-none mb-1">
                  Amar Kumar
                </p>
                <p className="text-[11px] font-medium text-gray-500 uppercase tracking-tighter">
                  Admin Panel
                </p>
              </div>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
