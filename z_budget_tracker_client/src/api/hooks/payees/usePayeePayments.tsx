import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';
import { usePagination } from '../../../contexts/pagination/usePagination';
import { useSortingContext } from '../../../contexts/useSortingContext';

export const usePayeePayments = (payeeId: number) => {
  //searchTerm
  const { pageNumber } = usePagination();
  const { sortByValue } = useSortingContext();

  const { data, isLoading } = useQuery<{
    payments: Payment[];
    pagination: PaginationData | undefined;
  }>({
    queryKey: ['payee', 'payments', payeeId, pageNumber, sortByValue],
    staleTime: 1 * 60 * 1000,
    queryFn: async () => {
      const response = await agent.get(
        `/payee/payments?payeeId=${payeeId}&pageNumber=${pageNumber}&sortBy=${sortByValue}`,
        {},
      );

      // console.log('response', response.data)
      const payments = response.data.items;
      // const payments = response.data;
      const paginationHeader = response.headers['pagination'];

      const pagination: PaginationData = paginationHeader
        ? JSON.parse(paginationHeader)
        : null;

      // return payments;
      return { payments, pagination };
    },
  });

  return { payments: data, loadingPayments: isLoading };
};
