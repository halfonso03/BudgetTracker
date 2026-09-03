import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../../contexts/useAuth';
import ReproForm from '../ReproForm';
import NewReproButton from './NewReproButton';
import { useEffect, useState } from 'react';
import ConfirmModal from '../../../components/ConfirmModal';
import { useHasUnsavedChangesStore } from '../../../state/useHasUnsavedChangesStore';

const ReproNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useAuth();
  const preloadState = location.state;
  const rowBalances: RowBalance[] = [];
  const lineItems: ReproLineItem[] = [];
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);

  const { hasUnsavedChanges, setHasUnsavedChanges } =
    useHasUnsavedChangesStore();
  // const [isDirty, setIsDirty] = useState<DirtyState>({
  //   numbersAresDirty: false,
  //   formValuesIsDirty: false,
  // });

  //  preloadState
  //     ? preloadState?.year !== undefined || preloadState?.ids !== undefined
  //     :

  let initialYear = 0;
  let justification = '';

  if (preloadState) {
    if (preloadState.year) {
      initialYear = preloadState.year;
      justification = preloadState.justification ?? '';
    } else if (preloadState.ids) {
      initialYear = preloadState.ids.year;
      justification = preloadState.ids.justification ?? '';
    }

    if (preloadState.balances) {
      rowBalances.push({
        key: {
          initiativeId: preloadState.ids.initiativeId,
          grantId: preloadState.ids.grantId,
          categoryId: preloadState.ids.categoryId,
        },
        balances: preloadState.balances,
      });

      lineItems.push({
        ...preloadState.ids,
        rowId: 0,
        uuid: crypto.randomUUID(),
        accountName: '',
        currentAmount: preloadState.balances.filter(
          (x: ReproLineItem) => x.accountId === preloadState.ids.accountId,
        )[0].currentAmount,
        newAmount: 0,
      });
    }
  }

  const defaultRepro: Repro = {
    uuid: crypto.randomUUID(),
    id: 0,
    year: initialYear,
    justification: justification,
    createdBy: '',
    createdById: userId!,
    posted: false,
    createDate: new Date(),
    rowBalances: rowBalances,
    lineItems: lineItems,
  };

  const [repro, setRepro] = useState<Repro>(defaultRepro);

  useEffect(() => {
    navigate(location.pathname, { replace: true, state: {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleYearSelected = (year: number, justification: string) => {
    setRepro({
      ...defaultRepro,
      year: year,
      justification: justification,
      uuid: crypto.randomUUID(),
    });
    navigate('/reprogramming/new', {
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
        navigate(`/reprogramming/${id}`, {
          state: {
            created: true,
          },
        }),

      1600,
    );
  }

  function handleSearchClick() {
    if (hasUnsavedChanges) {
      setConfirmModalIsOpen(true);
    } else {
      navigate('/reprogramming/search');
    }
  }

  function handleIsDirty(isDirty: boolean) {
    setHasUnsavedChanges(isDirty);
  }

  const body = () => {
    if (repro && repro.year !== 0) {
      return (
        <ReproForm
          key={repro.uuid}
          repro={repro}
          onInitialSave={handleInitialSaved}
          onIsDirty={handleIsDirty}
          onSaved={() => {}}
        ></ReproForm>
      );
    }
    return null;
  };

  return (
    <>
      <NewReproButton
        onYearSelected={handleYearSelected}
        onSearchClick={handleSearchClick}
      ></NewReproButton>
      {body()}
      <ConfirmModal
        isOpen={confirmModalIsOpen}
        onCancel={() => {
          setTimeout(() => {
            setConfirmModalIsOpen(false);
          }, 500);
        }}
        onConfirm={() => {
          navigate('/reprogramming/search');
        }}
        message="There are unsaved changes in this reprogramming. Any changes made to this reprogramming will be lost. Click OK to continue."
      ></ConfirmModal>
    </>
  );
};

export default ReproNew;
