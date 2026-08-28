import { useNavigate, useParams } from 'react-router-dom';
import useGetRepro from '../../../api/hooks/repro/useGetRepro';
import ReproForm, { type DirtyState } from '../ReproForm';
import NewReproButton from './NewReproButton';
import { useState } from 'react';
import ConfirmModal from '../../../components/ConfirmModal';

const ReproDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDirty, setIsDirty] = useState<DirtyState>({
    numbersAresDirty: false,
    formValuesIsDirty: false,
  });

  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const reproId = id !== undefined ? +id : undefined;

  const {
    data: reproFromDb,
    isFetching,
    isLoading,
  } = useGetRepro(reproId ?? 0);

  if (isLoading || isFetching) return <div></div>;

  const handleYearSelected = (year: number, justification: string) => {
    navigate('/reprogramming/new', {
      state: {
        year: year,
        justification: justification,
      },
    });
  };

  function handleInitialSaved(id: number) {
    setTimeout(() => navigate(`/reprogramming/${id}`), 1600);
  }

  function handleIsDirty(newState: DirtyState) {
    setIsDirty(newState);
  }

  function handleSearchClick() {
    if (isDirty.formValuesIsDirty || isDirty.numbersAresDirty) {
      setConfirmModalIsOpen(true);
    } else {
      navigate('/reprogramming/search');
    }
  }


  const body = () => {
    if (reproFromDb && reproFromDb.year !== 0) {
      const repro2 = createReproFromDb(reproFromDb);
      return (
        <>
          <ReproForm
            key={repro2.uuid}
            repro={repro2}
            onInitialSave={handleInitialSaved}
            onIsDirtyStateChanged={handleIsDirty}
          ></ReproForm>
        </>
      );
    }
    return null;
  };

  return (
    <>
      <NewReproButton
        onYearSelected={handleYearSelected}
        onSearchClick={handleSearchClick}
        newMustBeConfirmed={
          isDirty.formValuesIsDirty || isDirty.numbersAresDirty
        }
      ></NewReproButton>
      {/* {JSON.stringify(isDirty)} */}
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
        message="Are you sure you wish to leave this page? Any changes made to this reprogramming will be lost. Click OK to continue."
      ></ConfirmModal>
    </>
  );
};

export default ReproDetails;

function createReproFromDb(repro2: Repro): Repro {
  const repro: Repro = {
    ...repro2,
    justification: repro2.justification.trim(),
    uuid: crypto.randomUUID(),
    lineItems: repro2.lineItems!.map((l) => {
      const curAmount =
        repro2.rowBalances
          ?.filter(
            (x) =>
              x.key.initiativeId == l.initiativeId &&
              x.key.grantId == l.grantId &&
              x.key.categoryId == l.categoryId,
          )[0]
          .balances.filter((x) => x.accountId === l.accountId)[0]
          .currentAmount ?? 0;
      return {
        ...l,
        uuid: window.crypto.randomUUID(),
        currentAmount: curAmount,
        newAmount: curAmount + Number(l.increase) - Number(l.decrease),
        rowBalances: repro2.rowBalances,
      };
    }),
  };

  return repro;
}
