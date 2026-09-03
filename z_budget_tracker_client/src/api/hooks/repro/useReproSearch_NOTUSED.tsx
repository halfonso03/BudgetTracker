// import { useQuery } from '@tanstack/react-query';
// import agent from '../../agent';

// const fetchReproSearch = async (
//   searchParams: ReporSearchParams,
// ): Promise<ReproSearchResult> => {
//   const response = await agent.get<ReproSearchResult>(`/repro/search`, {
//     params: {
//       searchParams,
//     },
//   });
//   return response.data as ReproSearchResult;
// };

// const useReproSearch = (searchParams: ReporSearchParams) => {
//   const { data, isSuccess, isLoading, isFetching } = useQuery({
//     queryKey: ['repro_search', JSON.stringify(searchParams)],
//     queryFn: () => fetchReproSearch(searchParams),
//     staleTime: 1 * 1000 * 60,
//   });

//   return {
//     data,
//     isSuccess,
//     isLoading,
//     status,
//     isFetching,
//   };
// };

// export default useReproSearch;
