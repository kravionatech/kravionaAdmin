import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ServiceModal = ({ isOpen, onClose, fetchServices, serviceToEdit }) => {
  const [formData, setFormData] = useState({
    name: '',
    shortDesc: '',
    longDesc: '',
    icon: '',
    isPublished: true,
    isFeatured: false,
    order: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (serviceToEdit) {
      setFormData({
        name: serviceToEdit.name || '',
        shortDesc: serviceToEdit.shortDesc || '',
        longDesc: serviceToEdit.longDesc || '',
        icon: serviceToEdit.icon || '',
        isPublished: serviceToEdit.isPublished ?? true,
        isFeatured: serviceToEdit.isFeatured ?? false,
        order: serviceToEdit.order || 1,
      });
    } else {
      setFormData({
        name: '',
        shortDesc: '',
        longDesc: '',
        icon: '',
        isPublished: true,
        isFeatured: false,
        order: 1,
      });
    }
  }, [serviceToEdit, isOpen]);

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
      const url = serviceToEdit 
        ? `${import.meta.env.VITE_BACKEND_API}/admin/service/${serviceToEdit._id}`
        : `${import.meta.env.VITE_BACKEND_API}/admin/services`;
      
      const method = serviceToEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Service ${serviceToEdit ? 'updated' : 'created'} successfully!`);
        fetchServices();
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
            {serviceToEdit ? 'Edit Service' : 'Add New Service'}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="serviceForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Service Name <span className="text-rose-500">*</span></label>
                <input 
                  type="text" required name="name" value={formData.name} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                  placeholder="e.g. Web Development"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Icon / Emoji</label>
                <input 
                  type="text" name="icon" value={formData.icon} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                  placeholder="e.g. 🌐"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Short Description</label>
              <input 
                type="text" name="shortDesc" value={formData.shortDesc} onChange={handleChange} maxLength={160}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                placeholder="Brief summary (max 160 chars)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Long Description (HTML)</label>
              <textarea 
                name="longDesc" value={formData.longDesc} onChange={handleChange} rows={4}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all resize-none"
                placeholder="<p>Full HTML description here...</p>"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Order Priority</label>
                <input 
                  type="number" name="order" value={formData.order} onChange={handleChange} min={1}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-3 pt-8">
                <input 
                  type="checkbox" id="isPublished" name="isPublished" checked={formData.isPublished} onChange={handleChange}
                  className="w-4 h-4 text-[#295c5e] bg-gray-100 border-gray-300 rounded focus:ring-[#295c5e]"
                />
                <label htmlFor="isPublished" className="text-sm font-medium text-gray-700 cursor-pointer">Published</label>
              </div>

              <div className="flex items-center gap-3 pt-8">
                <input 
                  type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange}
                  className="w-4 h-4 text-[#295c5e] bg-gray-100 border-gray-300 rounded focus:ring-[#295c5e]"
                />
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 cursor-pointer">Featured</label>
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
            type="submit" form="serviceForm" disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#295c5e] hover:bg-[#1f4547] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {serviceToEdit ? 'Save Changes' : 'Create Service'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
