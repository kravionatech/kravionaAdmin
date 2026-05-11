import React, { useState, useEffect, useRef } from "react";
import {
  Image as ImageIcon,
  Film,
  FileText,
  Trash2,
  Edit,
  Plus,
  Search,
  Loader2,
  X,
  Upload,
} from "lucide-react";
import { toast } from "react-toastify";

const MediaLibrary = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [editModal, setEditModal] = useState({ isOpen: false, file: null });

  // Upload Form States
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadFilename, setUploadFilename] = useState("");
  const [uploadAltText, setUploadAltText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // ==========================================
  // 1. READ: Fetch All Media
  // ==========================================
  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/files`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      const data = await response.json();
      if (data.success) {
        setFiles(data.files || []);
      }
    } catch {
      toast.error("Failed to fetch media files");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // ==========================================
  // 2. CREATE: Upload Media (Floating Version)
  // ==========================================
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) return toast.error("Please select a file");

    // Close the modal immediately so user can do other things
    setIsUploadOpen(false);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("filename", uploadFilename || uploadFile.name);
    formData.append("altText", uploadAltText);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        },
      );
      const data = await response.json();

      if (data.success) {
        toast.success("File uploaded successfully");
        setFiles((prev) => [data.data, ...prev]);

        // Reset states after successful upload
        setUploadFile(null);
        setUploadFilename("");
        setUploadAltText("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch {
      toast.error("Network error during upload");
    } finally {
      // Hide the floating progress bar
      setIsUploading(false);
    }
  };

  // ==========================================
  // 3. UPDATE: Edit Media
  // ==========================================
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/files/${editModal.file._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            filename: editModal.file.filename,
            altText: editModal.file.altText || "",
          }),
        },
      );
      const data = await response.json();

      if (data.success) {
        toast.success("Media updated successfully");
        setFiles((prev) =>
          prev.map((f) => (f._id === editModal.file._id ? data.data : f)),
        );
        setEditModal({ isOpen: false, file: null });
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Update failed");
    }
  };

  // ==========================================
  // 4. DELETE: Remove Media
  // ==========================================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/files/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      const data = await response.json();
      if (data.success) {
        toast.success("Deleted successfully");
        setFiles((prev) => prev.filter((f) => f._id !== id));
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  // Helpers
  const getFileCategory = (format) => {
    const fmt = format?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "webp", "gif"].includes(fmt)) return "image";
    if (["mp4", "webm"].includes(fmt)) return "video";
    return "other";
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.filename
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || getFileCategory(file.format) === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 relative">
      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 rounded-3xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 transition-all">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Media Library
          </h2>
          <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            Manage and organize your digital assets
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="relative group w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-[#295c5e] transition-colors" />
            <input
              type="text"
              placeholder="Search files by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-2xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-[#295c5e]/10 focus:border-[#295c5e] transition-all"
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#295c5e] hover:bg-[#1f4547] text-white py-3 px-6 rounded-2xl font-bold shadow-lg shadow-[#295c5e]/20 transition-all active:scale-95 group"
          >
            <Plus
              size={20}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            <span>Upload Media</span>
          </button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap items-center gap-3 mb-8 bg-gray-100/50 p-1.5 rounded-[20px] w-fit">
        {["all", "image", "video"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-6 py-2.5 rounded-[14px] text-sm font-bold capitalize transition-all duration-300 ${
              activeFilter === tab
                ? "bg-white text-[#295c5e] shadow-sm ring-1 ring-black/5"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-2">
              {tab === "all" && (
                <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
              )}
              {tab}
            </div>
          </button>
        ))}
      </div>

      {/* MEDIA GRID & LOADER */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm animate-pulse"
            >
              <div className="aspect-square bg-gray-200"></div>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded-md w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">No media found</h3>
          <p className="text-gray-500 mt-2 max-w-xs">
            Try adjusting your search or upload your first file to see it here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredFiles.map((file) => (
            <div
              key={file._id}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-square bg-gray-50 overflow-hidden">
                {getFileCategory(file.format) === "image" ? (
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-2">
                    <FileText className="text-[#295c5e]/40" size={40} />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {file.format}
                    </span>
                  </div>
                )}

                {/* Hover Overlay with Glassmorphism */}
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all duration-300">
                  <button
                    onClick={() => setEditModal({ isOpen: true, file })}
                    className="p-3 bg-white hover:bg-[#295c5e] hover:text-white text-gray-700 rounded-xl shadow-lg transition-all transform hover:scale-110"
                    title="Edit Details"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="p-3 bg-white hover:bg-rose-500 hover:text-white text-gray-700 rounded-xl shadow-lg transition-all transform hover:scale-110"
                    title="Delete File"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* Format Badge */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur shadow-sm rounded-lg text-[10px] font-bold text-gray-700 uppercase">
                  {file.format}
                </div>
              </div>

              {/* Info Area */}
              <div className="p-4 bg-white">
                <p
                  className="text-sm font-bold text-gray-800 truncate"
                  title={file.filename}
                >
                  {file.filename}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[10px] font-medium text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                  <p className="text-[10px] font-medium text-gray-400">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================== */}
      {/* FLOATING UPLOAD STATUS CARD */}
      {/* ========================================== */}
      {isUploading && (
        <div className="fixed bottom-6 right-6 z-[60] animate-in slide-in-from-right-full duration-500">
          <div className="bg-white rounded-2xl shadow-2xl border border-emerald-100 p-4 w-72 flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-[#295c5e]" size={24} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">
                Uploading file...
              </p>
              <p className="text-xs text-gray-500 truncate">
                {uploadFilename || uploadFile?.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
          <form
            onSubmit={handleUploadSubmit}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
          >
            <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                Upload Media
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsUploadOpen(false);
                  setUploadFile(null);
                  setUploadFilename("");
                }}
                className="p-2 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div
                onClick={() => fileInputRef.current.click()}
                className={`relative border-2 border-dashed rounded-2xl p-4 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[160px] 
            ${
              uploadFile
                ? "border-[#295c5e] bg-emerald-50/30"
                : "border-gray-200 hover:border-[#295c5e] hover:bg-gray-50"
            }`}
              >
                {uploadFile ? (
                  <div className="w-full space-y-3">
                    {uploadFile.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(uploadFile)}
                        alt="preview"
                        className="h-32 w-full object-cover rounded-xl shadow-sm"
                      />
                    ) : (
                      <div className="h-32 w-full flex items-center justify-center bg-white rounded-xl">
                        <FileText className="w-12 h-12 text-[#295c5e]" />
                      </div>
                    )}
                    <div className="text-center">
                      <p className="text-sm font-semibold text-gray-700 truncate px-4">
                        {uploadFile.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {(uploadFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-[#295c5e]/10 rounded-full flex items-center justify-center mb-3">
                      <Upload className="text-[#295c5e]" size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      Click to browse or drag file here
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, MP4 (Max 10MB)
                    </p>
                  </>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setUploadFile(file);
                      setUploadFilename(file.name.split(".")[0]);
                    }
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder="Enter custom filename"
                  value={uploadFilename}
                  onChange={(e) => setUploadFilename(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-[#295c5e]/10 focus:border-[#295c5e] transition-all"
                />
              </div>

              <button
                disabled={isUploading || !uploadFile}
                className="w-full bg-[#295c5e] hover:bg-[#1f4547] disabled:bg-gray-300 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-[#295c5e]/20 transition-all flex justify-center items-center gap-2 transform active:scale-[0.98]"
              >
                <Upload size={20} />
                <span>Start Uploading</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal.isOpen && editModal.file && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200"
          >
            <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                Edit Media
              </h3>
              <button
                type="button"
                onClick={() => setEditModal({ isOpen: false, file: null })}
                className="p-2 hover:bg-rose-50 text-gray-400 hover:text-rose-500 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white border shadow-sm flex-shrink-0">
                  {getFileCategory(editModal.file.format) === "image" ? (
                    <img
                      src={editModal.file.url}
                      className="w-full h-full object-cover"
                      alt="preview"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="text-[#295c5e]" size={24} />
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Current Format
                  </p>
                  <p className="text-sm font-semibold text-gray-700 uppercase">
                    {editModal.file.format}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  File Name
                </label>
                <input
                  type="text"
                  value={editModal.file.filename}
                  onChange={(e) =>
                    setEditModal({
                      ...editModal,
                      file: { ...editModal.file, filename: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-[#295c5e]/10 focus:border-[#295c5e] transition-all"
                  placeholder="Enter new filename"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                  Alt Text (SEO)
                </label>
                <input
                  type="text"
                  value={editModal.file.altText || ""}
                  onChange={(e) =>
                    setEditModal({
                      ...editModal,
                      file: { ...editModal.file, altText: e.target.value },
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:bg-white focus:ring-4 focus:ring-[#295c5e]/10 focus:border-[#295c5e] transition-all"
                  placeholder="Describe this media"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModal({ isOpen: false, file: null })}
                  className="flex-1 py-3 px-4 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-[#295c5e] text-white font-semibold rounded-xl hover:bg-[#1f4547] shadow-lg shadow-[#295c5e]/20 transition-all active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;
