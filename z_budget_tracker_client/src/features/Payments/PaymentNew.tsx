import { useLocation, useNavigate } from 'react-router-dom';
import useClientAuth from '../../contexts/useAuth';
import { useEffect, useState } from 'react';
import PaymentForm from './PaymentForm';
import PaymentControls from './PaymentControls';

const PaymentNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preloadState = location.state;
  const { user } = useClientAuth();
  const lineItems: PaymentLineItem[] = [];

  // const { hasUnsavedChanges, setHasUnsavedChanges } =
  //   useHasUnsavedChangesStore();

  let initialYear = 0;
  let justification = '';

  if (preloadState) {
    initialYear = preloadState.year;
    justification = preloadState.justification ?? '';
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

  // function handleSearchClick() {
  //   if (hasUnsavedChanges) {
  //     setConfirmModalIsOpen(true);
  //   } else {
  //     navigate('/payment/search');
  //   }
  // }

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

  // function handleIsDirty(isDirty: boolean) {
  //   setHasUnsavedChanges(isDirty);
  // }

  const body = () => {
    if (payment && payment.year !== 0) {
      return (
        <PaymentForm
          key={payment.uuid}
          payment={payment}
          // onInitialSave={handleInitialSaved}
          // onIsDirty={handleIsDirty}
        ></PaymentForm>
      );
    }
    return null;
  };

  return (
    <>
      <PaymentControls
        onYearSelected={handleYearSelected}
        // onSearchClick={handleSearchClick}
      ></PaymentControls>
      {body()}
    </>
  );
};
export default PaymentNew;
