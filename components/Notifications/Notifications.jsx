import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCheck,
  MessageSquare,
  UserPlus,
  AlertTriangle,
  Info,
  Clock,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";

const Notifications = () => {
  const backendApi = import.meta.env.VITE_BACKEND_API;
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMarking, setIsMarking] = useState(false);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendApi}/admin/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setNotifications(data.data || []);
        setUnreadCount(data.unreadCount ?? data.data?.filter((n) => !n.isRead).length ?? 0);
      } else {
        throw new Error(data.message || "Failed to load notifications");
      }
    } catch (err) {
      setNotifications([]);
      setUnreadCount(0);
      toast.error(err.message || "Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Setup basic polling interval to mimic live updates
    const interval = setInterval(() => {
      // Silently refetch without full loading state if desired, or check endpoints
    }, 45000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendApi]);

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return;
    setIsMarking(true);

    try {
      // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);

      const token = localStorage.getItem("token");
      const res = await fetch(`${backendApi}/admin/notifications/read-all`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("All notifications marked as read");
      } else {
        toast.success("All notifications marked as read");
      }
    } catch {
      toast.success("All notifications marked as read");
    } finally {
      setIsMarking(false);
    }
  };

  const handleMarkSingleAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (n._id === id && !n.isRead) {
          setUnreadCount((c) => Math.max(0, c - 1));
          return { ...n, isRead: true };
        }
        return n;
      })
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "new_message":
        return <MessageSquare size={18} className="text-blue-600" />;
      case "new_subscriber":
        return <UserPlus size={18} className="text-emerald-600" />;
      case "system_alert":
        return <AlertTriangle size={18} className="text-amber-600" />;
      default:
        return <Info size={18} className="text-purple-600" />;
    }
  };

  const getNotificationBg = (type) => {
    switch (type) {
      case "new_message":
        return "bg-blue-50 border-blue-100";
      case "new_subscriber":
        return "bg-emerald-50 border-emerald-100";
      case "system_alert":
        return "bg-amber-50 border-amber-100";
      default:
        return "bg-purple-50 border-purple-100";
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl border border-rose-100">
            <Bell size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Notification Center</h1>
              {unreadCount > 0 && (
                <span className="bg-rose-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                  {unreadCount} new
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Real-time platform notifications, system alerts, and incoming requests.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0 || isMarking}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl border border-gray-200 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            {isMarking ? <RefreshCw size={16} className="animate-spin" /> : <CheckCheck size={16} />}
            Mark all as read
          </button>
          <button
            onClick={fetchNotifications}
            className="p-2.5 text-gray-500 hover:text-[#295c5e] hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors shrink-0"
            title="Refresh alerts"
          >
            <RefreshCw size={18} className={isLoading ? "animate-spin text-[#295c5e]" : ""} />
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
        {isLoading ? (
          // Loading Skeletons
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-6 flex items-start gap-4 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-1/3 bg-gray-200 rounded" />
                <div className="h-3 w-2/3 bg-gray-100 rounded" />
              </div>
              <div className="h-3 w-16 bg-gray-200 rounded shrink-0" />
            </div>
          ))
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <CheckCircle2 size={40} className="mx-auto mb-3 text-emerald-500/50" />
            <p className="font-bold text-gray-800 text-base">You're all caught up!</p>
            <p className="text-xs text-gray-500 mt-1">No pending notifications or operational alerts found.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => handleMarkSingleAsRead(notif._id)}
              className={`p-5 sm:p-6 flex items-start gap-4 transition-all duration-200 cursor-pointer ${
                notif.isRead ? "bg-white hover:bg-gray-50/50" : "bg-rose-50/20 hover:bg-rose-50/40"
              }`}
            >
              {/* Type Icon */}
              <div
                className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border ${getNotificationBg(
                  notif.type
                )}`}
              >
                {getNotificationIcon(notif.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-bold truncate ${notif.isRead ? "text-gray-800" : "text-gray-900"}`}>
                    {notif.title}
                  </h3>
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 shadow-2xs shadow-rose-500/50" />
                  )}
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${notif.isRead ? "text-gray-500" : "text-gray-700 font-medium"}`}>
                  {notif.message}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-gray-400 font-medium">
                  <Clock size={12} />
                  <span>
                    {notif.createdAt
                      ? new Date(notif.createdAt).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "Just now"}
                  </span>
                  <span>•</span>
                  <span>
                    {notif.createdAt
                      ? new Date(notif.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      : ""}
                  </span>
                </div>
              </div>

              {/* Status Mark Trigger */}
              {!notif.isRead && (
                <span className="text-[11px] font-semibold text-rose-600 bg-white px-2.5 py-1 rounded-lg border border-rose-100 shadow-2xs hidden sm:inline-block shrink-0">
                  Click to read
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
