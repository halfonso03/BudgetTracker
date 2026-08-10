import Button from '../../components/Button';
import Modal, { type ModalSize } from '../../components/Modal';
import { useCommentActions } from '../../api/hooks/useCommentsActions';
import { useForm } from 'react-hook-form';
import useBudgetLlineItemComment from '../../api/hooks/useBudgetComments';
type Mode = 'new_budget' | 'existing_budget';

interface Props {
  mode: Mode;
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
};

const CommentsModal = ({
  mode,
  initiativeId,
  grantId,
  accountId,
  accountName,
  onCancelForm,
  size = 'md',
}: Props) => {
  const { comment, fetchingComment, fetchCommentSuccess } =
    useBudgetLlineItemComment(
      initiativeId,
      grantId,
      accountId,
      mode == 'existing_budget',
    );

  const currentComment: BudgetComment =
    (fetchCommentSuccess || mode == 'existing_budget') &&
    comment !== null &&
    comment?.id &&
    comment.text
      ? { ...comment }
      : { id: 0, text: '' };

  const { handleSubmit, register } = useForm({
    defaultValues: {
      commentId: currentComment.id,
      initiativeId: initiativeId,
      grantId: grantId,
      accountId: accountId,
      text: currentComment.text,
    },
  });

  // const { userId } = useAuth();

  const { createCommentPending, updateCommentPending } = useCommentActions();

  function onSubmit(data: CommentsFormValues) {
    console.log('data', data);
    // try {
    //   if (comment?.id === 0) {
    //     createComment({ ...data, userId: userId! });
    //   } else {
    //     updateComment({ id: data.commentId, text: data.text, userId: userId! });
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
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
            {...register('text')}
            className="w-full border border-neutral-300 rounded-sm p-2"
          ></textarea>
          <div className="flex justify-end gap-3 p-3 border-t border-t-neutral-300">
            <Button
              buttonSize="medium"
              disabled={
                fetchingComment || createCommentPending || updateCommentPending
              }
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
              disabled={
                fetchingComment || createCommentPending || updateCommentPending
              }
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
