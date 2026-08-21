import { useParams } from 'react-router-dom';
import useGetRepro from '../../api/hooks/repro/useGetRepro';
import ReproForm from './ReproForm';

import { useState } from 'react';

const ReproMain = () => {
  const { id } = useParams();
  const reproId = id !== undefined ? +id : undefined;
  const { data: reproFromDb, isLoading, isSuccess } = useGetRepro(reproId);

  const [year] = useState<number>(() => {
    if (
      reproFromDb &&
      reproFromDb !== undefined &&
      reproFromDb.lineItems !== undefined &&
      reproFromDb.lineItems.length > 0
    ) {
      return reproFromDb.lineItems[0]!.year!;
    } else {
      return new Date().getFullYear();
    }
  });

  if (isLoading) return <div>Loading...</div>;
  if (reproId && (!isSuccess || !reproFromDb)) return <div>Error1</div>;

  const repro: Repro =
    reproFromDb !== undefined
      ? createRepro(reproFromDb)
      : {
          id: 0,
          justification: '',
          createdBy: '',
          createdById: 0,
          posted: false,
          createDate: new Date(),
          lineItems: [],
        };

  return <ReproForm startYear={year} repro={repro}></ReproForm>;
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
