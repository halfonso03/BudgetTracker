import { useQuery } from '@tanstack/react-query';
import agent from '../agent';

const fetchCategories = async (): Promise<Category[]> => {
  const response = await agent.get<Category[]>(`/Category`);
  return response.data;
};

const useCategories = () => {
  const { data, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    placeholderData: [],
  });

  return { data, isLoading };
};

export default useCategories;
