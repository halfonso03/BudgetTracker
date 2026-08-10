import { useState } from 'react';
import Button from '../../components/Button';
import Modal, { type ModalSize } from '../../components/Modal';
import { useCommentActions } from '../../api/hooks/useCommentsActions';
import { useForm } from 'react-hook-form';
import useAuth from '../../contexts/useAuth';
import useBudgetLlineItemComment from '../../api/hooks/useBudgetComments';

interface Props {
  initiativeId: number;
  grantId: number;
  accountId: number;
  commentId: number;
  size?: ModalSize;
  onCommentSaved: () => void;
  onCancelForm: () => void;
  text: string;
  accountName?: string;
}

type CommentsFormValues = {
  initiativeId: number;
  grantId: number;
  accountId: number;
  commentId: number;
  text: string;
};

const CommentsModal = ({
  initiativeId,
  grantId,
  accountId,
  text,
  accountName,
  onCancelForm,
  size = 'md',
}: Props) => {
  const { comment } = useBudgetLlineItemComment(
    initiativeId,
    grantId,
    accountId,
  );

  const { handleSubmit, register } = useForm({
    defaultValues: {
      commentId: comment?.id
      initiativeId: initiativeId,
      grantId: grantId,
      accountId: accountId,
      text: text,
    },
  });

  const { userId } = useAuth();

  const {
    createComment,
    createCommentPending,
    updateComment,
    updateCommentPending,
  } = useCommentActions();

  const [comment, setComment] = useState<string | undefined>(text);

  function onSubmit(data: CommentsFormValues) {
    console.log('data', data);
    try {
      if (commentId === 0) {
        createComment({ ...data, userId: userId! });
      } else {
        updateComment({ id: data.commentId, text: data.text, userId: userId! });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Modal isOpen={true} onClose={onCancelForm} size={size} title={`Comments`}>
      <div></div>
      <div className="px-5 mb-5">
        <div className="entity-label">Account</div>
        <div className="entity-name mb-5">{accountName}</div>
        <div className="entity-label mb-1">Comments</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="text" {...register('commentId')} />
          <input type="text" {...register('initiativeId')} />
          <input type="text" {...register('grantId')} />
          <input type="text" {...register('accountId')} />
          <textarea
            value={comment?.text}
            {...register('text')}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setComment(e.target.value)
            }
            className="w-full border border-neutral-300 rounded-sm p-2"
          ></textarea>
          <div className="flex justify-end gap-3 p-3 border-t border-t-neutral-300">
            <Button
              buttonSize="medium"
              disabled={createCommentPending || updateCommentPending}
            >
              {createCommentPending || updateCommentPending
                ? 'Saving...'
                : 'Save Comments'}
            </Button>

            <Button
              buttonSize="small"
              type="button"
              variation="secondary"
              onClick={onCancelForm}
              disabled={createCommentPending || updateCommentPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
export default CommentsModal;
