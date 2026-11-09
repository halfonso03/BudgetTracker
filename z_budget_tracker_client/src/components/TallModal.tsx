/* eslint-disable @typescript-eslint/no-empty-object-type */
// Modal.jsx
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

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

const TallModal = ({
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

  // if (size === 'sm') {
  //   modalStyles += 'min-w-xl max-w-xl ';
  // } else if (size === 'md') {
  //   modalStyles += 'min-w-2xl max-w-2xl ';
  // } else

  if (size === 'lg') {
    modalStyles += 'min-w-4xl max-w-4xl ';
  }
  // else if (size === 'xl') {
  //   modalStyles += 'min-w-5xl max-w-5xl  ';
  // }

  return createPortal(
    // body
    <div
      className="fixed inset-0 z-1000 h-dvh w-screen bg-black/60 dark:bg-black/40  flex justify-center "
      style={{ backgroundColor: 'rgb(0 ,0, 0, .3)' }}
    >
      {/* modal */}
      <div
        className={`${modalStyles} ${animateClass} translate-y-7 max-w-md bg-white dark:border dark:border-slate-700/80  dark:bg-slate-800 self-center rounded-sm `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full bg-neutral-200/30 dark:bg-slate-900 dark:border-slate-700/60  p-3 py-4 flex justify-between align-center border-b border-gray-200 dark:border-b-slate-700/60  ">
          <h2 className="m-0 p-0 text-2xl text-neutral-800 dark:text-gray-200">
            {title}
          </h2>
          <button style={closeButtonStyles} onClick={onCancel}>
            <X className="text-gray-500 hover:text-gray-700 dark:text-neutral-300 dark:hover:text-neutral-100 transition-all duration-200"></X>
          </button>
        </div>
        <div className="px-2 dark:bg-slate-900">{children}</div>
      </div>
    </div>,
    document.body, // The target DOM container
  );
};

export default TallModal;
