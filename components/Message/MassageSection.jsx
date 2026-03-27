import React, { useEffect, useState } from "react";
import {
  Eye,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Modal (View) State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  // --- Pagination & Search State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    limit: 10,
    page: 1,
  });
  const [searchQuery, setSearchQuery] = useState("");

  const backendApi = import.meta.env.VITE_BACKEND_API;

  // 1. Fetch Messages (Handles both Pagination and Search)
  const fetchMessages = async (page = 1, search = "") => {
    setLoading(true);
    try {
      // Build the URL with page and search query parameters
      let url = `${backendApi}/admin/messages?page=${page}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setMessages(result.data);
        setPaginationInfo(result.pagination);
        setCurrentPage(result.pagination.page);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when page changes or search is submitted
  useEffect(() => {
    fetchMessages(currentPage, searchQuery);
  }, [currentPage]);

  // Handle Search Input (Pressing Enter)
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to page 1 when searching
    fetchMessages(1, searchQuery);
  };

  // Date Formatter
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // 2. View Button Logic (Opens Modal & Marks as Read)
  const handleViewMessage = async (msg) => {
    setSelectedMessage(msg);
    setIsModalOpen(true); // Open the modal immediately for better UX

    // If it is already read, do nothing further
    if (msg.isRead) return;

    try {
      // Update the status on the backend
      const response = await fetch(`${backendApi}/admin/messages/${msg._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        // Instantly update the UI badge from "New" to "Read"
        setMessages((prevMessages) =>
          prevMessages.map((m) =>
            m._id === msg._id ? { ...m, isRead: true } : m,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  // 3. Delete Button Logic
  const handleDeleteClick = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this message?",
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${backendApi}/admin/messages/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        // If we delete the very last item on a page (that isn't page 1), go back a page
        if (messages.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else {
          // Otherwise, re-fetch the current page to pull in the next item from the backend
          fetchMessages(currentPage, searchQuery);
        }
      } else {
        alert("Failed to delete the message. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("A network error occurred while deleting the message.");
    }
  };

  // Pagination Calculations
  const totalPages =
    Math.ceil(paginationInfo.total / paginationInfo.limit) || 1;
  const indexOfFirstMessage = (paginationInfo.page - 1) * paginationInfo.limit;
  const indexOfLastMessage = Math.min(
    indexOfFirstMessage + paginationInfo.limit,
    paginationInfo.total,
  );

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative flex flex-col">
        {/* Header & Search Bar */}
        <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Messages</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your inbox and customer inquiries.
            </p>
          </div>

          <form onSubmit={handleSearch} className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <button type="submit" className="hidden">
              Search
            </button>
          </form>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="p-4 font-semibold">Sender</th>
                <th className="p-4 font-semibold">Subject</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      Loading messages...
                    </div>
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500">
                    No messages found.
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr
                    key={msg._id}
                    className={`border-b border-gray-100 transition-colors ${
                      !msg.isRead
                        ? "bg-blue-50/40 hover:bg-blue-50/70"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="p-4">
                      <p
                        className={`text-gray-900 ${!msg.isRead ? "font-bold" : "font-semibold"}`}
                      >
                        {msg.fullname}
                      </p>
                      <p className="text-xs text-gray-500">{msg.email}</p>
                    </td>
                    <td
                      className={`p-4 truncate max-w-[200px] ${!msg.isRead ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}
                    >
                      {msg.subject}
                    </td>
                    <td className="p-4 whitespace-nowrap text-gray-500 text-xs">
                      {formatDate(msg.createdAt)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full ${
                          !msg.isRead
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {!msg.isRead ? "New" : "Read"}
                      </span>
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                      <button
                        onClick={() => handleViewMessage(msg)}
                        className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="View Message"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(msg._id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete Message"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- Backend Driven Pagination Controls --- */}
        {!loading && paginationInfo.total > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {indexOfFirstMessage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-gray-900">
                {indexOfLastMessage}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">
                {paginationInfo.total}
              </span>{" "}
              entries
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      currentPage === number
                        ? "bg-blue-600 text-white font-medium"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {number}
                  </button>
                ),
              )}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL OVERLAY (VIEW) ================= */}
      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">
                Message Details
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="mb-6">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedMessage.subject}
                </h4>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <div>
                    <span className="font-medium text-gray-900">From:</span>{" "}
                    {selectedMessage.fullname}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Email:</span>{" "}
                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  {selectedMessage.phone && (
                    <div>
                      <span className="font-medium text-gray-900">Phone:</span>{" "}
                      {selectedMessage.phone}
                    </div>
                  )}
                  <div className="w-full mt-1 text-xs text-gray-400">
                    Received on {formatDate(selectedMessage.createdAt)}
                  </div>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed bg-white border border-gray-100 p-5 rounded-xl shadow-sm">
                {selectedMessage.message}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Messages;
