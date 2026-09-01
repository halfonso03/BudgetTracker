import { useQuery } from "@tanstack/react-query"
import agent from "../../agent"


const fetchRepros = async (selectedItems: { id: number, type: string }[], status: number, year: number, debitComparer: number, debit: number, creditComparer: number, credit: number) => {

    const payload = {
        initiativeIds: selectedItems.filter(x => x.type === 'I').map(x => x.id),
        grantIds: selectedItems.filter(x => x.type === 'G').map(x => x.id),
        accountIds: selectedItems.filter(x => x.type === 'A').map(x => x.id),
        status,
        year,
        debitComparer,
        debit,
        creditComparer,
        credit
    }

    const response = await agent.post('/repro/search', payload)
    return response.data;
}

export const useReproSearch = (selectedItems: { id: number, type: string }[], status: number, year: number, debitComparer: number, debit: number, creditComparer: number, credit: number) => {

    const { data, isLoading } = useQuery<ReproSearchResult[]>({
        queryKey: ['repro_search', JSON.stringify({ selectedItems, status, year, debitComparer, debit, creditComparer, credit })],
        queryFn: () => fetchRepros(selectedItems, status, year, debitComparer, debit, creditComparer, credit),
        staleTime: 0,
    })


    return { searchResults: data, loadingSearchResults: isLoading }


}