import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useGetRepro from '../../api/hooks/repro/useGetRepro';
import ReproForm from './ReproForm';

import { useState } from 'react';
import Button from '../../components/Button';
import { Search } from 'lucide-react';
import ChooseYearModal from './ChooseYearModal';

const ReproMain = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const preloadState = location.state;

  const reproId = id !== undefined ? +id : undefined;

  const {
    data: reproFromDb,
    isLoading,
    isFetching,
    isSuccess,
  } = useGetRepro(reproId);

  const [choosingYear, setChoosingYear] = useState(false);
  const [newReproJustification, setNewReproJustification] = useState('');
  const [savedJustification, setSavedJustification] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(0);

  let initialYear = 0;

  if (reproFromDb?.lineItems[0]?.year) {
    initialYear = reproFromDb?.lineItems[0]?.year;
  } else if (preloadState && preloadState.ids && preloadState.ids.year) {
    initialYear = preloadState.ids.year;
  } else if (selectedYear !== 0) {
    initialYear = selectedYear;
  }
  const [year, setYear] = useState<number>(initialYear);

  let repro: Repro;
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
      rowId: 0,
      uuid: crypto.randomUUID(),
      initiativeId: preloadState.ids.initiativeId,
      grantId: preloadState.ids.grantId,
      categoryId: preloadState.ids.categoryId,
      accountId: preloadState.ids.accountId,
      initiativeName: preloadState.ids.initiativeName,
      grantName: preloadState.ids.grantName,
      categoryName: preloadState.ids.categoryName,
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
    year: initialYear,
    justification: savedJustification,
    createdBy: '',
    createdById: 0,
    posted: false,
    createDate: new Date(),
    rowBalances: rowBalances,
    lineItems: lineItems,
  };


  if (reproId !== 0 && reproFromDb) {
    repro = createReproFromDb(reproFromDb);
  } else if (year > 0) {
    repro = defaultRepro;
  }

  if (isLoading || isFetching) return <div>Loading...</div>;
  if (reproId && (!isSuccess || !reproFromDb)) return <div>Error1</div>;

  const handleYearSelected = (e: { year: number; justification: string }) => {
    setYear(e.year);
    setSelectedYear(e.year);
    setNewReproJustification('');
    setSavedJustification(e.justification);

    if (location.pathname !== '/reprogramming') navigate('/reprogramming');
    setTimeout(() => {
      setChoosingYear(false);
    }, 500);
  };

  function handleInitialSaved(id: number) {
    // setTimeout(() => navigate(`/reprogramming/${id}`), 1600);
  }

  const body = () => {
    if (repro) {
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
      <div className="flex justify-end gap-3 mt-6">
        <Button
          buttonSize="small"
          variation="primary"
          onClick={() => {
            setChoosingYear(true);
          }}
        >
          Start New...
        </Button>
        <Button
          buttonSize="xsmall"
          variation="secondary"
          disabled={year > 0}
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
    year: repro2.lineItems[0].year!,
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
