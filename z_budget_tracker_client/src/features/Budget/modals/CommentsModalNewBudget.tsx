import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import Button from '../../../components/Button';
import type { ModalSize } from '../../../components/Modal2';
import Modal2 from '../../../components/Modal2';
import Label from '../../../components/Label';
import TextArea from '../../../components/TextArea';

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
  onCancelForm: onCancel,
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
    <Modal2
      isOpen={isOpen}
      animateOut={animateOut}
      onCancel={onCancel}
      size={size}
      title="Comments"
    >
      <div className="mb-5">
        <div className="mb-4">
          <div>
            <Label>Account</Label>
            <div className="dark:text-white font-semibold"> {accountName} </div>
          </div>
        </div>

        <div className="mb-1">
          <Label>Comments</Label>
        </div>
        <form onSubmit={onSubmit}>
          <TextArea
            value={comment}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setComment(e.target.value);
            }}
          ></TextArea>
          <div className="text-end">
            <button
              type="button"
              className="text-sm text-neutral-600 mb-2 hover:text-neutral-950 cursor-pointer  dark:text-white"
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
                onCancel();
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
export default CommentsModalNewBudget;
