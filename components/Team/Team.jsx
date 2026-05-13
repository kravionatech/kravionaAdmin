import { Plus, Search, Edit, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchTeam = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/admin/team`,
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
        setTeamMembers(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch team members");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleDeleteTeamMember = async (id) => {
    if (!window.confirm("Are you sure you want to delete this team member?")) return;
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/admin/team/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        toast.success(data.message || "Team member deleted successfully");
        fetchTeam();
      } else {
        toast.error(data.message || "Failed to delete team member");
      }
    } catch {
      toast.error("Network error. Could not delete team member.");
    }
  };

  const filteredTeam = teamMembers.filter((m) =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative flex flex-col">
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white/50 backdrop-blur-xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Team</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your platform's team members</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search team members..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 focus:border-[#295c5e] transition-all outline-none"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            </div>

            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#295c5e] hover:bg-[#1f4547] transition-colors py-2.5 px-6 rounded-xl text-white font-medium shadow-sm shadow-[#295c5e]/20">
              <Plus size={18} strokeWidth={2.5} />
              <span>Add Member</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="p-5 w-16 text-center">No.</th>
                <th className="p-5">Member Details</th>
                <th className="p-5">Skills</th>
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
                      <p className="text-sm font-medium">Loading team...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredTeam.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center h-64">
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-3">
                      <Search className="w-8 h-8 text-gray-300" />
                      <p className="text-base font-medium text-gray-600">No team members found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTeam.map((member, index) => (
                  <tr key={member._id || index} className="hover:bg-gray-50/80 transition-colors group cursor-default">
                    <td className="p-5 text-center font-medium text-gray-400">
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {member.avatar ? (
                            <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="bg-[#295c5e] text-white w-full h-full flex items-center justify-center font-bold text-lg">
                              {member.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 capitalize text-base">{member.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{member.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="text-xs text-gray-500 max-w-[200px] truncate block">{member.skills?.join(", ")}</span>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${member.isPublished ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                        {member.isPublished ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteTeamMember(member._id)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
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
      </div>
    </div>
  );
};

export default Team;
