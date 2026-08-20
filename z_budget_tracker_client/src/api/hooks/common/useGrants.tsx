// import { useQuery } from "@tanstack/react-query";
// import agent from "../agent";
import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchGrants = async (year: number): Promise<Grant[]> => {
  const response = await agent.get<Grant[]>(`/Grant/${year}`);
  return response.data;
};

const useGrants = (year: number) => {
  const { data, isLoading } = useQuery<Grant[]>({
    queryKey: ['grants', year],
    queryFn: () => fetchGrants(year),
    enabled: year > 0,
  });

  return { data, isLoading };
};

export default useGrants;
