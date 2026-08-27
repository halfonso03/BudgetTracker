// import { useQuery } from "@tanstack/react-query";
// import agent from "../agent";
import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchInitiatives = async (): Promise<Initiative[]> => {
  const response = await agent.get<Initiative[]>('/Initiative');
  return response.data;
};

const useInitiatives = (getData: boolean = true) => {
  const { data, isLoading, status } = useQuery<Initiative[]>({
    queryKey: ['initiatives'],
    queryFn: fetchInitiatives,
    staleTime: 1 * 60 * 60 * 1000,
    enabled: getData,
  });

  return { data, loadingInit: isLoading, status };
};

export default useInitiatives;
