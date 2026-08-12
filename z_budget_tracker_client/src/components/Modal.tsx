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

const Modal = ({
  isOpen,
  onCancel,
  size,
  title,
  animateOut,
  children,
}: ModalProps) => {
  let animateClass = '';

  if (!isOpen && !animateOut) return null;
  if (isOpen && animateOut) animateClass = 'animate-modal-out';
  if (isOpen && !animateOut) animateClass = 'animate-modal-in';

  let modalStyles = '';

  if (size === 'sm') {
    modalStyles += 'min-w-xl max-w-xl ';
  } else if (size === 'md') {
    modalStyles += 'min-w-2xl max-w-2xl ';
  } else if (size === 'lg') {
    modalStyles += 'min-w-4xl max-w-4xl ';
  } else if (size === 'xl') {
    modalStyles += 'min-w-5xl max-w-5xl  ';
  }

  return createPortal(
    // body
    <div
      onClick={onCancel}
      className="fixed inset-0 z-50 h-dvh w-screen bg-black/50 flex justify-center "
      style={{ backgroundColor: 'rgb(0 ,0, 0, .8)' }}
    >
      {/* modal */}
      <div
        className={`${modalStyles} ${animateClass} p-3 pb-0 px-4 max-w-md bg-white bg-dark-nav self-center rounded-sm `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full h-full mb-2 p-2 px-1 flex justify-between align-center border-b border-gray-300 dark:border-b-neutral-800">
          <h2 className="m-0 p-0 text-2xl text-gray-800 dark:text-gray-200">
            {title}
          </h2>
          <button style={closeButtonStyles} onClick={onCancel}>
            <X className="text-gray-700 hover:text-gray-500 dark:text-neutral-300 dark:hover:text-neutral-100 transition-all duration-200"></X>
          </button>
        </div>
        <div className="pt-2 pb-2">{children}</div>
      </div>
    </div>,
    document.body, // The target DOM container
  );
};

export default Modal;
