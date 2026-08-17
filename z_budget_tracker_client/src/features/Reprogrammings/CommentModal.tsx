import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import Button from '../../components/Button';
import Modal2, { type ModalSize } from '../../components/Modal2';

type Props = {
  size?: ModalSize;
  isOpen: boolean;
  uuid: number;
  accountName?: string;
  itemComment: string;
  onCommentSaved: (e: { uuid: number; text: string }) => void;
  onCancel: () => void;
};

const CommentModal = ({ itemComment, uuid, ...props }: Props) => {
  const [animateOut, setAnimateOut] = useState(false);
  // const [hasComment, setHasComment] = useState<boolean>(false);
  const [comment, setComment] = useState(itemComment);
  const [isDirty, setIsDirty] = useState(false);
  const [priorComment, setPriorComment] = useState('');

  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDirty(true);
    setPriorComment(comment);
    try {
      props.onCommentSaved({ uuid, text: comment });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Modal2 size="lg" title="Add a New Line" animateOut={animateOut} {...props}>
      {/* <pre>{JSON.stringify(selections)}</pre> */}

      <div className="mb-5">
        <div className="">
          {/* <div>
            <div className="entity-label"> Account </div>
            <div className="entity-name mb-5"> {accountName} </div>
          </div> */}
        </div>

        <div className="entity-label mb-1"> Comments </div>
        <form onSubmit={onSubmit}>
          <textarea
            value={comment}
            className="w-full border border-neutral-300 rounded-sm p-2 outline-none focus:outline-none focus:ring-2 focus:ring-neutral-400 transition-all duration-300 ease-in-out"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setComment(e.target.value.trim());
            }}
          ></textarea>
          <div className="text-end">
            <button
              type="button"
              className="text-sm text-neutral-600 mb-2 hover:text-neutral-950 cursor-pointer"
              onClick={() => {
                setComment('');
              }}
            >
              Clear Comment
            </button>
          </div>
          <div className="flex justify-end gap-3 pt-2 ">
            <Button type="submit">Save</Button>
            <Button
              buttonSize="small"
              type="button"
              variation="secondary"
              onClick={() => {
                if (!isDirty) {
                  setComment('');
                } else {
                  setComment(priorComment);
                }

                setAnimateOut(true);
                setTimeout(() => {
                  setAnimateOut(false);
                }, 500);

                props.onCancel();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal2>
  );
};
export default CommentModal;
