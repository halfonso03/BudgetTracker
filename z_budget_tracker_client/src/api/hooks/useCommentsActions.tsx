import { useMutation } from '@tanstack/react-query';
import agent from '../agent';

export const useCommentActions = () => {
  const {
    mutate: createComment,
    isPending: createCommentPending,
    isSuccess: createCommentSuccess,
  } = useMutation({
    mutationFn: async (createRequest: CreateCommentRequest) => {
      await agent.post(`comments`, createRequest);
      return createRequest;
    },
    onError: () => {
      alert('error');
    },
  });

  const {
    mutate: updateComment,
    isPending: updateCommentPending,
    isSuccess: updateCommentSuccess,
  } = useMutation({
    mutationFn: async (updateRequest: UpdateCommentRequest) => {
      const response = await agent.put(`comments`, updateRequest);
      return response.data;
    },
    onError: () => {
      alert('errror');
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
