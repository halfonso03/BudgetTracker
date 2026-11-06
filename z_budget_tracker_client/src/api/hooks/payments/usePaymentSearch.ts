import { useQuery } from "@tanstack/react-query"
import agent from "../../agent"
import { useSortingContext } from "../../../contexts/useSortingContext"
const fetchPayments = async (
    pagination: PaginationRequestData,
    paymentSearchParams: PaymentSearchParams,
    sortByValue: string
): Promise<PaymentSearchResponse> => {

    const searchParams1 = { ...paymentSearchParams };
    const { selectedIds, ...searchParams2 } = searchParams1;

    const payload: PaymentSearchRequest = {
        ...searchParams2,
        payeeIds: selectedIds!.filter(x => x.type === 'P').map(x => x.id),
        initiativeIds: selectedIds!.filter(x => x.type === 'I').map(x => x.id),
        grantIds: selectedIds!.filter(x => x.type === 'G').map(x => x.id),
        accountIds: selectedIds!.filter(x => x.type === 'A').map(x => x.id),
    };

    const response = await agent.post(`/payment/search?pageNumber=${pagination.pageNumber}&pageSize=${pagination.pageSize}&sortBy=${sortByValue}`, payload)
    const paginationHeader = response.headers["pagination"];
    const paginationResponse: PaginationData = paginationHeader
        ? JSON.parse(paginationHeader)
        : null;

    return {
        items: response.data.items,
        itemCount: response.data.items.length,
        pagination: paginationResponse
    };
}

export const usePaymentSearch = (
    pagination: PaginationRequestData,
    paymentSearchParams: PaymentSearchParams
) => {
    const { sortByValue } = useSortingContext();

    const { data, isLoading, isSuccess } = useQuery<PaymentSearchResponse>({
        queryKey: ['payment_search',
            JSON.stringify(paymentSearchParams),
            pagination.pageNumber,
            pagination.pageSize,
            sortByValue],
        queryFn: () => fetchPayments(pagination, paymentSearchParams, sortByValue),
        staleTime: 60 * 1000,
        gcTime: 60 * 1000,
    })

    return { searchResults: data, loadingSearchResults: isLoading, successLoadingResults: isSuccess }
}