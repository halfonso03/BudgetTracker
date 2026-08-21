import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import Button from '../../components/Button';
import Modal2, { type ModalSize } from '../../components/Modal2';

type Props = {
  size?: ModalSize;
  isOpen: boolean;
  itemComment: string;
  onCommentSaved: (text: string) => void;
  onCancel: () => void;
};

const JustificaModal = ({ itemComment, ...props }: Props) => {
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
      props.onCommentSaved(comment);
      setAnimateOut(true);
      setTimeout(() => {
        setAnimateOut(false);
      }, 600);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Modal2 size="lg" title="Justification" animateOut={animateOut} {...props}>
      {/* <pre>{JSON.stringify(selections)}</pre> */}

      <div className="mb-1">
        <div className="text-neutral-700 font-semibold mb-1">Enter a Justification </div>
        <form onSubmit={onSubmit}>
          <textarea
            value={comment}
            className="w-full border border-neutral-300 rounded-sm p-2 outline-none focus:outline-none focus:ring-2 focus:ring-neutral-400 transition-all duration-300 ease-in-out"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
              setComment(e.target.value);
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
              Clear
            </button>
          </div>
          <div className="flex justify-end gap-3 pt-2 ">
            <Button type="submit">Save</Button>
            <Button
              buttonSize="small"
              type="button"
              variation="secondary"
              onClick={() => {
                setAnimateOut(true);
                setTimeout(() => {
                  if (!isDirty) {
                    setComment('');
                  } else {
                    setComment(priorComment);
                  }
                  setAnimateOut(false);
                }, 600);

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
export default JustificaModal;
