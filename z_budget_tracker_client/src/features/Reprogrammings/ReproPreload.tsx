import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import useCurrentAccountBalances from '../../api/hooks/repro/useCurrentAccountBalances';

const ReproPreload = () => {
  const { year, initiativeId, grantId, categoryId, accountId } = useParams();
  const navigate = useNavigate();

  const { data, isSuccess, isFetching, isLoading } = useCurrentAccountBalances(
    +initiativeId!,
    +grantId!,
    +categoryId!,
  );
  useEffect(() => {
    if (isSuccess) {
      navigate('/reprogramming/new', {
        state: {
          balances: data,
          ids: {
            year: +year!,
            initiativeId: +initiativeId!,
            grantId: +grantId!,
            categoryId: +categoryId!,
            accountId: +accountId!,
            initiativeName: data![0].initiativeName,
            grantName: data![0].grantName,
            categoryName: data![0].categoryName,
            accountName: data!.filter((x) => x.accountId === +accountId!)[0]
              .accountName,
          },
        },
        replace: true,
      });
    }
  }, [
    accountId,
    categoryId,
    data,
    grantId,
    initiativeId,
    isFetching,
    isSuccess,
    navigate,
    year,
  ]);
  if (isLoading) return <div>Loading...</div>;
  return <div>Redirecting...</div>;
};
export default ReproPreload;
