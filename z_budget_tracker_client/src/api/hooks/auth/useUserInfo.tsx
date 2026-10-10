import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';

const useUserInfo = () => {

  const {
    data: serverUser,
    isLoading: loadingUserServerInfo,
    isSuccess: serverUserSuccess,
  } = useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await agent.get<User>('/account/user-info');
      console.log(response.data);
      return response.data;
    },
  });

  return { serverUser, loadingUserServerInfo, serverUserSuccess };
};

export default useUserInfo;
