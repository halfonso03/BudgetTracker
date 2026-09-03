import { useQuery } from "@tanstack/react-query"
import agent from "../../agent"

const fetchRepros = async (
    pagination: PaginationRequestData,
    reproSearchParams: ReproSearchParams
) => {

    const payload = {
        initiativeIds: reproSearchParams.selectedIds!.filter(x => x.type === 'I').map(x => x.id),
        grantIds: reproSearchParams.selectedIds!.filter(x => x.type === 'G').map(x => x.id),
        accountIds: reproSearchParams.selectedIds!.filter(x => x.type === 'A').map(x => x.id),
        ...reproSearchParams
    }

    const response = await agent.post(`/repro/search?pageNumber=${pagination.pageNumber}&pageSize=${pagination.pageSize}`, payload)
    const paginationHeader = response.headers["pagination"];
    const paginationResponse: PaginationData = paginationHeader
        ? JSON.parse(paginationHeader)
        : null;

    return { data: response.data, pagination: paginationResponse };
}

export const useReproSearch = (
    pagination: PaginationRequestData,
    reproSearchParams: ReproSearchParams
) => {

    const { data, isLoading, isSuccess } = useQuery<{ data: ReproSearchResponse, pagination: PaginationData }>({
        queryKey: ['repro_search', reproSearchParams.selectedIds!.map(x => (x.id + x.type)), { ...reproSearchParams }, pagination.pageNumber, pagination.pageSize],
        queryFn: () => fetchRepros(pagination, reproSearchParams),
        staleTime: 60 * 1000,
        gcTime: 60 * 1000,
    })

    return { searchResults: data, loadingSearchResults: isLoading, successLoadingResults: isSuccess }
}