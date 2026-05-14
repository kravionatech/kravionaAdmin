import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ProjectModal = ({ isOpen, onClose, fetchProjects, projectToEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    clientName: '',
    description: '',
    techStack: '',
    images: '',
    liveUrl: '',
    isFeatured: false,
    isPublished: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        title: projectToEdit.title || '',
        clientName: projectToEdit.clientName || '',
        description: projectToEdit.description || '',
        techStack: projectToEdit.techStack ? projectToEdit.techStack.join(', ') : '',
        images: projectToEdit.images ? projectToEdit.images.join(', ') : '',
        liveUrl: projectToEdit.liveUrl || '',
        isFeatured: projectToEdit.isFeatured ?? false,
        isPublished: projectToEdit.isPublished ?? true,
      });
    } else {
      setFormData({
        title: '', clientName: '', description: '', techStack: '', images: '', liveUrl: '',
        isFeatured: false, isPublished: true,
      });
    }
  }, [projectToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
        images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
      };

      const url = projectToEdit 
        ? `${import.meta.env.VITE_BACKEND_API}/admin/project/${projectToEdit._id}`
        : `${import.meta.env.VITE_BACKEND_API}/admin/projects`;
      
      const method = projectToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Project ${projectToEdit ? 'updated' : 'created'} successfully!`);
        fetchProjects();
        onClose();
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-bold text-gray-800">
            {projectToEdit ? 'Edit Project' : 'Add New Project'}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="projectForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Project Title <span className="text-rose-500">*</span></label>
                <input 
                  type="text" required name="title" value={formData.title} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Client Name</label>
                <input 
                  type="text" name="clientName" value={formData.clientName} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Description</label>
              <textarea 
                name="description" value={formData.description} onChange={handleChange} rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Tech Stack (Comma separated)</label>
                <input 
                  type="text" name="techStack" value={formData.techStack} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                  placeholder="e.g. Next.js, Tailwind, MongoDB"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Live URL</label>
                <input 
                  type="text" name="liveUrl" value={formData.liveUrl} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Images (Comma separated URLs)</label>
              <input 
                type="text" name="images" value={formData.images} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" id="project_isPublished" name="isPublished" checked={formData.isPublished} onChange={handleChange}
                  className="w-4 h-4 text-[#295c5e] bg-gray-100 border-gray-300 rounded focus:ring-[#295c5e]"
                />
                <label htmlFor="project_isPublished" className="text-sm font-medium text-gray-700 cursor-pointer">Published</label>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input 
                  type="checkbox" id="project_isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange}
                  className="w-4 h-4 text-[#295c5e] bg-gray-100 border-gray-300 rounded focus:ring-[#295c5e]"
                />
                <label htmlFor="project_isFeatured" className="text-sm font-medium text-gray-700 cursor-pointer">Featured Project</label>
              </div>
            </div>

          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <button 
            type="button" onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" form="projectForm" disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#295c5e] hover:bg-[#1f4547] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {projectToEdit ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
