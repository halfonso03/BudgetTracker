import { Navigate, useParams } from 'react-router-dom';
import useRemainingAccountBalances from '../../api/hooks/payments/useRemainingAccountBalances';

const PaymentPreload = () => {
  const { year, initiativeId, grantId, categoryId, accountId } = useParams();

  const { data: balances, isSuccess } = useRemainingAccountBalances(
    +initiativeId!,
    +grantId!,
    +categoryId!,
  );

  if (!isSuccess) return null;

  const s = {
    balances: balances,
    ids: {
      year: +year!,
      initiativeId: +initiativeId!,
      grantId: +grantId!,
      categoryId: +categoryId!,
      accountId: +accountId!,
      initiativeName: balances![0].initiativeName,
      grantName: balances![0].grantName,
      categoryName: balances![0].categoryName,
      accountName: balances!.filter((x) => x.accountId === +accountId!)[0]
        .accountName,
    },
  };

  console.log('s', s);

  return <Navigate to="/payments/new" state={s}></Navigate>;
};
export default PaymentPreload;
