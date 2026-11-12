/* eslint-disable @typescript-eslint/no-empty-object-type */
// Modal.jsx
import { X } from 'lucide-react';
import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ModalProps {
  isOpen: boolean;
  onCancel: () => void;
  children: ReactNode;
  size: ModalSize;
  title?: string;
  animateOut: boolean;
}

const closeButtonStyles = {
  border: 'none',
  background: 'none',
  fontSize: '24px',
  cursor: 'pointer',
} as {};

const Modal2 = ({
  isOpen,
  onCancel,
  size,
  title,
  animateOut,
  children,
}: ModalProps) => {
  let animateClass = '';
  const modalRef = useRef<HTMLDivElement>(null);

  if (!isOpen && !animateOut) return '';
  if (isOpen && animateOut) animateClass = 'animate-modal-out';
  if (isOpen && !animateOut) animateClass = 'animate-modal-in';

  let modalStyles = '';

  if (size === 'sm') {
    modalStyles += 'min-w-xl max-w-xl max-w-md';
  } else if (size === 'md') {
    modalStyles += 'min-w-2xl max-w-2xl max-w-md';
  } else if (size === 'lg') {
    modalStyles += 'min-w-4xl max-w-4xl max-w-md';
  } else if (size === 'xl') {
    modalStyles += 'min-w-6xl max-w-6xl max-w-md ';
  } else if (size === '2xl') {
    modalStyles += 'min-w-8xl  max-w-8xl max-w-md ';
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Container Card */}
      <div
        ref={modalRef}
        className={`${modalStyles} ${animateClass} w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xl dark:shadow-2xl overflow-hidden transform transition-all`}
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
      >
        {/* Header Section */}
        <div className=" flex justify-between items-center px-5 py-4 border-b border-slate-200/60 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/30">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            {title}
          </h3>

          <div className="bg-neutral-200/30 dark:bg-slate-900/80   ">
            <button style={closeButtonStyles} onClick={onCancel}>
              <X className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-300  dark:hover:text-neutral-100 transition-all duration-200"></X>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="px-6 py-3">
          <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {children || (
              <p>
                Are you sure you want to proceed? This action will permanently
                update your settings and cannot be easily undone.
              </p>
            )}
          </div>
        </div>

        {/* <div className="px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 bg-slate-50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800/50">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 active:bg-slate-100 dark:active:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-500/40"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-500 active:bg-slate-950 dark:active:bg-indigo-700 rounded-lg transition-all shadow-md dark:shadow-indigo-900/10 focus:outline-none focus:ring-2 focus:ring-slate-900/20 dark:focus:ring-indigo-500/40"
          >
            Confirm
          </button>
        </div> */}
      </div>
    </div>,
    document.body,
  );

  return createPortal(
    // body
    <div
      onClick={onCancel}
      className="fixed inset-0 z-10000 h-dvh w-screen bg-black/60 dark:bg-black/40 flex justify-center "
    >
      {/* modal */}
      <div
        className={`${modalStyles} ${animateClass} w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-xl dark:shadow-2xl overflow-hidden transform transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-950/30">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            {title}
          </h3>
        </div>

        {/* <div className="bg-neutral-200/30 dark:bg-slate-900/80   w-full p-3 flex justify-between align-center border-b border-gray-200 dark:border-slate-700/60 ">
          <h2 className="m-0 p-0 text-2xl text-neutral-800  dark:text-gray-200">
            {title}
          </h2>
          <button style={closeButtonStyles} onClick={onCancel}>
            <X className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-300  dark:hover:text-neutral-100 transition-all duration-200"></X>
          </button>
        </div> */}
        <div className="p-2 px-4 dark:bg-slate-900/90">{children}</div>
      </div>
    </div>,
    document.body, // The target DOM container
  );
};

export default Modal2;
