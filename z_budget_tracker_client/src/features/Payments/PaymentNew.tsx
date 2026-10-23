import { useLocation, useNavigate } from 'react-router-dom';
import useClientAuth from '../../contexts/useClientAuth';
import { useEffect, useState } from 'react';
import PaymentForm from './PaymentForm';
import PaymentControls from './PaymentControls';
import { useHasUnsavedChangesStore } from '../../state/useHasUnsavedChangesStore';
import ConfirmModal from '../../components/ConfirmModal';

const PaymentNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preloadState = location.state;
  const { user } = useClientAuth();
  const lineItems: PaymentLineItem[] = [];
  // const rowBalances: PaymentRowBalance[] = [];
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const { hasUnsavedChanges, setHasUnsavedChanges } =
    useHasUnsavedChangesStore();

  let initialYear = 0;
  let justification = '';
  let preloadedValues: PaymentPreloadedValues | null = null;

  if (preloadState) {
    justification = preloadState.justification ?? '';
    initialYear = +preloadState.year;

    if (preloadState.ids) {
      initialYear = preloadState.ids.year;

      preloadedValues = {
        initiativeId: preloadState.ids.initiativeId,
        grantId: preloadState.ids.grantId,
        categoryId: preloadState.ids.categoryId,
        accountId: preloadState.ids.accountId,
      };
    }
  }

  const defaultPayment: Payment = {
    uuid: crypto.randomUUID(),
    id: 0,
    year: initialYear,
    justification: justification,
    createdBy: '',
    createdById: +user!.id!,
    posted: false,
    createDate: new Date(),
    lineItems: lineItems,
  };

  const [payment, setPayment] = useState<Payment>(defaultPayment);
  useEffect(() => {
    navigate(location.pathname, { replace: true, state: {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearchClick() {
    if (hasUnsavedChanges) {
      setConfirmModalIsOpen(true);
    } else {
      navigate('/payments/search');
    }
  }

  const handleYearSelected = (year: number, justification: string) => {
    setPayment({
      ...defaultPayment,
      year: year,
      justification: justification,
      uuid: crypto.randomUUID(),
    });
    navigate('/payments/new', {
      state: {
        year: year,
        justification: justification,
      },
    });
  };

  function handleInitialSaved(id: number) {
    setHasUnsavedChanges(false);
    setTimeout(
      () =>
        navigate(`/payments/${id}`, {
          state: {
            created: true,
          },
        }),
      1600,
    );
  }

  function handleIsDirty(isDirty: boolean) {
    setHasUnsavedChanges(isDirty);
  }

  const body = () => {
    if (payment && payment.year !== 0 && !isNaN(payment.year)) {
      return (
        <PaymentForm
          key={payment.uuid}
          payment={payment}
          onInitialSave={handleInitialSaved}
          onIsDirty={handleIsDirty}
          preloadedValues={preloadedValues}
        ></PaymentForm>
      );
    }
    return null;
  };

  return (
    <>
      <PaymentControls
        onYearSelected={handleYearSelected}
        onSearchClick={handleSearchClick}
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
          navigate('/reprogramming/search');
        }}
        message="There are unsaved changes in this reprogramming. Any changes made to this entry will be lost. Click OK to continue."
      ></ConfirmModal>
    </>
  );
};
export default PaymentNew;
