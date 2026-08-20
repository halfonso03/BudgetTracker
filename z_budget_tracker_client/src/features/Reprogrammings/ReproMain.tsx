import { useParams } from 'react-router-dom';
import useGetRepro from '../../api/hooks/repro/useGetRepro';
import ReproForm from './ReproForm';
import useCategories from '../../api/hooks/common/useCategories';
import useInitiatives from '../../api/hooks/common/useInitiatives';

const ReproMain = () => {
  const { id } = useParams();
  const reproId = id !== undefined ? +id : undefined;
  const { data: reproFromDb, isLoading, isSuccess } = useGetRepro(reproId);
  const { data: initiatives, loadingInit } = useInitiatives();
  const { data: categories, loadingCat } = useCategories();

  if (loadingInit || loadingCat || isLoading) return <div>Loading...</div>;
  if (!isSuccess || !reproFromDb) return <div>Error</div>;
  if (!initiatives || !categories) return <div>Error</div>;

  let startYear = new Date().getFullYear();

  if (
    reproFromDb &&
    reproFromDb.lineItems &&
    reproFromDb.lineItems.length > 0
  ) {
    startYear = reproFromDb.lineItems[0].year!;
  }

  const repro: Repro = {
    ...reproFromDb,
    lineItems: reproFromDb.lineItems!.map((l) => ({
      ...l,
      uuid: window.crypto.randomUUID(),
      currentAmount: reproFromDb.rowBalances
        ?.filter(
          (x) =>
            x.key.initiativeId == l.initiativeId &&
            x.key.grantId == l.grantId &&
            x.key.categoryId == l.categoryId,
        )[0]
        .balances.filter((x) => x.accountId === l.accountId)[0].currentAmount ?? 0,
    })),
    rowBalances: reproFromDb.rowBalances,
  };

  console.log('repro main render')

  return (
    <ReproForm
      startYear={startYear}
      initiatives={initiatives}
      categories={categories}
      reproFromDb={repro}
    ></ReproForm>
  );
};
export default ReproMain;
