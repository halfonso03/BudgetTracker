import agent from '../../agent';
import { useMutation } from '@tanstack/react-query';

export const useReproMutations = () => {
  const createRepro = useMutation({
    mutationFn: async (repro: ReproRequest) => {
      const response = await agent.post('/repro', repro);
      return response.data;
    },
    // onSuccess: () => {
    //   toast.success('Trip created');
    // },
  });

  return { createRepro };
};
