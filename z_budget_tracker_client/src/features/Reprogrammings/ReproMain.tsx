import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useGetRepro from '../../api/hooks/repro/useGetRepro';
import ReproForm from './ReproForm';

import { useState } from 'react';
import Button from '../../components/Button';
import { Search } from 'lucide-react';
import ChooseYearModal from './ChooseYearModal';
import useAuth from '../../contexts/useAuth';

const ReproMain = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { userId } = useAuth();

  const preloadState = location.state;

  const reproId = id !== undefined ? +id : undefined;

  const { data: reproFromDb, isFetching, isSuccess } = useGetRepro(reproId);

  const [choosingYear, setChoosingYear] = useState(false);
  const [newReproJustification, setNewReproJustification] = useState('');
  // const [savedJustification, setSavedJustification] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(0);

  let initialYear;

  if (isSuccess) {
    initialYear = reproFromDb?.lineItems[0]?.year;
  } else if (preloadState?.ids.year) {
    initialYear = preloadState.ids.year;
  } else if (selectedYear !== 0) {
    initialYear = selectedYear;
  } else {
    initialYear = 0;
  }

  const rowBalances: RowBalance[] = [];
  const lineItems: ReproLineItem[] = [];

  if (preloadState) {
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

  const defaultRepro: Repro = {
    uuid: crypto.randomUUID(),
    id: 0,
    year: selectedYear,
    justification: '',
    createdBy: '',
    createdById: userId!,
    posted: false,
    createDate: new Date(),
    rowBalances: rowBalances,
    lineItems: lineItems,
  };

  const [reproState, setReproState] = useState<Repro | null>(null);

  if (selectedYear !== 0) {
    console.log('123');
  } else if (isSuccess && reproId) {
    if (selectedYear !== 0) setSelectedYear(0);

    if (isSuccess) {
      if (reproFromDb) {
        if (selectedYear !== 0) setSelectedYear(0);
        if (!reproState) {
          setReproState(createReproFromDb(reproFromDb));
        } else if (reproState && reproId !== reproState.id) {
          setReproState(createReproFromDb(reproFromDb));
        }
      }
    }
  } else {
    if (preloadState && !isFetching) {
      if (!reproState) {
        setReproState({
          ...defaultRepro,
          year: defaultRepro.lineItems[0].year!,
        });
      }
    }
  }

  const handleYearSelected = (e: { year: number; justification: string }) => {
    setSelectedYear(e.year);
    setReproState(() => ({
      ...defaultRepro,
      uuid: crypto.randomUUID(),
      justification: e.justification,
      year: e.year,
    }));

    // if (location.pathname !== '/reprogramming') {
    //   navigate('/reprogramming');
    // }

    setTimeout(() => {
      setChoosingYear(false);
    }, 500);
  };

  function handleInitialSaved(id: number) {
    setTimeout(() => navigate(`/reprogramming/${id}`), 1600);
  }

  const body = () => {
    console.log('reproState', reproState);

    if (reproState && reproState.year !== 0) {
      console.log('rendring form', reproState);
      return (
        <ReproForm
          key={reproState.uuid}
          repro={reproState}
          onInitialSave={handleInitialSaved}
        ></ReproForm>
      );
    }
    return null;
  };

  return (
    <>
      <div className="flex justify-end gap-3 mt-6">
        <Button
          buttonSize="small"
          variation="primary"
          onClick={() => {
            setChoosingYear(true);
            setNewReproJustification('');
          }}
        >
          Start New...
        </Button>
        <Button
          buttonSize="xsmall"
          variation="secondary"
          disabled={selectedYear > 0}
          onClick={() => navigate('search')}
        >
          <Search></Search>
        </Button>
      </div>
      {body()}
      <ChooseYearModal
        isOpen={choosingYear}
        newReproJustification={newReproJustification}
        onYearSelected={handleYearSelected}
        onCancel={() => {
          setTimeout(() => {
            setChoosingYear(false);
          }, 500);
        }}
      ></ChooseYearModal>
    </>
  );
};

export default ReproMain;

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
