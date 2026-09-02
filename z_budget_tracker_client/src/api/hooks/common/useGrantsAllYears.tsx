// import { useQuery } from "@tanstack/react-query";
// import agent from "../agent";
import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchGrants = async (): Promise<Grant[]> => {
  const response = await agent.get<Grant[]>(`/Grant/all`);
  return response.data;
};

const useGrantsAllYears = (getData: boolean = true) => {
  const { data, isLoading, isFetched, isSuccess } = useQuery<Grant[]>({
    queryKey: ['grants'],
    queryFn: () => fetchGrants(),
    enabled: getData,
  });

  return {
    grants: data,
    loadingGrants: isLoading,
    grantsFetched: isFetched,
    grantsSuccess: isSuccess,
  };
};

export default useGrantsAllYears;
