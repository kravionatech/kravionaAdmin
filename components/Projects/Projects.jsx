import { Plus, Search, Edit, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ProjectModal from "./ProjectModal";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);

  const handleOpenModal = (project = null) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/admin/projects`,
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
        setProjects(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch projects");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/admin/project/${id}`,
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
        toast.success(data.message || "Project deleted successfully");
        fetchProjects();
      } else {
        toast.error(data.message || "Failed to delete project");
      }
    } catch {
      toast.error("Network error. Could not delete project.");
    }
  };

  const filteredProjects = projects.filter((prj) =>
    prj.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    prj.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative flex flex-col">
        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white/50 backdrop-blur-xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Projects</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your portfolio projects</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 focus:border-[#295c5e] transition-all outline-none"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
            </div>

            <button onClick={() => handleOpenModal()} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#295c5e] hover:bg-[#1f4547] transition-colors py-2.5 px-6 rounded-xl text-white font-medium shadow-sm shadow-[#295c5e]/20">
              <Plus size={18} strokeWidth={2.5} />
              <span>Add Project</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="p-5 w-16 text-center">No.</th>
                <th className="p-5">Project Details</th>
                <th className="p-5">Client</th>
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
                      <p className="text-sm font-medium">Loading projects...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center h-64">
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-3">
                      <Search className="w-8 h-8 text-gray-300" />
                      <p className="text-base font-medium text-gray-600">No projects found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project, index) => (
                  <tr key={project._id || index} className="hover:bg-gray-50/80 transition-colors group cursor-default">
                    <td className="p-5 text-center font-medium text-gray-400">
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {project.images && project.images.length > 0 ? (
                            <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 capitalize text-base">{project.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 max-w-[250px] truncate">{project.techStack?.join(", ")}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="font-medium text-gray-700">{project.clientName}</span>
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${project.isPublished ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200'}`}>
                        {project.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(project)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteProject(project._id)} className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
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
      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        fetchProjects={fetchProjects}
        projectToEdit={projectToEdit}
      />
    </div>
  );
};

export default Projects;
