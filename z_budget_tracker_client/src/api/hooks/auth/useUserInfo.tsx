import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';
import type { AxiosError } from 'axios';

const useUserInfo = () => {
  const {
    data: serverUser,
    isLoading: loadingUserServerInfo,
    isSuccess: serverUserSuccess,
    error: serverUserError,
  } = useQuery<User, AxiosError>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await agent.get<User>('/account/user-info');
      return response.data;
    },
  });

  return {
    serverUser,
    loadingUserServerInfo,
    serverUserSuccess,
    serverUserError,
  };
};

export default useUserInfo;
