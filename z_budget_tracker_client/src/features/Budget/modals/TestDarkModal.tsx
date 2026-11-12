import React, { useEffect, useRef } from 'react';

interface AdaptiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  children?: React.ReactNode;
}

export const AdaptiveModal: React.FC<AdaptiveModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  children
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // Backdrop overlay: Soft blur, transition, and dimming
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Container Card */}
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xl dark:shadow-2xl overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
      >
        
        {/* Header Section */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/30">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            {title}
          </h3>
        </div>

        {/* Modal Body Content */}
        <div className="px-6 py-6">
          <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {children || (
              <p>
                Are you sure you want to proceed? This action will permanently update your settings and cannot be easily undone.
              </p>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800/50">
          
          {/* Secondary Button (Cancel) */}
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 active:bg-slate-100 dark:active:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-500/40"
          >
            Cancel
          </button>
          
          {/* Primary Button (Confirm Action) */}
          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 active:bg-slate-950 dark:active:bg-indigo-700 rounded-lg transition-all shadow-md dark:shadow-indigo-900/10 focus:outline-none focus:ring-2 focus:ring-slate-900/20 dark:focus:ring-indigo-500/40"
          >
            Confirm
          </button>

        </div>

      </div>
    </div>
  );
};
