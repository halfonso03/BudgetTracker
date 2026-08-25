import { useNavigate, useParams } from 'react-router-dom';
import useGetRepro from '../../api/hooks/repro/useGetRepro';
import ReproForm from './ReproForm';

import { useState } from 'react';
import Button from '../../components/Button';
import { Search } from 'lucide-react';
import ChooseYearModal from './ChooseYearModal';

const ReproMain = () => {
  const navigate = useNavigate();
  const { id } = useParams();
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

  const initialyear = reproFromDb?.lineItems[0]?.year ?? 0;

  const [year, setYear] = useState<number>(initialyear);

  let repro: Repro;

  const defaultRepro: Repro = {
    id: 0,
    year: year,
    justification: savedJustification,
    createdBy: '',
    createdById: 0,
    posted: false,
    createDate: new Date(),
    lineItems: [],
    uuid: crypto.randomUUID(),
  };

  if (reproId !== 0 && reproFromDb) {
    repro = createReproFromDb(reproFromDb);
  } else if (year > 0) {
    repro = defaultRepro;
  }

  if (isLoading || isFetching) return <div>Loading...</div>;
  if (reproId && (!isSuccess || !reproFromDb)) return <div>Error1</div>;

  // console.log('reproFromDb', reproFromDb);

  const handleYearSelected = (e: { year: number; justification: string }) => {
    setYear(e.year);
    setNewReproJustification('');
    setSavedJustification(e.justification);
    navigate('/reprogramming');
    setTimeout(() => {
      setChoosingYear(false);
    }, 500);
  };

  function handleInitialSaved(id: number) {
    setTimeout(() => navigate(`/reprogramming/${id}`), 1600);
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
      <div className="flex justify-end gap-3">
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
