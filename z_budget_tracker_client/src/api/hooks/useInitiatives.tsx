// import { useQuery } from "@tanstack/react-query";
// import agent from "../agent";
import { useQuery } from '@tanstack/react-query';
import initiatives from '../../sample_data/initiatives';
// import agent from "../agent";

const fetchInitiative = async (initiativeId: number): Promise<Initiative> => {
  // const response = await agent.get<Role[], any, {}>("/groups", {
  //     params: {
  //         "filter": filter.trim()
  //     },
  //     headers: {
  //         'Authorization': `Bearer ${token}`
  //     }
  // });

  // return response.data

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(initiatives.filter((x) => x.id == initiativeId)[0]);
    }, 300);
  });
};

const useBudget = (initiativeId: number) => {
  const { data, isLoading } = useQuery<Budget>({
    queryKey: ['budget', initiativeId],
    queryFn: () => fetchInitiative(initiativeId),
  });

  return { data, isLoading };
};

export default useBudget;
