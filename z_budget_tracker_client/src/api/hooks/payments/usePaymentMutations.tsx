import agent from '../../agent';
import { useMutation } from '@tanstack/react-query';

export const usePaymentMutations = () => {
  const createPayment = useMutation({
    mutationFn: async (repro: CreatePaymentRequest) => {
      const response = await agent.post('/payment', repro);
      return response.data;
    },
  });

  const updatePayment = useMutation({
    mutationFn: async (repro: UpdatePaymentRequest) => {
      const response = await agent.put('/payment', repro);
      return response.data;
    },
  });

  const deletePayment = useMutation({
    mutationFn: async (id: number) => {
      const response = await agent.delete(`/payment/${id}`);
      return response.data;
    },
  });

  const duplicatePayment = useMutation({
    mutationFn: async (data: { id: number; userId: number }) => {
      const response = await agent.post(`/payment/duplicate`, data);
      return response.data;
    },
  });

  return { createPayment, updatePayment, deletePayment, duplicatePayment };
};
