import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';
import { usePagination } from '../../../contexts/pagination/usePagination';
import { useSortingContext } from '../../../contexts/useSortingContext';

export const useVendors = () => {
  //searchTerm
  const { pageNumber } = usePagination();
  const { sortByValue } = useSortingContext();

  const { data, isLoading: loadingVendors } = useQuery<{
    vendors: Vendor[];
    pagination: PaginationData | undefined;
  }>({
    queryKey: ['vendors', pageNumber, sortByValue],
    staleTime: 1 * 60 * 1000,
    queryFn: async () => {
      console.log('pageNumber', pageNumber);
      const response = await agent.get(
        `/vendors/list?pageNumber=${pageNumber}&sortBy=${sortByValue}`,
        {},
      );

      const vendors = response.data.items;
      const paginationHeader = response.headers['pagination'];

      const pagination: PaginationData = paginationHeader
        ? JSON.parse(paginationHeader)
        : null;

      return { vendors, pagination };
    },
  });

  return { data, loadingVendors };
};
