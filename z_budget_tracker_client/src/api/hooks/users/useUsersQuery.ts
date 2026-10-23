// hooks/useUsersQuery.ts
import { useQuery } from '@tanstack/react-query';
import { getUsers } from './userService';

export function useUsersQuery() {
  return useQuery<UserListItem[], Error>({
    queryKey: ['users'],
    queryFn: getUsers,
  });
}