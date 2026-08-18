import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { StickyNote, TriangleRight } from 'lucide-react';

interface Props {
  uuid: string;
  itemComment?: string | null | undefined;
  saveComment: (uuid: string, comment: string | null | undefined) => void;
}

const CommentToggler = ({ uuid, itemComment, saveComment }: Props) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const [isOpenerClass, setIsOpenerClass] = useState<string>('');
  const [comment, setComment] = useState<string | null | undefined>(
    itemComment,
  );
  const close = () => {
    setIsOpenerClass('');
    saveComment(uuid, comment);
  };

  const ref = useOutsideClick<HTMLDivElement>(close, false);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <StickyNote
          onClick={() =>
            setIsOpenerClass((prev) => (prev == ' open ' ? '' : ' open '))
          }
          className={`cursor-pointer z-1  ${comment && comment.length ? 'text-yellow-500' : 'text-neutral-500'}`}
        ></StickyNote>
      </div>

      <div
        className={`absolute flex flex-col w-80 right-0 top-9 z-200 menu ${isOpenerClass}`}
      >
        <div className="relative flex-col rounded-md border-2 border-yellow-400 bg-yellow-300 p-1 pt-2  ">
          <TriangleRight className="absolute z-20001 text-white bg-clip-text border-white bg-transparent fill-white  rotate-180 -top-1.5 -left-1  "></TriangleRight>
          <span className="border-0 border-b-2 -left-px -top-0.75 w-6.25 h-[19.5px] rotate-[-0.69rad] border-yellow-400  absolute origin-bottom-left  z-20002 "></span>
          <textarea
            placeholder="Enter a comment. Click anywhere outside of the sticky to save the comment."
            value={comment ?? ''}
            ref={textAreaRef}
            rows={7}
            className="w-full text-neutral-700  p-2 outline-none focus:outline-none  transition-all duration-300 ease-in-out resize-none"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setComment(e.target.value);
            }}
          ></textarea>
          <div className="flex justify-end">
            <button
              className="text-neutral-500 text-sm cursor-pointer"
              onClick={() => setComment('')}
            >
              Click to Clear Comment
            </button>
          </div>

          {/* <div className="flex justify-between gap-2 my-1">
            <button className="border border-amber-700 p-1 rounded-md bg-amber-600 hover:bg-amber-500 duration-200 transition-all text-neutral-100 cursor-pointer">
              <Check size={20}></Check>
            </button>
            <button className="border border-amber-700 p-1 rounded-md bg-amber-600 hover:bg-amber-500 duration-200 transition-all text-neutral-100 cursor-pointer">
              <X size={20}></X>
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};
export default CommentToggler;
