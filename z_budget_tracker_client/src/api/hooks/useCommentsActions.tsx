import { useMutation } from '@tanstack/react-query';
import agent from '../agent';
import toast from 'react-hot-toast';

const sleep = (delay: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, delay);
  });

export const useCommentActions = () => {
  const {
    mutate: createComment,
    isPending: createCommentPending,
    isSuccess: createCommentSuccess,
  } = useMutation({
    mutationFn: async (createRequest: CreateCommentRequest) => {
      await sleep(1500);
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
      await sleep(1500);
      const response = await agent.put(`comments`, updateRequest);
      return response.data;
    },
    onSuccess: () => {
      // toast.success('Comment Saved', {
      //   duration: 1500,
      // });
    },
    onError: () => {
      alert('useCommentActions errror');
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
