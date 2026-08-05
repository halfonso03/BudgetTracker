import { useQueryClient } from '@tanstack/react-query';

export const useInitiative = (initiativId: number): Initiative | null => {
  const queryClient = useQueryClient();

  const initiativesCached: Initiative[] =
    queryClient.getQueryData(['initiatives']) ?? [];
  const initiatives = initiativesCached.filter((x) => x.id == initiativId);

  if (initiatives) {
    return initiatives[0];
  }

  return null;
};
// import { useQuery } from '@tanstack/react-query';

// import initiatives from '../../sample_data/initiatives';

// const fetchInitiative = async (initiativeId: number): Promise<Initiative> => {
//   return new Promise((resolve) => {
//     const i = initiatives.filter((x) => x.id == initiativeId)[0];
//     setTimeout(() => {
//       resolve(i);
//     }, 300);
//   });
// };

// const useInitiative = (initiativeId: number) => {
//   const { data, isLoading } = useQuery<Initiative>({
//     queryKey: ['initiative', initiativeId],
//     queryFn: () => fetchInitiative(initiativeId),
//   });

//   return { data, isLoading };
// };

// export default useInitiative;
