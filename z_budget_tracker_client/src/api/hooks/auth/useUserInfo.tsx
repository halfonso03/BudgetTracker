import { useQuery } from '@tanstack/react-query';
import agent from '../../agent';
import useClientAuth from '../../../contexts/useAuth';

const useUserInfo = () => {

    const x = useClientAuth();

  const {
    data: serverUser,
    isLoading: loadingUserServerInfo,
    isSuccess: serverUserSuccess,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await agent.get<User>('/account/user-info');
      console.log(response.data);
      return response.data;
    },
    enabled: !x.isLoggedIn()
  });

  return { serverUser, loadingUserServerInfo, serverUserSuccess };
};

export default useUserInfo;
