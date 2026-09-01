import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchCategories = async (): Promise<Category[]> => {
  const response = await agent.get<Category[]>(`/Category`);
  return response.data;
};

const useCategories = (getData: boolean = true, flattened: boolean = false) => {
  const { data, isLoading, isFetched, isSuccess } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    placeholderData: [],
    staleTime: 1 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: getData,
    select: (categories: Category[]) => {
      if (flattened) {
        const accountsFlattened = categories
          .map((x) => x.accounts)
          .flat()
          .map((a) => {
            return {
              ...a,
              categoryName: categories!.filter(
                (c) => c.id === a!.category_id,
              )[0].name,
            };
          })
          .map((y) => ({
            id: y.id!,
            name: y.categoryName + ' - ' + y.name,
          }));

        return accountsFlattened;
      }
      return categories;
    },
  });

  return {
    categories: data,
    loadingCat: isLoading,
    catSuccess: isSuccess,
    categoriesFetched: isFetched,
  };
};

export default useCategories;
