import React, { useState, useEffect } from "react";
import { Loader2, FileText, Film } from "lucide-react";
import { toast } from "react-toastify"; // Ensure toastify is available or remove if not needed here

const ShowAllImage = ({ chooseImage, imageModel, setImageModel }) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all media files from the API
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_API}/files`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        const data = await response.json();

        if (data.success) {
          setFiles(data.files || []);
        } else {
          toast.error("Failed to load images");
        }
      } catch (error) {
        console.error("Error fetching media:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
  }, []);

  // Helper to determine file type for UI rendering
  const getFileCategory = (format) => {
    const fmt = format?.toLowerCase() || "";
    if (["jpg", "jpeg", "png", "webp", "gif"].includes(fmt)) return "image";
    if (["mp4", "webm"].includes(fmt)) return "video";
    return "other";
  };

  return (
    <div className="h-[70vh] w-full bg-[#11393b] p-8 text-white overflow-y-scroll custom-scrollbar">
      {/* Loading State */}
      {isLoading ? (
        <div className="w-full h-full flex flex-col items-center justify-center gap-3">
          <Loader2 className="animate-spin text-[#f4be78]" size={40} />
          <p className="text-[#295c5e] font-medium">Loading your media...</p>
        </div>
      ) : files.length === 0 ? (
        /* Empty State */
        <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-400">
          <p>No media files found.</p>
        </div>
      ) : (
        /* Image Grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {files.map((file) => {
            const category = getFileCategory(file.format);

            return (
              <div
                key={file._id}
                onClick={() => {
                  chooseImage(file); // Passing the entire file object to the parent
                  setImageModel(!imageModel);
                }}
                className="group relative bg-[#295c5e]/10 border border-[#295c5e]/30 rounded-2xl overflow-hidden hover:border-[#f4be78]/50 cursor-pointer shadow-lg hover:shadow-[#f4be78]/10 transition-all duration-300"
              >
                {/* Media Preview */}
                <div className="aspect-square bg-[#0a2425] overflow-hidden flex items-center justify-center relative">
                  {category === "image" ? (
                    <img
                      src={file.url}
                      alt={file.filename}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : category === "video" ? (
                    <div className="flex flex-col items-center gap-2 text-[#295c5e] group-hover:text-[#f4be78] transition-colors">
                      <Film size={40} />
                      <span className="text-xs font-bold uppercase">
                        {file.format}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#295c5e] group-hover:text-[#f4be78] transition-colors">
                      <FileText size={40} />
                      <span className="text-xs font-bold uppercase">
                        {file.format}
                      </span>
                    </div>
                  )}

                  {/* Format Badge overlay on images */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-[#0f2425]/80 backdrop-blur-md rounded border border-[#295c5e]/50 text-[9px] font-bold text-gray-300 uppercase">
                    {file.format}
                  </div>
                </div>

                {/* Info Label */}
                <div className="p-3 bg-[#0f2425]/90 backdrop-blur-sm border-t border-[#295c5e]/30">
                  <p
                    className="text-xs font-medium text-gray-200 truncate"
                    title={file.filename}
                  >
                    {file.filename}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[10px] text-[#295c5e]">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShowAllImage;
