import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, FileText, MessageSquare, Layers, TrendingUp, Activity, Image as ImageIcon } from "lucide-react";

const Home = () => {
  const [stats, setStats] = useState({
    posts: 0,
    categories: 0,
    messages: 0,
    subscribers: 0,
    files: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const backendApi = import.meta.env.VITE_BACKEND_API;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [postsRes, catRes, msgRes, subRes, filesRes] = await Promise.all([
          fetch(`${backendApi}/posts?limit=1`, { headers }),
          fetch(`${backendApi}/categories/admin`, { headers }),
          fetch(`${backendApi}/admin/messages?limit=1`, { headers }),
          fetch(`${backendApi}/subscribers?limit=1`, { headers }),
          fetch(`${backendApi}/files`, { headers })
        ]);

        const [posts, categories, messages, subscribers, files] = await Promise.all([
          postsRes.ok ? postsRes.json() : { total: 0 },
          catRes.ok ? catRes.json() : { total: 0 },
          msgRes.ok ? msgRes.json() : { pagination: { total: 0 } },
          subRes.ok ? subRes.json() : { pagination: { total: 0 } },
          filesRes.ok ? filesRes.json() : { total: 0 }
        ]);

        setStats({
          posts: posts.total || 0,
          categories: categories.total || categories.categories?.length || 0,
          messages: messages.pagination?.total || messages.total || 0,
          subscribers: subscribers.pagination?.total || subscribers.total || 0,
          files: files.total || files.files?.length || 0
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [backendApi]);

  const statCards = [
    { title: "Total Posts", value: stats.posts, icon: <FileText size={24} />, color: "bg-blue-500", shadow: "shadow-blue-500/30", link: "/posts" },
    { title: "Categories", value: stats.categories, icon: <Layers size={24} />, color: "bg-purple-500", shadow: "shadow-purple-500/30", link: "/categories" },
    { title: "Messages", value: stats.messages, icon: <MessageSquare size={24} />, color: "bg-rose-500", shadow: "shadow-rose-500/30", link: "/messages" },
    { title: "Subscribers", value: stats.subscribers, icon: <Users size={24} />, color: "bg-emerald-500", shadow: "shadow-emerald-500/30", link: "/subscriber" },
    { title: "Media Files", value: stats.files, icon: <ImageIcon size={24} />, color: "bg-amber-500", shadow: "shadow-amber-500/30", link: "/media-library" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
          <Activity size={18} className="text-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-gray-700">System Status: <span className="text-emerald-600 font-bold">Operational</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card, index) => (
          <Link key={index} to={card.link} className="group relative bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 ${card.color} group-hover:scale-150 transition-transform duration-500`}></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
                {isLoading ? (
                  <div className="w-16 h-8 bg-gray-200 animate-pulse rounded-lg mt-2"></div>
                ) : (
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">{card.value}</h3>
                )}
              </div>
              <div className={`${card.color} text-white p-3 rounded-2xl shadow-lg ${card.shadow} transform group-hover:rotate-12 transition-transform duration-300`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-500 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
              <TrendingUp size={14} className="mr-1" /> +12% this week
            </div>
          </Link>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl opacity-50 -z-10"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100/50 hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <FileText size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">New post published</p>
                <p className="text-xs text-gray-500 mt-0.5">"Understanding MongoDB" was published successfully.</p>
              </div>
              <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">2 hrs ago</span>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100/50 hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <Users size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">New subscriber joined</p>
                <p className="text-xs text-gray-500 mt-0.5">john@example.com subscribed to newsletter.</p>
              </div>
              <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">5 hrs ago</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0f2425] to-[#1f4547] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-[#f4be78] mb-2">Welcome to Kraviona Admin</h2>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Your central hub for managing content, media, subscribers, and platform communications. Use the sidebar to navigate through your application.
            </p>
          </div>
          <div className="mt-8 relative z-10 flex gap-4">
            <Link to="/posts" className="bg-[#f4be78] hover:bg-[#e3a85b] text-[#0f2425] font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg shadow-[#f4be78]/20">
              Write Post
            </Link>
            <Link to="/settings" className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors backdrop-blur-sm">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
