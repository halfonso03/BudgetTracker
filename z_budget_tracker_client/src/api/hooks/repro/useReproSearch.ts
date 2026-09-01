import { useQuery } from "@tanstack/react-query"
import agent from "../../agent"


const fetchRepros = async (selectedItems: { id: number, type: string }[], status: number, year: number) => {

    const payload = {
        initiativeIds: selectedItems.filter(x => x.type === 'I').map(x => x.id),
        grantIds: selectedItems.filter(x => x.type === 'G').map(x => x.id),
        accountIds: selectedItems.filter(x => x.type === 'A').map(x => x.id),
        status: status,
        year: year
    }

    const response = await agent.post('/repro/search', payload)
    return response.data;
}

export const useReproSearch = (selectedItems: { id: number, type: string }[], status: number, year: number) => {

    const { data, isLoading } = useQuery<ReproSearchResult[]>({
        queryKey: ['repro_search', JSON.stringify({ selectedItems, status, year })],
        queryFn: () => fetchRepros(selectedItems, status, year),
        staleTime: 0eaqrch,
    })


    return { searchResults: data, loadingSearchResults: isLoading }


}