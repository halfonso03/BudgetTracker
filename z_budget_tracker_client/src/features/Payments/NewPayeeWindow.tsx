import { useState } from 'react';
import Modal2 from '../../components/Modal2';
import PayeeForm from '../Payees/PayeeForm';

type Props = {
  isOpen: boolean;
  onCancel: () => void;
  onPayeeCreated: (details: NewPayeeInfo) => void;
};

const NewPayeeWindow = ({ ...props }: Props) => {
  const [animateOut, setAnimateOut] = useState(false);

  const payee = {
    id: 0,
    name: '',
    additionalInformation: '',
    accountName: '',
    isActive: true,
    payeeTypeId: 0,
    accountId: 0,
    categoryId: 0,
    numberOfPayments: 0,
  };
  return (
    <Modal2 size="md" title="Add New Payee" animateOut={animateOut} {...props}>
      <div className="pb-4">
        <PayeeForm
          mode="modal"
          payee={payee}
          onCancel={() => {
            props.onCancel();
            setAnimateOut(true);
            setTimeout(() => {
              setAnimateOut(false);
            }, 500);
          }}
          onCreatePayeeCreated={props.onPayeeCreated}
        ></PayeeForm>
      </div>

      <div className="flex justify-end gap-3">
        {/* <Button
          variation="secondary"
          onClick={() => {
            props.onCancel();
            setAnimateOut(true);
            setTimeout(() => {
              setAnimateOut(false);
            }, 500);
          }}
        >
          Close
        </Button> */}
      </div>
    </Modal2>
  );
};
export default NewPayeeWindow;
