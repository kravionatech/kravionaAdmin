import { Activity, Users, Eye, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [realtime, setRealtime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const [overviewRes, realtimeRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_BACKEND_API}/admin/analytics/overview?from=2025-01-01`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        fetch(`${import.meta.env.VITE_BACKEND_API}/admin/analytics/realtime`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
      ]);

      const overviewData = await overviewRes.json();
      const realtimeData = await realtimeRes.json();

      if (overviewData.success) setOverview(overviewData.data);
      if (realtimeData.success) setRealtime(realtimeData.data?.activeVisitors || 0);
    } catch {
      toast.error("Failed to load analytics");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Poll realtime every 30s
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_API}/admin/analytics/realtime`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = await res.json();
        if (data.success) setRealtime(data.data?.activeVisitors || 0);
      } catch { /* ignore */ }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#295c5e]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Analytics Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Monitor your website traffic and user engagement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Views</p>
              <h3 className="text-3xl font-bold text-gray-800">{overview?.views || 0}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Eye size={20} />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className={`flex items-center font-medium ${(overview?.pctChange || 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {(overview?.pctChange || 0) >= 0 ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
              {Math.abs(overview?.pctChange || 0)}%
            </span>
            <span className="text-gray-400 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Unique Visitors</p>
              <h3 className="text-3xl font-bold text-gray-800">{overview?.visitors || 0}</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="flex items-center font-medium text-emerald-500">
              <ArrowUpRight size={16} className="mr-1" />
              12%
            </span>
            <span className="text-gray-400 ml-2">vs last month</span>
          </div>
        </div>

        <div className="bg-[#295c5e] rounded-2xl p-6 border border-[#295c5e] shadow-lg shadow-[#295c5e]/20 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Activity size={100} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-medium text-white/80 mb-1">Realtime Active</p>
                <div className="flex items-center gap-3">
                  <h3 className="text-4xl font-bold">{realtime}</h3>
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
              </div>
            </div>
            <p className="text-sm text-white/70 mt-2">Active visitors on site right now</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Top Pages</h3>
          <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-100 rounded-xl">
            <p className="text-gray-400 text-sm">Traffic chart will render here</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Device Breakdown</h3>
          <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-100 rounded-xl">
            <p className="text-gray-400 text-sm">Device analytics chart will render here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
