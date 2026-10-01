import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';
import { usePagination } from '../../../contexts/pagination/usePagination';

export const useVendors = () => {
  //searchTerm
  const { pageNumber } = usePagination();

  const { data: vendors, isLoading: loadingVendors } = useQuery<{
    vendors: Vendor[];
    pagination: PaginationData | undefined;
  }>({
    queryKey: ['vendors', pageNumber],
    staleTime: 1 * 60 * 1000,
    queryFn: async () => {
      const response = await agent.get(`/vendors/list`, {
        params: { pageNumber },
      });

      const vendors = response.data.vendors;
      const paginationHeader = response.headers['pagination'];

      const pagination: PaginationData = paginationHeader
        ? JSON.parse(paginationHeader)
        : null;

      return { vendors, pagination };
    }
  });

  return { results: vendors, loadingVendors };
};
