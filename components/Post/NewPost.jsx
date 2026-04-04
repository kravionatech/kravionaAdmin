import React, { useRef, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { X, Save, Send, Plus, ImageIcon } from "lucide-react";
import ShowAllImage from "../image/ShowAllImage";

const NewPost = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  // Keyword States
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");

  // Image States
  const [imageModel, setImageModel] = useState(false);
  const [image, setImage] = useState({
    url: "https://img.freepik.com/free-photo/closeup-shot-beautiful-butterfly-with-interesting-textures-orange-petaled-flower_181624-7640.jpg?semt=ais_incoming&w=740&q=80",
    name: "Featured Flower",
  });

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Start typing your masterpiece...",
        modules: {
          toolbar: [
            // 1. Text Style & Sizes
            [{ header: [1, 2, 3, 4, false] }],
            [{ font: [] }, { size: ["small", false, "large", "huge"] }],

            // 2. Emphasis & Color
            ["bold", "italic", "underline", "strike"],
            [{ color: [] }, { background: [] }],
            ["blockquote", "code-block"],

            // 3. Alignment & Lists
            [{ align: [] }],
            [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
            [{ indent: "-1" }, { indent: "+1" }],

            // 4. Media & Links
            ["link", "image", "video"],
            [{ script: "sub" }, { script: "super" }],

            // 5. Cleanup
            ["clean"],
          ],
        },
      });
    }
  }, []);

  // Keyword Handlers
  const handleAddKeyword = (e) => {
    e?.preventDefault();
    const trimmedKeyword = keywordInput.trim();
    if (trimmedKeyword && !keywords.includes(trimmedKeyword)) {
      setKeywords([...keywords, trimmedKeyword]);
      setKeywordInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const removeKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };

  // Image Selection Handler
  const chooseImage = (selectedImage) => {
    setImage(selectedImage);
    setImageModel(false); // Close the modal after selecting
  };

  return (
    <div className="max-w-7xl mx-auto bg-white h-[95vh] shadow-2xl rounded-2xl p-8 overflow-y-auto custom-scrollbar border border-gray-100 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4 sticky top-0 bg-white z-10">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
            New Post
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Write original content for your blog
          </p>
        </div>
        <button className="w-8 h-8 bg-rose-50 text-rose-500 shadow-sm rounded-full flex items-center justify-center hover:bg-rose-100 transition-colors">
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Add title with focus keyword"
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 focus:border-[#295c5e] outline-none transition-all shadow-sm"
            />
          </div>

          {/* Editor Container */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-[#295c5e]/20 focus-within:border-[#295c5e] transition-all quill-premium-wrapper">
            <div
              ref={editorRef}
              className="min-h-[450px] text-sm text-gray-700"
            />
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="flex flex-col gap-6">
          <div className="border border-gray-200 rounded-xl p-5 bg-gray-50/50">
            <h3 className="font-semibold text-sm text-gray-800 mb-4 border-b border-gray-200 pb-2">
              SEO Settings
            </h3>
            <input
              type="text"
              placeholder="Meta Title"
              className="w-full p-2.5 text-sm border border-gray-200 rounded-lg mb-3 outline-none focus:border-[#295c5e]"
            />
            <textarea
              placeholder="Meta Description"
              className="w-full p-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#295c5e] resize-none mb-4"
              rows={4}
            />

            {/* Keywords Section */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Focus Keywords
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add a keyword..."
                  className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#295c5e]"
                />
                <button
                  onClick={handleAddKeyword}
                  className="bg-[#295c5e] text-white px-3 py-2 rounded-lg hover:bg-[#1f4547] transition-colors flex items-center justify-center shrink-0"
                  type="button"
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* View all keywords */}
              <div className="mt-3 flex flex-wrap gap-2">
                {keywords.length === 0 ? (
                  <span className="text-sm text-gray-400 italic">
                    No keywords added yet
                  </span>
                ) : (
                  keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 pl-3 pr-2 py-1 rounded-full text-sm flex items-center gap-1 group transition-colors hover:bg-gray-300"
                    >
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="text-gray-500 hover:text-red-500 rounded-full p-0.5 transition-colors"
                        type="button"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Featured Image Section */}
          <div className="w-full">
            <h3 className="font-semibold text-sm text-gray-800 mb-2">
              Featured Image
            </h3>
            {image ? (
              <div className="relative group rounded-xl overflow-hidden border border-gray-200 w-full shadow-sm">
                <img
                  src={image.url}
                  alt={image.name || "Featured image"}
                  className="w-full aspect-[16/9] object-cover"
                />
                <div className="absolute inset-0 bg-[#0f2425]/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button
                    type="button"
                    onClick={() => setImageModel(true)}
                    className="px-4 py-2 bg-white text-[#0f2425] text-xs font-bold rounded-lg flex items-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    <ImageIcon size={14} /> Change Image
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setImageModel(true)}
                className="w-full aspect-[16/9] border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-[#295c5e] hover:text-[#295c5e] transition-colors cursor-pointer"
              >
                <ImageIcon size={32} className="mb-2" />
                <span className="text-sm font-medium">Upload Image</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 mt-auto">
            <button className="flex-1 py-2.5 px-4 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              <Save size={16} /> Draft
            </button>
            <button className="flex-1 py-2.5 px-4 bg-[#295c5e] text-white text-sm font-semibold rounded-xl hover:bg-[#1f4547] shadow-md transition-all flex items-center justify-center gap-2">
              <Send size={16} /> Publish
            </button>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .quill-premium-wrapper .ql-toolbar {
          border: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          background-color: #f9fafb;
          padding: 12px !important;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .quill-premium-wrapper .ql-container {
          border: none !important;
        }
        .quill-premium-wrapper .ql-editor {
          padding: 2rem;
          font-size: 1rem;
          line-height: 1.6;
        }
        .quill-premium-wrapper .ql-editor.ql-blank::before {
          left: 2rem;
          font-style: normal;
          color: #9ca3af;
        }
        /* Custom Scrollbar for the editor */
        .ql-editor::-webkit-scrollbar {
          width: 6px;
        }
        .ql-editor::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 10px;
        }
      `,
        }}
      />

      {/* Image Modal overlay */}
      {imageModel && (
        <div className="fixed inset-0 z-50 w-full h-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <div className="w-5xl">
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

export default NewPost;
