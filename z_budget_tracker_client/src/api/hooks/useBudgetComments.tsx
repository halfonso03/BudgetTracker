import { useMutation } from '@tanstack/react-query';

const saveComments2 = async (c: string = '') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(c);
    }, 500);
  });
};

const useBudgetComments = (
  initiativeId: number,
  grantId: number,
  accountId: number,
  comment: string,
) => {
  const {
    mutate: saveComments,
    isPending: isSaveCommentsPending,
    isSuccess: isSaveCommentsSuccess,
  } = useMutation({
    mutationFn: saveComments2,
  });

  console.log(initiativeId, grantId, accountId, comment);
  return { saveComments, isSaveCommentsPending, isSaveCommentsSuccess };
};

export default useBudgetComments;
