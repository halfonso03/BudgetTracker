import { useQuery } from "@tanstack/react-query"
import agent from "../../agent"
import { useSortingContext } from "../../../contexts/useSortingContext"

const fetchRepros = async (
    pagination: PaginationRequestData,
    paymentSearchParams: PaymentSearchParams,
    sortByValue: string
): Promise<PaymentSearchResponse> => {

    const searchParams1 = { ...paymentSearchParams };
    // const { selectedIds, xSelectedIds, ...searchParams2 } = searchParams1;

    const payload: PaymentSearchRequest = {
        ...searchParams1,
    };

    const response = await agent.post(`/payment/search?pageNumber=${pagination.pageNumber}&pageSize=${pagination.pageSize}&sortBy=${sortByValue}`, payload)
    const paginationHeader = response.headers["pagination"];
    const paginationResponse: PaginationData = paginationHeader
        ? JSON.parse(paginationHeader)
        : null;

    return { items: response.data.items, itemCount: response.data.items.length, searchId: crypto.randomUUID(), pagination: paginationResponse };
}

export const usePaymentSearch = (
    pagination: PaginationRequestData,
    paymentSearchParams: PaymentSearchParams
) => {
    const { sortByValue } = useSortingContext();

    const { data, isLoading, isSuccess } = useQuery<PaymentSearchResponse>({
        queryKey: ['payment_search', { ...paymentSearchParams },
            pagination.pageNumber,
            pagination.pageSize,
            sortByValue],
        queryFn: () => fetchRepros(pagination, paymentSearchParams, sortByValue),
        staleTime: 60 * 1000,
        gcTime: 60 * 1000,
    })

    return { searchResults: data, loadingSearchResults: isLoading, successLoadingResults: isSuccess }
}