import Button from '../../components/Button';
import Modal, { type ModalSize } from '../../components/Modal';
import { useState, type ChangeEvent, type SubmitEvent } from 'react';

interface Props {
  accountId: number;
  size?: ModalSize;
  onCommentSaved: (e: { accountId: number; text: string }) => void;
  onCancelForm: () => void;
  accountName?: string;
  isOpen: boolean;
  animateOut: boolean;
}

const CommentsModalNewBudget = ({
  accountId,
  accountName,
  onCancelForm,
  size = 'md',
  onCommentSaved,
  isOpen,
  animateOut,
}: Props) => {
  const [comment, setComment] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [priorComment, setPriorComment] = useState('');
  function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDirty(true);
    setPriorComment(comment);
    try {
      onCommentSaved({ accountId, text: comment });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      animateOut={animateOut}
      onClose={onCancelForm}
      size={size}
      title="Comments"
    >
      <div className="px-5 mb-5">
        <div className="">
          <div>
            <div className="entity-label"> Account </div>
            <div className="entity-name mb-5"> {accountName} </div>
          </div>
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
          <div className="flex justify-end gap-3 pt-3 ">
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
                onCancelForm();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default CommentsModalNewBudget;
