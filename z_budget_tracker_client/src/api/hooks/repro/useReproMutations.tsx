import agent from '../../agent';
import { useMutation } from '@tanstack/react-query';

export const useReproMutations = () => {
  const createRepro = useMutation({
    mutationFn: async (repro: CreateReproRequest) => {
      const response = await agent.post('/repro', repro);
      return response.data;
    },
  });

  const updateRepro = useMutation({
    mutationFn: async (repro: UpdateReproRequest) => {
      const response = await agent.put('/repro', repro);
      return response.data;
    },
  });

  const deleteRepro = useMutation({
    mutationFn: async (id: number) => {
      const response = await agent.delete(`/repro/${id}`);
      return response.data;
    },
  });

  const duplicateRepro = useMutation({
    mutationFn: async (data: { id: number; userId: number }) => {
      const response = await agent.post(`/repro/duplicate`, data);
      return response.data;
    },
  });

  return { createRepro, updateRepro, deleteRepro, duplicateRepro };
};
