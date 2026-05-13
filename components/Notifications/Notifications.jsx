import React from 'react';

const Notifications = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Notifications</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your platform's notifications</p>
        
        <div className="mt-8 flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-400">Content for Notifications will go here.</p>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
