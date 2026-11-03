import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';
import { usePagination } from '../../../contexts/pagination/usePagination';
import { useSortingContext } from '../../../contexts/useSortingContext';

export const usePayeePayments = (payeeId: number) => {
  //searchTerm
  const { pageNumber } = usePagination();
  const { sortByValue } = useSortingContext();

  const { data, isLoading, isSuccess } = useQuery<{
    items: PayeePayment[];
    pagination: PaginationData | undefined;
  }>({
    queryKey: ['payee', 'payments', payeeId, pageNumber, sortByValue],
    staleTime: 1 * 60 * 1000,
    enabled: payeeId !== 0,
    queryFn: async () => {
      const response = await agent.get(
        `/payee/payments?payeeId=${payeeId}&pageNumber=${pageNumber}&sortBy=${sortByValue}`,
        {},
      );

      // console.log('response', response.data)
      const items = response.data.items;
      // const payments = response.data;
      const paginationHeader = response.headers['pagination'];

      const pagination: PaginationData = paginationHeader
        ? JSON.parse(paginationHeader)
        : null;

      // return payments;
      return { items, pagination };
    },
  });

  return {
    data,
    loadingPayments: isLoading,
    loadingPaymentsSuccess: isSuccess,
  };
};
