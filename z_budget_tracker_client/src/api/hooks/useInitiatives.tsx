// import { useQuery } from "@tanstack/react-query";
// import agent from "../agent";
import { useQuery } from '@tanstack/react-query';
import initiatives from '../../sample_data/initiatives';

const fetchInitiative = async (initiativeId: number): Promise<Initiative> => {


  return new Promise((resolve) => {
    const i = initiatives.filter((x) => x.id == initiativeId)[0];
    setTimeout(() => {
      resolve(i);
    }, 300);
  });
};

const useInitiatives = (initiativeId: number) => {
  const { data, isLoading } = useQuery<Initiative>({
    queryKey: ['initiative', initiativeId],
    queryFn: () => fetchInitiative(initiativeId),
  });

  return { data, isLoading };
};

export default useInitiatives;
