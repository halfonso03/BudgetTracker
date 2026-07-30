import { useQuery } from '@tanstack/react-query';
import grants from '../../sample_data/grants';

const fetchGrant = async (grantId: number): Promise<Grant> => {
  return new Promise((resolve) => {
    const i = grants.filter((x) => x.id == grantId)[0];
    setTimeout(() => {
      resolve(i);
    }, 300);
  });
};

const useGrants = (grantId: number) => {
  const { data, isLoading } = useQuery<Grant>({
    queryKey: ['grant', grantId],
    queryFn: () => fetchGrant(grantId),
  });

  return { data, isLoading };
};

export default useGrants;
