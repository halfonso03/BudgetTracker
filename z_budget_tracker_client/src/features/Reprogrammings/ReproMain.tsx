import { useNavigate, useParams } from 'react-router-dom';
import useGetRepro from '../../api/hooks/repro/useGetRepro';
import ReproForm from './ReproForm';

import { useState } from 'react';
import Button from '../../components/Button';
import { Search } from 'lucide-react';
import ChooseYearModal from './ChooseYearModal';
import useAuth from '../../contexts/useAuth';

const ReproMain = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [choosingYear, setChoosingYear] = useState(false);
  const [year, setYear] = useState<number>(0);
  const [justification, setJustification] = useState('');

  const { login, userId } = useAuth();

  const reproId = id !== undefined ? +id : undefined;
  const { data: reproFromDb, isLoading, isSuccess } = useGetRepro(reproId);

  if (year == 0 && reproFromDb && reproFromDb.lineItems.length > 0) {
    setJustification(reproFromDb.justification);
    setYear(reproFromDb.lineItems[0]!.year!);
  }
  // const justification = (reproFromDb && reproFromDb.lineItems.length > 0) ? reproFromDb.justification : '';

  if (isLoading) return <div>Loading...</div>;
  if (reproId && (!isSuccess || !reproFromDb)) return <div>Error1</div>;

  const repro: Repro =
    reproFromDb !== undefined
      ? createRepro(reproFromDb)
      : {
          id: 0,
          justification: justification,
          createdBy: '',
          createdById: 0,
          posted: false,
          createDate: new Date(),
          lineItems: [],
          started: false,
        };

  function handleInitialSaved(newId: boolean) {
    // setTimeout(() => {
    //   navigate(`/reprogramming/${newId}`);
    // }, 2000);
  }

  function handleLogin() {
    login(1);
  }
  console.log('userId', userId)

  return (
    <>
      <div className="flex justify-end gap-3">
        {!userId && <Button onClick={handleLogin}>Login </Button>}
        <Button
          buttonSize="small"
          variation="primary"
          onClick={() => setChoosingYear(true)}
          disabled={year > 0}
        >
          Start New...
        </Button>
        {/*  disabled based on status */}
        <Button
          buttonSize="xsmall"
          variation="secondary"
          disabled={year > 0}
          onClick={() => navigate('search')}
        >
          <Search></Search>
        </Button>
        {/* <Button
          variation="danger"
          buttonSize="small"
          disabled={year === 0}
          onClick={() => {
            setIsDiscarding(true);
          }}
        >
          Discard
        </Button> */}
      </div>
      {year !== 0 && (
        <ReproForm
          startYear={year}
          repro={repro}
          onInitialSave={handleInitialSaved}
        ></ReproForm>
      )}
      <ChooseYearModal
        isOpen={choosingYear}
        onYearSelected={({ year, justification }) => {
          setYear(year);
          setJustification(justification);
          setTimeout(() => {
            setChoosingYear(false);
          }, 500);
        }}
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

function createRepro(repro2: Repro): Repro {
  const repro: Repro = {
    ...repro2,
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
