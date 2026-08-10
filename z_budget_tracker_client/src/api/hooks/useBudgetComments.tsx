import { useQuery } from '@tanstack/react-query';
import agent from '../agent';

const useBudgetLlineItemComment = (
  initiativeId: number,
  grantId: number,
  accountId: number,
) => {
  const { data: comment } = useQuery({
    queryFn: async () => {
      const response = await agent.get<BudgetComment>(`/comments/budget`, {
        params: {
          initiativeId: initiativeId,
          grantId: grantId,
          accountId: accountId
        },
      });
      return response.data;
    },
    queryKey: ['comment', initiativeId, grantId, accountId],
  });


  console.log(initiativeId, grantId, accountId, comment);

  return { comment };
};

export default useBudgetLlineItemComment;
