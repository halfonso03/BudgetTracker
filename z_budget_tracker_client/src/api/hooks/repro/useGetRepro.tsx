import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchRepro = async (id: number): Promise<Repro> => {
  const response = await agent.get<Repro>(`/repro/${id}`);
  return response.data as Repro;
};

const useGetRepro = (id: number | undefined) => {
  const {
    data,
    isSuccess,
    isLoading,
    status,
    isFetching,
    isPending,
    isFetched,
  } = useQuery<Repro>({
    queryKey: ['repro', id],
    queryFn: () => fetchRepro(id ?? 0),
    staleTime: 1 * 1000 * 60,
    enabled: !!id,
  });

  return {
    data,
    isSuccess,
    isLoading,
    status,
    isFetching,
    isPending,
    isFetched,
  };
};

export default useGetRepro;
