import React, { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Save,
  ShieldCheck,
  Globe,
  Mail,
  Smartphone,
} from "lucide-react";
import { toast } from "react-toastify";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    siteName: "My Admin Dashboard",
    contactEmail: "admin@example.com",
    supportPhone: "+1 (555) 123-4567",
    maintenanceMode: false,
    emailAlerts: true,
    pushNotifications: false,
    twoFactorAuth: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: <User size={18} /> },
    { id: "security", label: "Security", icon: <Lock size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          Platform Settings
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your global platform configurations and preferences
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
            <nav className="flex flex-col p-2 gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-[#295c5e]/10 text-[#295c5e]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
            <div className="p-6 sm:p-8">
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      General Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Globe size={16} className="text-gray-400" /> Site
                          Name
                        </label>
                        <input
                          type="text"
                          name="siteName"
                          value={formData.siteName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 focus:border-[#295c5e] transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" /> Contact
                          Email
                        </label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 focus:border-[#295c5e] transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Smartphone size={16} className="text-gray-400" />{" "}
                          Support Phone
                        </label>
                        <input
                          type="text"
                          name="supportPhone"
                          value={formData.supportPhone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 focus:border-[#295c5e] transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-100 my-6" />

                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      System Status
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-medium text-gray-800">
                          Maintenance Mode
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Display a temporary maintenance page to all visitors.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="maintenanceMode"
                          checked={formData.maintenanceMode}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#295c5e]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <ShieldCheck size={20} className="text-emerald-500" />{" "}
                      Security Preferences
                    </h3>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 mb-6">
                      <div>
                        <p className="font-medium text-gray-800">
                          Two-Factor Authentication (2FA)
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Require an extra security code when logging in.
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="twoFactorAuth"
                          checked={formData.twoFactorAuth}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#295c5e]"></div>
                      </label>
                    </div>

                    <div className="space-y-4 max-w-md">
                      <h4 className="text-sm font-bold text-gray-700">
                        Change Password
                      </h4>
                      <div className="space-y-2">
                        <input
                          type="password"
                          placeholder="Current Password"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 focus:border-[#295c5e] transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <input
                          type="password"
                          placeholder="New Password"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 focus:border-[#295c5e] transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 focus:border-[#295c5e] transition-all outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      Notification Settings
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">
                            Email Alerts
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Receive daily summary emails and urgent alerts.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="emailAlerts"
                            checked={formData.emailAlerts}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#295c5e]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                          <p className="font-medium text-gray-800">
                            Push Notifications
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Get desktop notifications for real-time events.
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="pushNotifications"
                            checked={formData.pushNotifications}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#295c5e]"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 bg-[#295c5e] hover:bg-[#1f4547] disabled:opacity-70 disabled:cursor-not-allowed transition-colors py-2.5 px-6 rounded-xl text-white font-medium shadow-sm shadow-[#295c5e]/20"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                <span>{isSaving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
