/* eslint-disable @typescript-eslint/no-empty-object-type */
// Modal.jsx
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
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
    modalStyles += 'min-w-8xl  max-w-8xl';
  }

  return createPortal(
    // body
    <div
      onClick={onCancel}
      className="fixed inset-0 z-10000 h-dvh w-screen bg-black/60 dark:bg-black/40 flex justify-center "
    >
      {/* modal */}
      <div
        className={`${modalStyles} ${animateClass} opacity-100  bg-white dark:border dark:border-slate-700/80 dark:bg-slate-800/80   self-center rounded-sm shadow-lg`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-neutral-200/30 dark:bg-slate-900/80  rounded-t-sm w-full h-full p-3 flex justify-between align-center border-b border-gray-200 dark:border-slate-700/60 ">
          <h2 className="m-0 p-0 text-2xl text-neutral-800  dark:text-gray-200">
            {title}
          </h2>
          <button style={closeButtonStyles} onClick={onCancel}>
            <X className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-300  dark:hover:text-neutral-100 transition-all duration-200"></X>
          </button>
        </div>
        <div className="p-2 px-4 dark:bg-slate-900/90">{children}</div>
      </div>
    </div>,
    document.body, // The target DOM container
  );
};

export default Modal2;
