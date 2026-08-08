import { useMutation } from '@tanstack/react-query';
import agent from '../agent';

export const useBudgetActions = () => {
  const {
    mutate: createBudget,
    isPending: createBudgetPending,
    isSuccess: createBudgetSuccess,
  } = useMutation({
    mutationFn: async (createRequest: CreateBudgetRequest) => {
      const response = await agent.post(`budget`, createRequest);
      return response.data;
    },

    onSuccess: () => {},
  });

  return { createBudget, createBudgetPending, createBudgetSuccess };
};
