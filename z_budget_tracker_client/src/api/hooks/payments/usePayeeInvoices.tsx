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

const usePayeeInvoices = (
  payeeId: number | undefined,
  invoiceNumber: string | null | undefined,
) => {
  const {
    data,
    isSuccess,
    isLoading,
    status,
    isFetching,
    isPending,
    isFetched,
  } = useQuery<string[]>({
    queryKey: ['payee_invoices', payeeId, invoiceNumber],
    queryFn: () => fetchRepro(payeeId ?? 0, invoiceNumber ?? ''),
    enabled:
      !!payeeId &&
      invoiceNumber != null &&
      invoiceNumber !== undefined &&
      invoiceNumber.trim() !== '',
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
