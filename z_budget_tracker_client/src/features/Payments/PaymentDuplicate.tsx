import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import useClientAuth from '../../contexts/useClientAuth';
import Spinner from '../../components/Spinner';
import { usePaymentMutations } from '../../api/hooks/payments/usePaymentMutations';

const PaymnentDuplicate = () => {
  const { duplicatePayment, isDuplicating, duplicateSuccess } =
    usePaymentMutations();

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useClientAuth();

  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        duplicatePayment(
          { id: +id!, userId: +user!.id! },
          {
            onSuccess: async (repro) => {
              toast.success(
                <div>
                  <div className="pb-1">{`Payment Id ${+id!} duplicated.`}</div>
                  <div>{`Opening payment id ${repro.id}.`}</div>
                </div>,

                {
                  duration: 1500,
                },
              );

              setTimeout(() => {
                navigate(`/payments/${repro.id}`);
              }, 1500);
            },
          },
        );
      } catch (error) {
        console.log('e', error);
      }
    }, 1);
    return () => {
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {(duplicateSuccess || isDuplicating) && (
        <div className="w-full mx-auto flex justify-center ">
          <Spinner></Spinner>
        </div>
      )}
    </>
  );
};
export default PaymnentDuplicate;
