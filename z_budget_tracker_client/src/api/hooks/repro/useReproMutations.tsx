import agent from '../../agent';
import { useMutation } from '@tanstack/react-query';

export const useReproMutations = () => {
  const createRepro = useMutation({
    mutationFn: async (repro: ReproRequest) => {
      const response = await agent.post('/repro', repro);
      return response.data;
    },
  });

  const updateRepro = useMutation({
    mutationFn: async (repro: ReproRequest) => {
      const response = await agent.put('/repro', repro);
      return response.data;
    },
  });

  return { createRepro, updateRepro };
};
