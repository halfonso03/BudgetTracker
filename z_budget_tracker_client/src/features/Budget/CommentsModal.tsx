import Button from '../../components/Button';
import Modal, { type ModalSize } from '../../components/Modal';
import { useCommentActions } from '../../api/hooks/useCommentsActions';
import { useForm } from 'react-hook-form';
import useAuth from '../../contexts/useAuth';
import { CheckCircle } from 'lucide-react';
type Mode = 'new_budget' | 'existing_budget';

interface Props {
  mode: Mode;
  initiativeId: number;
  grantId: number;
  accountId: number;
  commentId: number;
  commentText: string;
  size?: ModalSize;
  onCommentSaved: () => void;
  onCancelForm: () => void;
  accountName?: string;
}

type CommentsFormValues = {
  commentId: number;
  initiativeId: number;
  grantId: number;
  accountId: number;
  text: string;
};

const CommentsModal = ({
  mode,
  initiativeId,
  grantId,
  accountId,
  accountName,
  onCancelForm,
  commentText,
  commentId,
  size = 'md',
  onCommentSaved,
}: Props) => {
  const userId = 1;

  const {
    createComment,
    updateComment,
    createCommentPending,
    updateCommentPending,
    createCommentSuccess,
    updateCommentSuccess,
  } = useCommentActions();

  console.log('commentId', commentId);
  console.log('commentText', commentText);

  const { handleSubmit, register } = useForm({
    defaultValues: {
      commentId: commentId,
      text: commentText,
      initiativeId: initiativeId,
      grantId: grantId,
      accountId: accountId,
    },
  });

  async function onSubmit(data: CommentsFormValues) {
    console.log('1234', 1234, commentId);
    if (mode == 'existing_budget') {
      try {
        if (commentId === 0) {
          // console.log('{ ...data, userId: userId! }', {
          //   ...data,
          //   userId: userId!,
          // });
          // createComment({
          //   ...data,
          //   userId: userId!,
          // });
        } else {
          await new Promise((resolve) => {
            updateComment({
              id: data.commentId,
              text: data.text,
              userId: userId!,
            });
            resolve('');
          }).then(() => {
            setTimeout(() => {
              onCommentSaved();
            }, 1500);
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Modal isOpen={true} onClose={onCancelForm} size={size} title={`Comments`}>
      <div className="px-5 mb-5">
        <div className="entity-label"> Account </div>
        <div className="entity-name mb-5"> {accountName} </div>
        <div className="entity-label mb-1"> Comments </div>
        <form
          onSubmit={(event) => {
            event.stopPropagation();
            handleSubmit(onSubmit)(event);
          }}
        >
          {/* CommentId:
          <input type="text" {...register('commentId')} />
          <br />
          Initiative:
          <input type="text" {...register('initiativeId')} />
          <br />
          Grant:
          <input type="text" {...register('grantId')} />
          <br />
          Account:
          <input type="text" {...register('accountId')} />
          <br /> */}
          <textarea
            {...register('text')}
            className="w-full border border-neutral-300 rounded-sm p-2"
          ></textarea>
          <div className="flex justify-end gap-3 pt-3 ">
            {updateCommentPending && <div>test</div>}
            <Button
              buttonSize="medium"
              type="submit"
              disabled={
                createCommentPending ||
                updateCommentPending ||
                createCommentSuccess
              }
            >
              {createCommentPending || updateCommentPending ? (
                '(spinner)'
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
