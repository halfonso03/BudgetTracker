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
  currentComments,
  onCancelForm,
  onSaveComments,
  size = 'md',
}: Props) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  return (
    <Modal isOpen={true} onClose={onCancelForm} size={size} title={`Comments`}>
      <div></div>
      <div className="px-5 mb-5">
        <div className="entity-label">Account</div>
        <div className='entity-name mb-5'>{accountName}</div>
        <div className="entity-label mb-1">Comments</div>
        <textarea
          ref={ref}
          value={currentComments}
          className="w-full border border-neutral-300 rounded-sm p-2"
        ></textarea>
      </div>
      <div className="flex justify-end gap-3 p-3 border-t border-t-neutral-300">
        <Button
          buttonSize="medium"
          onClick={() =>
            onSaveComments(
              initiativeId,
              grantId,
              accountId,
              ref!.current!.value,
            )
          }
        >
          Save Comments
        </Button>

        <Button
          buttonSize="small"
          variation="secondary"
          onClick={onCancelForm}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
export default CommentsModal;
