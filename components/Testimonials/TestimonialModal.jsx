import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const TestimonialModal = ({ isOpen, onClose, fetchTestimonials, testimonialToEdit }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientRole: '',
    clientCompany: '',
    clientAvatar: '',
    rating: 5,
    review: '',
    isPublished: true,
    isFeatured: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (testimonialToEdit) {
      setFormData({
        clientName: testimonialToEdit.clientName || '',
        clientRole: testimonialToEdit.clientRole || '',
        clientCompany: testimonialToEdit.clientCompany || '',
        clientAvatar: testimonialToEdit.clientAvatar || '',
        rating: testimonialToEdit.rating || 5,
        review: testimonialToEdit.review || '',
        isPublished: testimonialToEdit.isPublished ?? true,
        isFeatured: testimonialToEdit.isFeatured ?? false,
      });
    } else {
      setFormData({
        clientName: '', clientRole: '', clientCompany: '', clientAvatar: '',
        rating: 5, review: '', isPublished: true, isFeatured: false,
      });
    }
  }, [testimonialToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = testimonialToEdit 
        ? `${import.meta.env.VITE_BACKEND_API}/admin/testimonial/${testimonialToEdit._id}`
        : `${import.meta.env.VITE_BACKEND_API}/admin/testimonials`;
      
      const method = testimonialToEdit ? 'PUT' : 'POST';

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
        toast.success(`Testimonial ${testimonialToEdit ? 'updated' : 'added'} successfully!`);
        fetchTestimonials();
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
            {testimonialToEdit ? 'Edit Testimonial' : 'Add Testimonial'}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="testimonialForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Client Name <span className="text-rose-500">*</span></label>
                <input 
                  type="text" required name="clientName" value={formData.clientName} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Client Role</label>
                <input 
                  type="text" name="clientRole" value={formData.clientRole} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Client Company</label>
                <input 
                  type="text" name="clientCompany" value={formData.clientCompany} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Client Avatar URL</label>
                <input 
                  type="text" name="clientAvatar" value={formData.clientAvatar} onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Review Text <span className="text-rose-500">*</span></label>
              <textarea 
                required name="review" value={formData.review} onChange={handleChange} rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Rating (1-5)</label>
                <input 
                  type="number" name="rating" value={formData.rating} onChange={handleChange} min={1} max={5}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-3 pt-8">
                <input 
                  type="checkbox" id="test_isPublished" name="isPublished" checked={formData.isPublished} onChange={handleChange}
                  className="w-4 h-4 text-[#295c5e] bg-gray-100 border-gray-300 rounded focus:ring-[#295c5e]"
                />
                <label htmlFor="test_isPublished" className="text-sm font-medium text-gray-700 cursor-pointer">Published</label>
              </div>

              <div className="flex items-center gap-3 pt-8">
                <input 
                  type="checkbox" id="test_isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange}
                  className="w-4 h-4 text-[#295c5e] bg-gray-100 border-gray-300 rounded focus:ring-[#295c5e]"
                />
                <label htmlFor="test_isFeatured" className="text-sm font-medium text-gray-700 cursor-pointer">Featured</label>
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
            type="submit" form="testimonialForm" disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#295c5e] hover:bg-[#1f4547] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {testimonialToEdit ? 'Save Changes' : 'Add Testimonial'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialModal;
