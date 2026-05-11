import React, { useState } from "react";
import { Camera, Search, X, Image as ImageIcon } from "lucide-react";
import ShowAllImage from "../image/ShowAllImage";
import { toast } from "react-toastify";

const NewCategory = ({ setOpenNewCategoryModel }) => {
  const [imageModel, setImageModel] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [categoryName, setCategoryName] = useState();
  const [description, setDescription] = useState();
  const [message, setMessage] = useState("");

  const chooseImage = (url) => {
    setImageUrl(url);
    setImageModel(false); // Close modal after selection
  };

  const submitHandler = async () => {
    if (!categoryName) setMessage("Category name is required");
    if (!description) setMessage("Description is required");
    if (!imageUrl?.url) setMessage("Image is required");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/category/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            name: categoryName,
            slug: categoryName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            image: imageUrl?.url,
            description: description,
          }),
        },
      );
      const data = await response.json();
      if (data.success) {
        setMessage(data.message);
        setCategoryName("");
        setDescription("");
        setImageUrl("");
        toast.success(data.message);
        setOpenNewCategoryModel(false);
      } else {
        toast.error(data.message);
        setMessage(data.message);
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl p-8 bg-[#0f2425] shadow-2xl border border-[#295c5e] text-white relative">
      {/* Header */}
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-[#f4be78]">
            Category Configuration
          </h2>
          <p className="text-[#295c5e] text-sm">
            Define your category details and search visibility.
          </p>
        </div>
        <button
          onClick={() => setOpenNewCategoryModel(false)}
          className="p-2 hover:bg-[#295c5e]/20 rounded-full transition-colors text-[#295c5e] bg-rose-200"
        >
          <X size={20} />
        </button>
      </header>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: General Info */}
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Category Name <sup className="text-[#d96c4e]">*</sup>
            </label>
            <input
              value={categoryName}
              onChange={(e) => {
                setCategoryName(e.target.value);
              }}
              name="categoryname"
              type="text"
              placeholder="e.g. Interior Design"
              className="w-full py-2.5 px-4 border border-[#295c5e] bg-[#295c5e]/10 rounded-lg outline-none focus:border-[#f4be78] focus:ring-1 focus:ring-[#f4be78]/30 transition-all placeholder:text-[#295c5e]/50"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Description <sup className="text-[#d96c4e]">*</sup>
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              name="description"
              rows="5"
              placeholder="Describe this category's purpose..."
              className="w-full py-2.5 px-4 border border-[#295c5e] bg-[#295c5e]/10 rounded-lg outline-none focus:border-[#f4be78] transition-all resize-none placeholder:text-[#295c5e]/50"
            />
          </div>
        </div>

        {/* Right Column: SEO & Image */}
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Category Cover <sup className="text-[#d96c4e]">*</sup>
            </label>

            {imageUrl ? (
              <div className="relative group rounded-xl overflow-hidden border border-[#295c5e] h-[160px]">
                <img
                  src={imageUrl?.url}
                  alt={imageUrl?.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-[#0f2425]/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button
                    type="button"
                    onClick={() => setImageModel(true)}
                    className="px-4 py-2 bg-[#f4be78] text-[#0f2425] text-xs font-bold rounded-lg flex items-center gap-2"
                  >
                    <ImageIcon size={14} /> Change Image
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setImageModel(true)}
                className="group h-[160px] w-full border-2 border-dashed border-[#295c5e] rounded-xl flex flex-col items-center justify-center bg-[#295c5e]/5 hover:border-[#f4be78] hover:bg-[#f4be78]/5 transition-all cursor-pointer"
              >
                <Camera className="w-8 h-8 text-[#295c5e] group-hover:text-[#f4be78] mb-2" />
                <span className="text-xs text-[#295c5e] group-hover:text-[#f4be78]">
                  Select Image
                </span>
              </div>
            )}
          </div>

          {/* SEO Section */}
          <div className="p-5 rounded-xl bg-[#295c5e]/5 border border-[#295c5e]/20 space-y-4">
            <div className="flex items-center space-x-2 text-[#f4be78]">
              <Search size={14} />
              <span className="text-[10px] font-bold uppercase tracking-[0.1em]">
                SEO Metadata
              </span>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Meta Title"
                className="w-full text-xs py-2.5 px-3 border border-[#295c5e] bg-[#0f2425] rounded-lg outline-none focus:border-[#f4be78] transition-all"
              />
              <input
                type="text"
                placeholder="Keywords (living, modern, etc)"
                className="w-full text-xs py-2.5 px-3 border border-[#295c5e] bg-[#0f2425] rounded-lg outline-none focus:border-[#f4be78] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="md:col-span-2 pt-6 mt-4 border-t border-[#295c5e]/20 flex justify-end items-center gap-6">
          {/* message */}
          {message && <p className="text-xs">{message}</p>}

          <button
            onClick={() => setOpenNewCategoryModel(false)}
            type="button"
            className="text-sm font-medium text-[#295c5e] hover:text-[#f4be78] transition-colors"
          >
            Discard Changes
          </button>
          <button
            onClick={submitHandler}
            type="button"
            className="px-10 py-3 bg-[#d96c4e] hover:bg-[#c45a3d] text-white font-bold rounded-xl shadow-lg shadow-[#d96c4e]/20 active:scale-95 transition-all"
          >
            Publish Category
          </button>
        </div>
      </form>

      {/* Modal Overlay */}
      {imageModel && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0f2425]/90 backdrop-blur-sm"
            onClick={() => setImageModel(false)}
          />
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-[#0f2425] border border-[#295c5e]  shadow-2xl">
            <ShowAllImage
              chooseImage={chooseImage}
              imageModel={imageModel}
              setImageModel={setImageModel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NewCategory;
