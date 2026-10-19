import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';
import { usePagination } from '../../../contexts/pagination/usePagination';
import { useSortingContext } from '../../../contexts/useSortingContext';

export const usePayees = (searchTerm: string, year: number = 0) => {
  const { pageNumber } = usePagination();
  const { sortByValue } = useSortingContext();

  const sortBy = sortByValue;

  const { data, isLoading: loadingPayees } = useQuery<{
    payees: Payee[];
    pagination: PaginationData | undefined;
  }>({
    queryKey: ['payees', searchTerm, pageNumber, sortBy, year],
    // staleTime: 1 * 60 * 1000,
    queryFn: async () => {
      const response = await agent.get(
        `/payee/list?pageNumber=${pageNumber}&sortBy=${sortBy}&searchTerm=${searchTerm?.trim() ?? ''}&year=${year}`,
        {},
      );

      const vendors = response.data.items;
      const paginationHeader = response.headers['pagination'];

      const pagination: PaginationData = paginationHeader
        ? JSON.parse(paginationHeader)
        : null;

      return { payees: vendors, pagination };
    },
  });

  return { data, loadingPayees: loadingPayees };
};
