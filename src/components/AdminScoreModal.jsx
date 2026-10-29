import React from 'react';
import AdminDeskSection from './AdminDeskSection';

export default function AdminScoreModal({ isOpen, onClose, isDarkMode, lang }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-y-auto ${
        isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <AdminDeskSection
          isModal={true}
          onClose={onClose}
          isDarkMode={isDarkMode}
          lang={lang}
        />
      </div>
    </div>
  );
}
