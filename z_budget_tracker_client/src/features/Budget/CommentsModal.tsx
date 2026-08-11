import Button from '../../components/Button';
import Modal, { type ModalSize } from '../../components/Modal';
import { useCommentActions } from '../../api/hooks/useCommentsActions';
import { useForm } from 'react-hook-form';
import { CheckCircle } from 'lucide-react';
import { useState, type ChangeEvent } from 'react';
import { formatDate } from '../../app/util';

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
    <Modal
      isOpen={isOpen}
      animateOut={animateOut}
      onClose={onCancelForm}
      size={size}
      title="Comments"
    >
      <div className="px-5">
        <div className="mb-3">
          <div className="grid grid-cols-[2fr_1fr]">
            <div>
              <div className="entity-label"> Account </div>
              <div className="entity-name"> {accountName} </div>
            </div>
          </div>
        </div>

        <div className="pb-4">
          <div className="flex justify-between pb-1">
            <div className="entity-label self-end "> Comments </div>
            <div>
              <div className="text-sm text-end text-neutral-400 font-semibold">
                {comment && comment.updateDate && 'Updated'}
                {comment &&
                  comment.entryDate &&
                  !comment.updateDate &&
                  'Entered'}
              </div>
              <div className="text-sm text-end text-neutral-600 font-semibold">
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
              className="w-full border border-neutral-300 rounded-sm p-2 outline-none focus:outline-none focus:ring-1 focus:ring-neutral-300 transition-all duration-300 ease-in-out"
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
                  className="text-sm text-neutral-600 mb-2 hover:text-neutral-950 cursor-pointer"
                  onClick={() => {
                    setValue('text', '');
                  }}
                >
                  Clear Comment
                </button>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-3 ">
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
    </Modal>
  );
};
export default CommentsModal;
