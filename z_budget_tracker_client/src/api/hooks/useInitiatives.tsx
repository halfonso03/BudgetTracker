// import { useQuery } from "@tanstack/react-query";
// import agent from "../agent";
import { useQuery } from '@tanstack/react-query';
import agent from '../agent';

const fetchInitiatives = async (): Promise<Initiative[]> => {
  const response = await agent.get<Initiative[]>('/Initiative');
  return response.data;
};

const useInitiatives = () => {
  const { data, isLoading } = useQuery<Initiative[]>({
    queryKey: ['initiatives'],
    queryFn: fetchInitiatives,
  });

  return { data, isLoading };
};

export default useInitiatives;
