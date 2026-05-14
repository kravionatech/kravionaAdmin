import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const TeamModal = ({ isOpen, onClose, fetchTeam, memberToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    avatar: '',
    skills: '', // Will split by comma before sending
    socialLinks: { linkedin: '', github: '', twitter: '' },
    order: 1,
    isPublished: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (memberToEdit) {
      setFormData({
        name: memberToEdit.name || '',
        role: memberToEdit.role || '',
        bio: memberToEdit.bio || '',
        avatar: memberToEdit.avatar || '',
        skills: memberToEdit.skills ? memberToEdit.skills.join(', ') : '',
        socialLinks: memberToEdit.socialLinks || { linkedin: '', github: '', twitter: '' },
        order: memberToEdit.order || 1,
        isPublished: memberToEdit.isPublished ?? true,
      });
    } else {
      setFormData({
        name: '', role: '', bio: '', avatar: '', skills: '',
        socialLinks: { linkedin: '', github: '', twitter: '' },
        order: 1, isPublished: true,
      });
    }
  }, [memberToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('social_')) {
      const platform = name.split('_')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [platform]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      };

      const url = memberToEdit 
        ? `${import.meta.env.VITE_BACKEND_API}/admin/team/${memberToEdit._id}`
        : `${import.meta.env.VITE_BACKEND_API}/admin/team`;
      
      const method = memberToEdit ? 'PUT' : 'POST';

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
        toast.success(`Team member ${memberToEdit ? 'updated' : 'added'} successfully!`);
        fetchTeam();
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
            {memberToEdit ? 'Edit Team Member' : 'Add Team Member'}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="teamForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Name <span className="text-rose-500">*</span></label>
                <input 
                  type="text" required name="name" value={formData.name} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Role / Designation <span className="text-rose-500">*</span></label>
                <input 
                  type="text" required name="role" value={formData.role} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Bio</label>
              <textarea 
                name="bio" value={formData.bio} onChange={handleChange} rows={2} maxLength={200}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all resize-none"
                placeholder="Short bio (max 200 chars)"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Avatar Image URL</label>
                <input 
                  type="text" name="avatar" value={formData.avatar} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Skills (Comma separated)</label>
                <input 
                  type="text" name="skills" value={formData.skills} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                  placeholder="e.g. React, Node.js, MongoDB"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2 block">Social Links</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  type="text" name="social_linkedin" value={formData.socialLinks.linkedin} onChange={handleChange}
                  className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                  placeholder="LinkedIn URL"
                />
                <input 
                  type="text" name="social_github" value={formData.socialLinks.github} onChange={handleChange}
                  className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                  placeholder="GitHub URL"
                />
                <input 
                  type="text" name="social_twitter" value={formData.socialLinks.twitter} onChange={handleChange}
                  className="w-full px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                  placeholder="Twitter URL"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Display Order</label>
                <input 
                  type="number" name="order" value={formData.order} onChange={handleChange} min={1}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-3 pt-8">
                <input 
                  type="checkbox" id="team_isPublished" name="isPublished" checked={formData.isPublished} onChange={handleChange}
                  className="w-4 h-4 text-[#295c5e] bg-gray-100 border-gray-300 rounded focus:ring-[#295c5e]"
                />
                <label htmlFor="team_isPublished" className="text-sm font-medium text-gray-700 cursor-pointer">Active / Published</label>
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
            type="submit" form="teamForm" disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#295c5e] hover:bg-[#1f4547] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {memberToEdit ? 'Save Changes' : 'Add Member'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamModal;
