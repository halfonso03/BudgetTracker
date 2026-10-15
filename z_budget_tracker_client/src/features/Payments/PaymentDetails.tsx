import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useHasUnsavedChangesStore } from '../../state/useHasUnsavedChangesStore';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';
import useClientAuth from '../../contexts/useAuth';
import { usePaymentMutations } from '../../api/hooks/payments/usePaymentMutations';
import PaymentControls from './PaymentControls';
import PaymentForm from './PaymentForm';
import useGetPayment from '../../api/hooks/payments/useGetPayment';

const PaymentDetails = () => {
  console.log('PaymentDetails render');
  // const { userId } = useAuth();

  const navigate = useNavigate();
  const { id } = useParams();
  const { hasUnsavedChanges, setHasUnsavedChanges } =
    useHasUnsavedChangesStore();
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const paymentId = id !== undefined ? +id : undefined;
  const { user } = useClientAuth();

  const {
    data: paymentFromDb,
    isFetching,
    isLoading,
  } = useGetPayment(paymentId ?? 0);

  const { duplicatePayment } = usePaymentMutations();

  if (isLoading || isFetching) return <div></div>;

  const handleYearSelected = (year: number, justification: string) => {
    setHasUnsavedChanges(false);

    navigate('/payments/new', {
      state: {
        year: year,
        justification: justification,
      },
    });
  };

  function handleInitialSaved(id: number) {
    setTimeout(() => navigate(`/payments/${id}`), 1000);
  }

  function handleIsDirty(isDirty: boolean) {
    // isDirty will always be true
    setHasUnsavedChanges(isDirty);
  }

  function handleSaved() {
    setHasUnsavedChanges(false);
  }

  function handleSearchClick() {
    if (hasUnsavedChanges) {
      setConfirmModalIsOpen(true);
    } else {
      navigate('/payments/search');
    }
  }

  async function handleDuplicatePayment() {
    setTimeout(async () => {
      try {
        await duplicatePayment.mutateAsync(
          { id: paymentFromDb!.id!, userId: +user!.id! },
          {
            onSuccess: async (payment) => {
              console.log('payment', payment)
              toast.success(
                <div>
                  <div className="pb-1">{`Payment Id ${+id!} duplicated.`}</div>
                  <div>{`Opening payment id ${payment.id}.`}</div>
                </div>,

                {
                  duration: 2000,
                },
              );

              setTimeout(() => {
                navigate(`/payments/${payment.id}`);
              }, 2000);
            },
          },
        );
      } catch (error) {
        console.log('e', error);
      }
    }, 500);
  }

  const body = () => {
    if (paymentFromDb && paymentFromDb.year !== 0) {
      const payment2 = createPaymentFromDb(paymentFromDb);
      return (
        <>
          <PaymentForm
            key={payment2.uuid}
            payment={payment2}
            onInitialSave={handleInitialSaved}
            onSaved={handleSaved}
            onIsDirty={handleIsDirty}
          ></PaymentForm>
        </>
      );
    }
    return null;
  };
  return (
    <div>
      <PaymentControls
        paymentId={paymentFromDb?.id}
        onYearSelected={handleYearSelected}
        onSearchClick={handleSearchClick}
        onDuplicatePayment={handleDuplicatePayment}
      ></PaymentControls>
      {body()}
      <ConfirmModal
        isOpen={confirmModalIsOpen}
        onCancel={() => {
          setTimeout(() => {
            setConfirmModalIsOpen(false);
          }, 500);
        }}
        onConfirm={() => {
          setHasUnsavedChanges(false);
          navigate('/payments/search');
        }}
        message="Are you sure you wish to leave this page? Any changes made to this entry will be lost. Click OK to continue."
      ></ConfirmModal>
    </div>
  );
};

export default PaymentDetails;

function createPaymentFromDb(payment: Payment): Payment {
  const payment2: Payment = {
    ...payment,
    justification: payment.justification.trim(),
    uuid: crypto.randomUUID(),
    lineItems: payment.lineItems!.map((l) => {
      return {
        ...l,
        uuid: window.crypto.randomUUID(),
      };
    }),
  };

  return payment2;
}
