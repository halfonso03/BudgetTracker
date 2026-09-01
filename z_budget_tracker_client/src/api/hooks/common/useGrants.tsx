// import { useQuery } from "@tanstack/react-query";
// import agent from "../agent";
import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchGrants = async (year: number): Promise<Grant[]> => {
  const response = await agent.get<Grant[]>(`/Grant/${year}`);
  return response.data;
};

const useGrants = (year: number, getData: boolean = true) => {
  const { data, isLoading, isFetched, isSuccess } = useQuery<Grant[]>({
    queryKey: ['grants', year],
    queryFn: () => fetchGrants(year),
    enabled: year > 0 && getData,
  });

  return {
    grants: data,
    loadingGrants: isLoading,
    grantsFetched: isFetched,
    grantsSuccess: isSuccess,
  };
};

export default useGrants;
