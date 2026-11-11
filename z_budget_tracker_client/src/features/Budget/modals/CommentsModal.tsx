import { useForm } from 'react-hook-form';
import { CheckCircle } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { useCommentActions } from '../../../api/hooks/budgets/useCommentsActions';
import Button from '../../../components/Button';
import type { ModalSize } from '../../../components/Modal2';
import { formatDate } from '../../../app/util';
import Modal2 from '../../../components/Modal2';
import Label from '../../../components/Label';

interface Props {
  initiativeId: number;
  grantId: number;
  accountId: number;
  size?: ModalSize;
  onCommentSaved: () => void;
  onCancelForm: () => void;
  accountName?: string;
  isOpen: boolean;
  animateOut: boolean;
  comment?: BudgetComment;
}

type CommentsFormValues = {
  commentId: number;
  initiativeId: number;
  grantId: number;
  accountId: number;
  text: string;
};

const CommentsModal = ({
  initiativeId,
  grantId,
  accountId,
  accountName,
  onCancelForm,
  size = 'md',
  onCommentSaved,
  isOpen,
  animateOut,
  comment,
}: Props) => {
  const userId = 1;
  const [priorComment, setPriorComment] = useState(comment?.text);

  const [commentFieldEmpty, setCommentFieldEmpty] = useState<boolean>(() => {
    if (comment) {
      return comment.id === 0 && comment.text.trim() == '';
    }
    return true;
  });

  const {
    createComment,
    updateComment,
    createCommentPending,
    updateCommentPending,
    createCommentSuccess,
  } = useCommentActions();

  const { handleSubmit, register, setValue } = useForm({
    defaultValues: {
      commentId: comment?.id ?? 0,
      text: comment?.text ?? '',
      initiativeId: initiativeId,
      grantId: grantId,
      accountId: accountId,
    },
  });

  async function performSaveAction(action: () => void) {
    await new Promise((resolve) => {
      action();
      resolve(null);
    }).then(() => {
      setTimeout(() => {
        onCommentSaved();
      }, 400);
    });
  }

  async function onSubmit(data: CommentsFormValues) {
    setPriorComment(data.text);
    try {
      if (!comment || comment.id === 0) {
        performSaveAction(() =>
          createComment({
            ...data,
            userId: userId!,
          }),
        );
      } else {
        performSaveAction(() =>
          updateComment({
            id: data.commentId,
            initiativeId: initiativeId,
            grantId: grantId,
            accountId: accountId,
            text: data.text,
            userId: userId!,
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal2
      isOpen={isOpen}
      animateOut={animateOut}
      onCancel={onCancelForm}
      size={size}
      title="Comments"
    >
      <div>
        <div className="mb-3">
          <div className="grid grid-cols-[2fr_1fr]">
            <div>
              <Label>Account</Label>
              <div className="dark:text-slate-100"> {accountName} </div>
            </div>
          </div>
        </div>

        <div className="">
          <div className="flex justify-between pb-1">
            <div className='self-end'>
              <Label>Comments</Label>
            </div>
            <div>
              <div className="text-sm text-end text-neutral-700 dark:text-slate-400 font-semibold">
                {comment && comment.updateDate && 'Updated'}
                {comment &&
                  comment.entryDate &&
                  !comment.updateDate &&
                  'Entered'}
              </div>
              <div className="text-sm text-end text-neutral-600 dark:text-white font-semibold">
                {comment &&
                  comment.entryDate &&
                  !comment.updateDate &&
                  formatDate(comment.entryDate)}
                {comment &&
                  comment.updateDate &&
                  formatDate(comment.updateDate)}
              </div>
            </div>
          </div>

          <form
            onSubmit={(event) => {
              event.stopPropagation();
              handleSubmit(onSubmit)(event);
            }}
          >
            <textarea
              {...register('text')}
              className="w-full border border-neutral-300 dark:border-slate-700/80  dark:bg-slate-900 rounded-sm p-2 outline-none focus:outline-none dark:text-white focus:ring-1 focus:ring-neutral-300 dark:focus:ring-indigo-500 transition-all duration-300 ease-in-out"
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                if (!comment || comment.id === 0) {
                  if (e.target.value.trim() == '') {
                    setCommentFieldEmpty(true);
                  } else {
                    setCommentFieldEmpty(false);
                  }
                }
              }}
            ></textarea>
            <div className="text-end">
              {comment && comment.text != '' && (
                <button
                  type="button"
                  className="text-sm text-neutral-600 mb-2 hover:text-neutral-950 cursor-pointer dark:text-slate-400 dark:hover:text-slate-200 transition-all "
                  onClick={() => {
                    setValue('text', '');
                  }}
                >
                  Clear Comment
                </button>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                buttonSize="medium"
                type="submit"
                disabled={
                  createCommentPending ||
                  updateCommentPending ||
                  commentFieldEmpty
                }
              >
                {createCommentPending || updateCommentPending ? (
                  <div className="animate-spin h-6 w-6 border-4 border-gray-200 border-t-transparent border-b-transparent rounded-full"></div>
                ) : createCommentSuccess || updateCommentPending ? (
                  <CheckCircle></CheckCircle>
                ) : (
                  'Save'
                )}
              </Button>
              <Button
                buttonSize="small"
                type="button"
                variation="secondary"
                onClick={() => {
                  setValue('text', priorComment ?? '');
                  onCancelForm();
                }}
                disabled={createCommentPending || updateCommentPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal2>
  );
};
export default CommentsModal;
