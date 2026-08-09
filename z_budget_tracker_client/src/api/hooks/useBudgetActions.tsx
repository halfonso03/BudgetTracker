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

  const {
    mutate: updateBudget,
    isPending: updateBudgetPending,
    isSuccess: updateBudgetSuccess,
  } = useMutation({
    mutationFn: async (updateRequest: UpdateBudgetRequest) => {

      console.log('updateRequest', updateRequest)
      // const response = await agent.put(`budget`, updateRequest);
      // return response.data;
    },

    onSuccess: () => {},
  });

  return {
    createBudget,
    createBudgetPending,
    createBudgetSuccess,
    updateBudget,
    updateBudgetPending,
    updateBudgetSuccess,
  };
};
