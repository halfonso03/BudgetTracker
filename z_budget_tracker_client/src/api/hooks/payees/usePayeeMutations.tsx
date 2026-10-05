import agent from '../../agent';
import { useMutation } from '@tanstack/react-query';

export const usePayeeMutations = () => {
  const createPayee = useMutation({
    mutationFn: async (repro: CreatePayeeRequest) => {
      const response = await agent.post('/payee', repro);
      return response.data;
    },
  });

  const updatePayee = useMutation({
    mutationFn: async (repro: UpdatePayeeRequest) => {
      const response = await agent.put('/payee', repro);
      return response.data;
    },
  });

  //   const deleteRepro = useMutation({
  //     mutationFn: async (id: number) => {
  //       const response = await agent.delete(`/repro/${id}`);
  //       return response.data;
  //     },
  //   });

  return { createPayee, updatePayee };
};
