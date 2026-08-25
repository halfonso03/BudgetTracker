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

      console.log('data', data)
      navigate('/reprogramming', {
        state: {
          balances: data,
          ids: {
            year: +year!,
            initiativeId: +initiativeId!,
            grantId: +grantId!,
            categoryId: +categoryId!,
            accountId: +accountId!,
          },
        },
      });
    }
  });

  //   if (
  //     initiativeId !== undefined &&
  //     grantId !== undefined &&
  //     categoryId !== undefined &&
  //     accountId !== undefined
  //   ) {
  //     // setPreloadedLine();
  //   }

  return <div>ReproPreload</div>;
};
export default ReproPreload;
