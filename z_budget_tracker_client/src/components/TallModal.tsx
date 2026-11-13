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
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
    modalStyles += 'max-w-[calc(100%-15vw)] min-w-[calc(100%-15vw)] max-w-md ';
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
        className={`${modalStyles} ${animateClass} w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80  overflow-hidden transform transition-all`}
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
      >
        <div className=" flex justify-between items-center px-5 py-4 border-b border-slate-200/60 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/30">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 ">
            {title}
          </h3>

          <div className=" dark:bg-slate-900/80   ">
            <button style={closeButtonStyles} onClick={onCancel}>
              <X className="text-neutral-500 hover:text-neutral-400 dark:text-neutral-300  dark:hover:text-neutral-100 transition-all duration-200"></X>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="px-6 py-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal2;

// /* eslint-disable @typescript-eslint/no-empty-object-type */
// // Modal.jsx
// import { X } from 'lucide-react';
// import type { ReactNode } from 'react';
// import { createPortal } from 'react-dom';

// export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

// interface ModalProps {
//   isOpen: boolean;
//   onCancel: () => void;
//   children: ReactNode;
//   size: ModalSize;
//   title?: string;
//   animateOut: boolean;
// }

// const closeButtonStyles = {
//   border: 'none',
//   background: 'none',
//   fontSize: '24px',
//   cursor: 'pointer',
// } as {};

// const TallModal = ({
//   isOpen,
//   onCancel,
//   size,
//   title,
//   animateOut,
//   children,
// }: ModalProps) => {
//   let animateClass = '';

//   if (!isOpen && !animateOut) return '';
//   if (isOpen && animateOut) animateClass = 'animate-modal-out';
//   if (isOpen && !animateOut) animateClass = 'animate-modal-in';

//   let modalStyles = '';

//   if (size === 'lg') {
//     modalStyles += 'min-w-4xl max-w-4xl ';
//   }

//   return createPortal(
//     // body
//     <div
//       className="fixed inset-0 z-1000  bg-black/60 dark:bg-black/40  flex justify-center "
//       style={{ backgroundColor: 'rgb(0 ,0, 0, .3)' }}
//     >
//       {/* modal */}
//       <div
//         className={`${modalStyles} ${animateClass} translate-y-7 max-w-md bg-white dark:border dark:border-slate-700/80  dark:bg-slate-800 self-center rounded-sm `}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="w-full bg-neutral-200/30 dark:bg-slate-900 dark:border-slate-700/60  p-3 py-4 flex justify-between align-center border-b border-gray-200 dark:border-b-slate-700/60  ">
//           <h2 className="m-0 p-0 text-2xl text-neutral-800 dark:text-gray-200">
//             {title}
//           </h2>
//           <button style={closeButtonStyles} onClick={onCancel}>
//             <X className="text-gray-500 hover:text-gray-700 dark:text-neutral-300 dark:hover:text-neutral-100 transition-all duration-200"></X>
//           </button>
//         </div>
//         <div className="px-2 dark:bg-slate-900">{children}</div>
//       </div>
//     </div>,
//     document.body,
//   );
// };

// export default TallModal;
