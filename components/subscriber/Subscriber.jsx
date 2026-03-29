import React, { useEffect, useState } from "react";
import {
  Search,
  Loader2,
  Mail,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "react-toastify";

const Subscriber = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
  });

  const fetchSubscribers = async (pageNumber = 1) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/subscribers?page=${pageNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        setSubscribers(data.subscribers || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } else {
        toast.error(data.message || "Failed to fetch subscribers");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers(pagination.page);
  }, [pagination.page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subscriber?"))
      return;

    try {
      setIsActionLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/subscribers/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Subscriber deleted successfully");
        fetchSubscribers(pagination.page);
      } else {
        toast.error(data.message || "Failed to delete subscriber");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred");
    } finally {
      setIsActionLoading(false);
    }
  };

  const getStatusStyles = (status) => {
    const s = status?.toLowerCase();
    if (s === "subscriber" || s === "subscribed" || s === "active") {
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    }
    return "bg-rose-100 text-rose-700 border-rose-200";
  };

  const filteredSubscribers = subscribers.filter((sub) =>
    sub.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative flex flex-col">
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white/50 backdrop-blur-xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
              Newsletter Subscribers
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              View and manage your email subscriber list
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search current page..."
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
                <th className="p-5">Subscriber Email</th>
                <th className="p-5">Subscription Date</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right w-32">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-600 text-sm divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center h-64">
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-[#295c5e]" />
                      <p className="text-sm font-medium">
                        Loading subscribers...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center h-64">
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                        <Mail className="w-8 h-8 text-gray-300" />
                      </div>
                      <p className="text-base font-medium text-gray-600">
                        No subscribers found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber, index) => (
                  <tr
                    key={subscriber._id || subscriber.id || index}
                    className="hover:bg-gray-50/80 transition-colors group cursor-default"
                  >
                    <td className="p-5 text-center font-medium text-gray-400">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#295c5e]/10 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-4 h-4 text-[#295c5e]" />
                        </div>
                        <span className="font-medium text-gray-800 text-base">
                          {subscriber.email}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">
                          {new Date(subscriber.createdAt).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(subscriber.createdAt).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${getStatusStyles(
                          subscriber.status,
                        )}`}
                      >
                        {subscriber.status || "Unknown"}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            handleDelete(subscriber._id || subscriber.id)
                          }
                          disabled={isActionLoading}
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!isLoading && pagination.total > 0 && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {pagination.total}
              </span>{" "}
              entries
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      onClick={() => handlePageChange(num)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        pagination.page === num
                          ? "bg-[#295c5e] text-white shadow-sm shadow-[#295c5e]/20"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {num}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === totalPages}
                className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscriber;
