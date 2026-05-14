import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const CampaignModal = ({ isOpen, onClose, fetchCampaigns, campaignToEdit }) => {
  const [formData, setFormData] = useState({
    subject: '',
    previewText: '',
    htmlContent: '',
    textContent: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (campaignToEdit) {
      setFormData({
        subject: campaignToEdit.subject || '',
        previewText: campaignToEdit.previewText || '',
        htmlContent: campaignToEdit.htmlContent || '',
        textContent: campaignToEdit.textContent || '',
      });
    } else {
      setFormData({
        subject: '', previewText: '', htmlContent: '', textContent: '',
      });
    }
  }, [campaignToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = campaignToEdit 
        ? `${import.meta.env.VITE_BACKEND_API}/admin/campaign/${campaignToEdit._id}`
        : `${import.meta.env.VITE_BACKEND_API}/admin/campaigns`;
      
      const method = campaignToEdit ? 'PUT' : 'POST';

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
        toast.success(`Campaign ${campaignToEdit ? 'updated' : 'drafted'} successfully!`);
        fetchCampaigns();
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
            {campaignToEdit ? 'Edit Campaign' : 'Create Campaign Draft'}
          </h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="campaignForm" onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email Subject <span className="text-rose-500">*</span></label>
              <input 
                type="text" required name="subject" value={formData.subject} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                placeholder="e.g. New Year Offer 🎉"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Preview Text (Snippet)</label>
              <input 
                type="text" name="previewText" value={formData.previewText} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all"
                placeholder="Exclusive deals for you"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">HTML Content <span className="text-rose-500">*</span></label>
              <textarea 
                required name="htmlContent" value={formData.htmlContent} onChange={handleChange} rows={5}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all resize-y"
                placeholder="<h1>Hello!</h1><p>Check our offers...</p>"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Plain Text Content (Fallback)</label>
              <textarea 
                name="textContent" value={formData.textContent} onChange={handleChange} rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#295c5e]/20 outline-none transition-all resize-y"
                placeholder="Hello! Check our offers..."
              />
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
            type="submit" form="campaignForm" disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#295c5e] hover:bg-[#1f4547] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
            {campaignToEdit ? 'Save Changes' : 'Save Draft'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignModal;
