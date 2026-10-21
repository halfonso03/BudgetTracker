import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { StickyNote } from 'lucide-react';

interface Props {
  uuid: string;
  canEdit: boolean;
  itemComment?: string | null | undefined;
  saveComment: (uuid: string, comment: string | null | undefined) => void;
}

const CommentToggler = ({ uuid, itemComment, saveComment, canEdit }: Props) => {
  console.log('CommentToggler render');

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const [isOpenerClass, setIsOpenerClass] = useState<string>('');
  const [comment, setComment] = useState<string | null | undefined>(
    itemComment,
  );

  const close = () => {
    if (isOpenerClass !== '') {
      setIsOpenerClass('');
      saveComment(uuid, comment);
    }
  };

  const ref = useOutsideClick<HTMLDivElement>(close, false);

  useEffect(() => {
    if (isOpenerClass.includes('open') && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isOpenerClass]);

  return (
    <div className="relative" ref={ref}>
      <StickyNote size={22}
        onClick={() =>
          setIsOpenerClass((prev) => (prev === ' open ' ? '' : ' open '))
        }
        className={`cursor-pointer z-1 hover:scale-120 duration-200 transition-all ${
          comment && comment.length ? 'text-blue-500' : 'text-neutral-500'
        }`}
      />

      {/* 
        The Menu Wrapper - Cleaned up to allow your custom .menu and .open transitions to finish completely
      */}
      <div
        className={`absolute flex flex-col w-80 right-0 top-9 z-99999 menu ${isOpenerClass}`}
      >
        {/* 
          The Note Body
          Using a clip-path polygon block again, which perfectly chops off the 5px border.
          With inline opacity overrides removed, this fills 100% solid yellow once the animation finishes.
        */}
        <div
          className="relative flex flex-col rounded-md border-[5px] border-yellow-400 bg-[#fde047] p-3 pt-6 overflow-hidden"
          style={{
            clipPath:
              'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)',
          }}
        >
          {/* 
            45-Degree Folded Flap
            Perfectly aligned to sit over the clipped border gap, completely solid.
          */}
          <div className="absolute top-0 right-0 w-[24px] h-[24px] pointer-events-none bg-yellow-400 border-b-[5px] border-l-[5px] border-yellow-500 rounded-bl-sm shadow-[-2px_2px_3px_rgba(0,0,0,0.15)] z-20" />

          <textarea
            placeholder="Enter a comment. Click anywhere outside of the sticky to save the comment."
            value={comment ?? ''}
            ref={textAreaRef}
            rows={7}
            disabled={!canEdit}
            className="w-full text-neutral-800 bg-transparent p-2 mt-2 outline-none focus:outline-none transition-all duration-300 ease-in-out resize-none z-10 font-medium"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setComment(e.target.value);
            }}
          />

          <div className="flex justify-end mt-2 z-10">
            {canEdit && (
              <button
                className="text-neutral-600 text-sm font-semibold cursor-pointer hover:text-neutral-900 transition-colors"
                onClick={() => setComment('')}
              >
                Click to Clear Comment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentToggler;

// import { useEffect, useRef, useState, type ChangeEvent } from 'react';
// import { useOutsideClick } from '../../hooks/useOutsideClick';
// import { StickyNote, TriangleRight } from 'lucide-react';

// interface Props {
//   uuid: string;
//   canEdit: boolean;
//   itemComment?: string | null | undefined;
//   saveComment: (uuid: string, comment: string | null | undefined) => void;
// }

// const CommentToggler = ({ uuid, itemComment, saveComment, canEdit }: Props) => {
//   console.log('CommentToggler render');

//   const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

//   const [isOpenerClass, setIsOpenerClass] = useState<string>('');
//   const [comment, setComment] = useState<string | null | undefined>(
//     itemComment,
//   );
//   const close = () => {
//     if (isOpenerClass !== '') {
//       setIsOpenerClass('');
//       saveComment(uuid, comment);
//     }
//   };

//   const ref = useOutsideClick<HTMLDivElement>(close, false);

//   useEffect(() => {
//     if (textAreaRef.current) {
//       textAreaRef.current.focus();
//     }
//   }, []);

//   return (
//     <div className="relative" ref={ref}>
//       <div className="relative">
//         <StickyNote
//           onClick={() =>
//             setIsOpenerClass((prev) => (prev == ' open ' ? '' : ' open '))
//           }
//           className={`cursor-pointer z-1  ${comment && comment.length ? 'text-blue-500' : 'text-neutral-500'}`}
//         ></StickyNote>
//       </div>

//       <div
//         className={`absolute flex flex-col w-80 right-0 top-9 z-200 menu ${isOpenerClass}`}
//       >
//         <div className="relative flex-col rounded-md border-2 border-yellow-400 bg-yellow-300 p-1 pt-2  ">
//           <TriangleRight className="absolute z-20001 text-white bg-clip-text border-white bg-transparent fill-white  rotate-180 -top-1.5 -left-1  "></TriangleRight>
//           <span className="border-0 border-b-2 -left-px -top-0.75 w-6.25 h-[19.5px] rotate-[-0.69rad] border-yellow-400  absolute origin-bottom-left  z-20002 "></span>
//           <textarea
//             placeholder="Enter a comment. Click anywhere outside of the sticky to save the comment."
//             value={comment ?? ''}
//             ref={textAreaRef}
//             rows={7}
//             disabled={!canEdit}
//             className="w-full text-neutral-700  p-2 outline-none focus:outline-none  transition-all duration-300 ease-in-out resize-none"
//             onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
//               setComment(e.target.value);
//             }}
//           ></textarea>
//           <div className="flex justify-end">
//             {canEdit && (
//               <button
//                 className="text-neutral-500 text-sm cursor-pointer"
//                 onClick={() => setComment('')}
//               >
//                 Click to Clear Comment
//               </button>
//             )}
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };
// export default CommentToggler;
