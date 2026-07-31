import { useRef } from 'react';
import Button from '../../components/Button';
import Modal, { type ModalSize } from '../../components/Modal';

interface Props {
  initiativeId: number;
  grantId: number;
  accountId: number;
  size?: ModalSize;
  onCancelForm: () => void;
  onSaveComments: (
    initiativeId: number,
    grantId: number,
    accountId: number,
    comment: string,
  ) => void;
  currentComments?: string;
  accountName?: string;
}

const CommentsModal = ({
  initiativeId,
  grantId,
  accountId,
  accountName,
  currentComments: comments,
  onCancelForm,
  onSaveComments,
  size = 'md',
}: Props) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  return (
    <Modal
      isOpen={true}
      onClose={onCancelForm}
      size={size}
      title={`${accountName} Comments`}
    >
      <textarea ref={ref}>{comments}</textarea>
      <Button
        buttonSize="medium"
        onClick={() =>
          onSaveComments(initiativeId, grantId, accountId, ref!.current!.value)
        }
      >
        Save Comments
      </Button>

      <Button buttonSize="medium" variation="secondary" onClick={onCancelForm}>
        Cancel
      </Button>
    </Modal>
  );
};
export default CommentsModal;
