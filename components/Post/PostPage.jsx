import React, { useState } from "react";

import { Plus, Search } from "lucide-react";
import NewPost from "./NewPost";
const PostPage = () => {
  const [newPostModel, setNewPostModel] = useState(false);
  return (
    <div className="bg-white">
      <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white/50 backdrop-blur-xl">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Posts
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage and organize your platform's Posts
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search categories..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 focus:border-[#295c5e] transition-all outline-none"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          </div>

          <button
            onClick={() => {
              setNewPostModel(!newPostModel);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#295c5e] hover:bg-[#1f4547] transition-colors py-2.5 px-6 rounded-xl text-white font-medium shadow-sm shadow-[#295c5e]/20"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Post</span>
          </button>
        </div>
      </div>

      {/* post add pop */}
      {newPostModel && (
        <div className="w-full  flex items-center justify-center fixed h-full top-0 right-0 bg-white/50 backdrop-blur-[2px] z-50">
          <NewPost />
        </div>
      )}
    </div>
  );
};

export default PostPage;
