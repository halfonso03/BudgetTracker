import { useMutation, useQueryClient } from '@tanstack/react-query';
import agent from '../agent';

const sleep = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, delay);
  });

export const useCommentActions = () => {
  const queryClient = useQueryClient();

  const {
    mutate: createComment,
    isPending: createCommentPending,
    isSuccess: createCommentSuccess,
  } = useMutation({
    mutationFn: async (createRequest: CreateCommentRequest) => {
      await sleep(1500);
      const response = await agent.post(`comments`, createRequest);
      createRequest.newId = response.data;
      return createRequest;
    },
    onSuccess: (data: CreateCommentRequest) => {
      queryClient.setQueryData(['budgets', data.initiativeId, data.grantId], (oldData: Budget) => {
        return {
          ...oldData,
          account_balances: oldData.account_balances.map((b) => {
            return b.account_id == data.accountId
              ? {
                  ...b,
                  comment: {
                    id: data.newId!,
                    text: data.text.trim(),
                    entryDate: Date(),
                    enteredBy: '1',
                  },
                }
              : { ...b };
          }),
        };
      });
    },
    onError: () => {
      alert('useCommentActions error');
    },
  });

  const {
    mutate: updateComment,
    isPending: updateCommentPending,
    isSuccess: updateCommentSuccess,
  } = useMutation({
    mutationFn: async (updateRequest: UpdateCommentRequest) => {
      await sleep(1500);
      await agent.put(`comments`, updateRequest);
      return updateRequest;
    },
    onSuccess: (data: UpdateCommentRequest) => {
      queryClient.setQueryData(['budgets', data.initiativeId, data.grantId], (oldData: Budget) => {
        return {
          ...oldData,
          account_balances: oldData.account_balances.map((b) => {
            return b.account_id == data.accountId
              ? {
                  ...b,
                  comment: {
                    ...b.comment,
                    text: data.text.trim(),
                    updateDate: Date(),
                    updatedBy: '1',
                  },
                }
              : { ...b };
          }),
        };
      });
    },
    onError: () => {
      alert('useCommentActions error');
    },
  });

  return {
    createComment,
    createCommentPending,
    createCommentSuccess,
    updateComment,
    updateCommentPending,
    updateCommentSuccess,
  };
};
