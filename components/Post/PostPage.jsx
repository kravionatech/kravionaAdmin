import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreVertical,
  AlertCircle,
  Loader2,
  ImageIcon,
} from "lucide-react";
import NewPost from "./NewPost";

const PostPage = () => {
  const [newPostModel, setNewPostModel] = useState(false);

  // Table States
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch API Function
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const apiUrl =
        import.meta.env.VITE_BACKEND_API || "https://api.kraviona.com/api";

      const response = await fetch(`${apiUrl}/posts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Failed to fetch posts. Please try again.",
        );
      }

      // Your JSON returns the array inside the "data" property
      if (result.success) {
        setPosts(result.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch posts on mount & auto-refresh when the Add Post modal is closed
  useEffect(() => {
    if (!newPostModel) {
      fetchPosts();
    }
  }, [newPostModel]);

  const handleDelete = async (postSlug) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const token = localStorage.getItem("token");
      const apiUrl =
        import.meta.env.VITE_BACKEND_API || "https://api.kraviona.com/api";

      const response = await fetch(`${apiUrl}/post/${postSlug}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete post");

      // Remove from UI immediately
      setPosts(posts.filter((post) => post.slug !== postSlug));
    } catch (err) {
      alert(err.message);
    }
  };

  // Search Filter logic (safely checking category.name)
  const filteredPosts = posts.filter((post) => {
    const titleMatch = post.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const categoryMatch = post.category?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    return titleMatch || categoryMatch;
  });

  return (
    <div className="bg-white h-full flex flex-col relative">
      {/* HEADER SECTION */}
      <div className=" p-4 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white/50 backdrop-blur-xl z-10 sticky -top-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Posts
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage and organize your platform's Posts
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Linked input to searchTerm state */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts or categories..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 focus:border-[#295c5e] transition-all outline-none"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          </div>

          <button
            onClick={() => setNewPostModel(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#295c5e] hover:bg-[#1f4547] transition-colors py-2.5 px-6 rounded-xl text-white font-medium shadow-sm shadow-[#295c5e]/20"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Add Post</span>
          </button>
        </div>
      </div>

      {/* ERROR NOTIFICATION */}
      {error && (
        <div className="m-6 mb-0 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* TABLE SECTION */}
      <div className="p-6 flex-1 overflow-auto">
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="w-full h-64 flex flex-col items-center justify-center text-[#295c5e] gap-3">
              <Loader2 size={32} className="animate-spin" />
              <span className="text-sm font-medium text-gray-500">
                Loading posts...
              </span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse bg-white">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Post Details
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPosts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-12 text-center text-gray-500 text-sm"
                    >
                      {searchTerm
                        ? "No posts match your search."
                        : "No posts found. Create your first post!"}
                    </td>
                  </tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr
                      key={post._id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      {/* Thumbnail & Title */}
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                            {post.featuredImage?.large?.url || post.featuredImage?.medium?.url || post.featuredImage?.small?.url ? (
                              <img
                                src={post.featuredImage?.large?.url || post.featuredImage?.medium?.url || post.featuredImage?.small?.url}
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p
                              className="text-sm font-semibold text-gray-800 line-clamp-1 max-w-[300px]"
                              title={post.title}
                            >
                              {post.title}
                            </p>
                            <p
                              className="text-xs text-gray-500 line-clamp-1 max-w-[300px] mt-0.5"
                              title={post.excerpt}
                            >
                              {post.excerpt || "No excerpt"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category (Safely accessing the object) */}
                      <td className="py-3 px-6">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#295c5e]/10 text-[#295c5e]">
                          {post.category?.name || "Uncategorized"}
                        </span>
                      </td>

                      {/* Author (Safely accessing the object) */}
                      <td className="py-3 px-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-800">
                            {post.author?.name || "Unknown"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {post.author?.email || ""}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="p-1.5 text-gray-400 hover:text-[#295c5e] hover:bg-[#295c5e]/10 rounded-md transition-colors"
                            title="Edit Post"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(post.slug)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete Post"
                          >
                            <Trash2 size={16} />
                          </button>
                          <button className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* post add pop */}
      {newPostModel && (
        <div className="w-full flex items-center justify-center fixed h-full top-0 right-0 bg-black/40 backdrop-blur-sm z-50">
          <NewPost
            newPostModel={newPostModel}
            setNewPostModel={setNewPostModel}
          />
        </div>
      )}
    </div>
  );
};

export default PostPage;
