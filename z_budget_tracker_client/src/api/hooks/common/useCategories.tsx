import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const fetchCategories = async (): Promise<Category[]> => {
  const response = await agent.get<Category[]>(`/Category`);
  return response.data;
};

const useCategories = (getData: boolean) => {
  const { data, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    placeholderData: [],
    staleTime: 1 * 60 * 60 * 1000,
    enabled: getData,
  });

  return { data, loadingCat: isLoading };
};

export default useCategories;
