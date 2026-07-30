// import { useQuery } from "@tanstack/react-query";
// import agent from "../agent";
import { useQuery } from '@tanstack/react-query';
import initiatives from '../../sample_data/initiatives';

const fetchInitiatives = async (): Promise<Initiative[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initiatives);
    }, 300);
  });
};

const useInitiatives = () => {
  const { data, isLoading } = useQuery<Initiative[]>({
    queryKey: ['initiatives'],
    queryFn: fetchInitiatives,
  });

  return { data, isLoading };
};

export default useInitiatives;
