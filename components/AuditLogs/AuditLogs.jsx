import { Search, Loader2, ShieldAlert } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/admin/audit-logs`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setLogs(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch audit logs");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) =>
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.resource?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative flex flex-col">
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white/50 backdrop-blur-xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Audit Logs</h2>
            <p className="text-sm text-gray-500 mt-1">Monitor system activities and administrative actions</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search logs..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 focus:border-[#295c5e] transition-all outline-none"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="p-5 w-16 text-center">No.</th>
                <th className="p-5">Action Details</th>
                <th className="p-5">Resource</th>
                <th className="p-5">User</th>
                <th className="p-5 text-right">Timestamp</th>
              </tr>
            </thead>

            <tbody className="text-gray-600 text-sm divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center h-64">
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-[#295c5e]" />
                      <p className="text-sm font-medium">Loading logs...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center h-64">
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-3">
                      <ShieldAlert className="w-8 h-8 text-gray-300" />
                      <p className="text-base font-medium text-gray-600">No logs found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => (
                  <tr key={log._id || index} className="hover:bg-gray-50/80 transition-colors group cursor-default">
                    <td className="p-5 text-center font-medium text-gray-400">
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-semibold text-gray-800 capitalize text-base">{log.action}</p>
                          <p className="text-xs text-gray-500 mt-0.5 max-w-[250px] truncate">{log.details}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="font-medium text-gray-700">{log.resource}</span>
                    </td>
                    <td className="p-5">
                      <span className="text-gray-600">{log.user?.name || log.userId || "System"}</span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex flex-col items-end">
                        <span className="font-medium text-gray-700">
                          {log.createdAt ? new Date(log.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {log.createdAt ? new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;
