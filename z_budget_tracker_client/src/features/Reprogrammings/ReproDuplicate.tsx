import { useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReproMutations } from '../../api/hooks/repro/useReproMutations';
import toast from 'react-hot-toast';
import useClientAuth from '../../contexts/useAuth';
import Spinner from '../../components/Spinner';

const ReproDuplicate = () => {
  const { duplicateRepro, isDuplicating, duplicateSuccess } =
    useReproMutations();

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useClientAuth();


  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        duplicateRepro(
          { id: +id!, userId: +user!.id! },
          {
            onSuccess: async (repro) => {
              toast.success(
                <div>
                  <div className="pb-1">{`Reprogramming Id ${+id!} duplicated.`}</div>
                  <div>{`Opening reprogramming id ${repro.id}.`}</div>
                </div>,

                {
                  duration: 1500,
                },
              );

              setTimeout(() => {
                navigate(`/reprogramming/${repro.id}`);
              }, 1500);
            },
          },
        );
      } catch (error) {
        console.log('e', error);
      }
    }, 1);
    return () => {
      clearTimeout(t)
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
export default ReproDuplicate;
