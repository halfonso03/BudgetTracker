import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../../contexts/useAuth';
// import { useState } from 'react';
import ReproForm from '../ReproForm';
import NewReproButton from './NewReproButton';

const ReproNew = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useAuth();
  const preloadState = location.state;
  const rowBalances: RowBalance[] = [];
  const lineItems: ReproLineItem[] = [];

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

  const repro: Repro = defaultRepro;

  const handleYearSelected = (year: number, justification: string) => {
    navigate('/reprogramming/new', {
      state: {
        year: year,
        justification: justification,
      },
    });
  };

  function handleInitialSaved(id: number) {
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

  const body = () => {
    console.log('repro', repro);

    if (repro && repro.year !== 0) {
      console.log('rendring form', repro);
      return (
        <ReproForm
          key={repro.uuid}
          repro={repro}
          onInitialSave={handleInitialSaved}
        ></ReproForm>
      );
    }
    return null;
  };

  return (
    <>
      <NewReproButton onYearSelected={handleYearSelected}></NewReproButton>
      {body()}
    </>
  );
};

export default ReproNew;
