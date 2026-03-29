import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Mail,
  Phone,
  FileText,
  Search,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { menuList } from "../../utils/menuList.jsx";

const Layout = ({ children }) => {
  const location = useLocation();

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-blue-600 text-white shadow-md"
        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
    }`;
  };

  return (
    <div className="w-full h-screen flex bg-gray-50 overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      {/* Changed width from percentages to a fixed width (w-64) for a standard look */}
      <div className="w-64 h-full bg-white border-r border-gray-200 shadow-sm flex flex-col justify-between">
        {/* Top Section of Sidebar */}
        <div>
          {/* Logo section */}
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-blue-700 tracking-wide">
              Kraviona
            </h1>
          </div>

          {/* Menu section */}
          <nav className="p-4 space-y-1.5 overflow-y-auto">
            {menuList.map((menu, id) => {
              return (
                <Link to={menu.href} className={getLinkClass(menu.href)}>
                  {menu.icon}
                  <span className="font-medium">{menu.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section of Sidebar (Settings & Logout) */}
        <div className="p-4 border-t border-gray-100 space-y-1.5">
          <Link to="/settings" className={getLinkClass("/settings")}>
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </Link>

          <button className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 h-full flex flex-col">
        {/* Top Header / Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-8 z-10">
          {/* Left Side: Search Bar */}
          <div className="relative w-72">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm"
            />
          </div>

          {/* Right Side: Notifications & Profile */}
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <button className="text-gray-500 hover:text-blue-600 relative transition-colors">
              <Bell size={22} />
              {/* Notification Dot */}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Profile Section */}
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-sm">
                A
              </div>
              <div className="text-sm hidden md:block">
                <p className="font-semibold text-gray-700 leading-tight">
                  Admin User
                </p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50/50">
          {/* Ye wrapper thoda shadow aur border dega aapke content ko */}
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
