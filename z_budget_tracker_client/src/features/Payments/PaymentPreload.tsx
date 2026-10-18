import { Navigate, useParams } from 'react-router-dom';
import useAvailableAccountBalances from '../../api/hooks/payments/useAvailableAccountBalances';

const PaymentPreload = () => {
  const { year, initiativeId, grantId, categoryId, accountId } = useParams();

  const { data, isSuccess } = useAvailableAccountBalances(
    +initiativeId!,
    +grantId!,
    +categoryId!,
  );

  if (!isSuccess) return null;

  const s = {
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
  };

  return <Navigate to="/payments/new" state={s}></Navigate>;
};
export default PaymentPreload;
