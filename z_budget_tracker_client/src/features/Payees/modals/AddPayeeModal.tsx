import { useState } from 'react';
import Modal, { type ModalSize } from '../../../../misc/Modal';
import PayeeForm from '../PayeeForm';
import Modal2 from '../../../components/Modal2';

interface Props {
  size: ModalSize;
  onCancelForm: () => void;
  isOpen: boolean;
}

const AddPayeeModal = ({ onCancelForm, isOpen, size }: Props) => {
  const [animateOut, setAnimateOut] = useState(false);

  const newPayee: Payee = {
    id: 0,
    name: '',
    additionalInformation: '',
    accountName: '',
    isActive: true,
    payeeTypeId: 1,
    accountId: 1,
    categoryId: 1,
  };
  return (
    <Modal2
      isOpen={isOpen}
      animateOut={animateOut}
      onCancel={onCancelForm}
      size={size}
      title="Add Payee"
    >
      <div className="p-1 pb-3">
        <PayeeForm
          payee={newPayee}
          mode="modal"
          onCancel={() => {
            setAnimateOut(true);
            onCancelForm();
          }}
        ></PayeeForm>
        
      </div>
    </Modal2>
  );
};
export default AddPayeeModal;
