import { useMutation, useQueryClient } from '@tanstack/react-query';
import agent from '../../agent';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useBudgetMutations = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    mutate: createBudget,
    isPending: createBudgetPending,
    isSuccess: createBudgetSuccess,
  } = useMutation({
    mutationFn: async (createRequest: CreateBudgetRequest) => {
      await agent.post(`budget`, createRequest);
      return createRequest;
    },

    onSuccess: (data: CreateBudgetRequest) => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      toast.success('Budget Created. Redirecting...', {
        duration: 2500,
      });

      const year = data.year;
      const { initiativeId, grantId } = data.lineItems[0];

      setTimeout(() => {
        navigate(`/budget/${year}/${initiativeId}/${grantId}`);
      }, 2500);
    },
    onError: () => {
      alert('errror');
    },
  });

  const {
    mutate: updateBudget,
    isPending: updateBudgetPending,
    isSuccess: updateBudgetSuccess,
  } = useMutation({
    mutationFn: async (updateRequest: UpdateBudgetRequest) => {
      await agent.put(`budget`, updateRequest);
      return updateRequest;
    },

    onSuccess: (updateRequest: UpdateBudgetRequest) => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      toast.success('Budget Updated.', {
        duration: 2000,
      });

      for (const item of updateRequest.lineItems) {
        queryClient.invalidateQueries({
          queryKey: ['transactions', updateRequest.initiativeId, updateRequest.grantId, item.accountId],
        });
      }
    },
    onError: () => {
      alert('error');
    },
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
