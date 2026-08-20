import { useQueryClient } from '@tanstack/react-query';

export const useGrant = (year: number, grantId: number): Grant | null => {
  const queryClient = useQueryClient();

  const grantsForYear: Grant[] =
    queryClient.getQueryData(['grants', year]) ?? [];
  const grants = grantsForYear.filter((x) => x.id == grantId);

  if (grants) {
    return grants[0];
  }

  return null;
};
