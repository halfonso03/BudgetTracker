import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import useCurrentAccountBalances from '../../api/hooks/repro/useCurrentAccountBalances';

const ReproPreload = () => {
  const { year, initiativeId, grantId, categoryId, accountId } = useParams();
  const navigate = useNavigate();

  const { data } = useCurrentAccountBalances(
    +initiativeId!,
    +grantId!,
    +categoryId!,
  );


  useEffect(() => {
    if (data) {
      navigate('/reprogramming/new', {
        state: {
          balances: data,
          ids: {
            year: +year!,
            initiativeId: +initiativeId!,
            grantId: +grantId!,
            categoryId: +categoryId!,
            accountId: +accountId!,
            initiativeName: data[0].initiativeName,
            grantName: data[0].grantName,
            categoryName: data[0].categoryName,
          },
        },
      });
    }
  });


  return <div>ReproPreload</div>;
};
export default ReproPreload;
