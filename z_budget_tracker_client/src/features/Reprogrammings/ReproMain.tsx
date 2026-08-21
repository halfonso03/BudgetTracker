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
  if (!isSuccess || !reproFromDb) return <div>Error</div>;

  const repro: Repro = {
    ...reproFromDb,
    lineItems: reproFromDb.lineItems!.map((l) => {
      const curAmount =
        reproFromDb.rowBalances
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
        rowBalances: reproFromDb.rowBalances,
      };
    }),
  };

  console.log('repro main render');

  return <ReproForm startYear={year} repro={repro}></ReproForm>;
};
export default ReproMain;
