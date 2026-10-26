// hooks/useUsersQuery.ts
import { useQuery } from '@tanstack/react-query';
import { getUserById } from './userService';

export function useUserQuery(id: string | undefined) {
  return useQuery<UserListItem, Error>({
    queryKey: ['user', id],
    queryFn: () => getUserById(id!),
    enabled: Boolean(id),
  });
}