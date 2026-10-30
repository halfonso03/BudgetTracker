import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchRepro = async (
  id: number,
  invoiceNumber: string,
): Promise<string[]> => {
  const response = await agent.get<string[]>(
    `/payee/invoices/${id}?invoiceNumber=${invoiceNumber}`,
  );
  return response.data ?? ([] as string[]);
};

const usePayeeInvoices = (id: number | undefined, invoiceNumber: string | null | undefined) => {
  const {
    data,
    isSuccess,
    isLoading,
    status,
    isFetching,
    isPending,
    isFetched,
  } = useQuery<string[]>({
    queryKey: ['payee_invoices', id],
    queryFn: () => fetchRepro(id ?? 0, invoiceNumber ?? ''),
    staleTime: 1 * 1000 * 60,
    enabled:
      !!id &&
      invoiceNumber !== undefined &&
      invoiceNumber !== null &&
      invoiceNumber?.trim() !== '',
  });

  return {
    data,
    isSuccess,
    isLoading,
    status,
    isFetching,
    isPending,
    isFetched,
  };
};

export default usePayeeInvoices;
