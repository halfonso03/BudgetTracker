import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import agent from '../../agent';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../contexts/useAuth';

export default function useAccount() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { logout } = useAuth();
  const { data: currentUser, isLoading: loadingUserInfo } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await agent.get<User>('/account/user-info');
      console.log(response.data);
      return response.data;
    },
    enabled: !queryClient.getQueryData(['user']),
  });

  const loginUser = useMutation({
    mutationFn: async (creds: { email: string; password: string }) => {
      const response = await agent.post('/login?useCookies=true', creds);

      console.log('response', response);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['user'],
      });
    },
  });

  const logoutUser = useMutation({
    mutationFn: async () => {
      agent.post('/account/logout');
    },
    onSuccess: async () => {
      // queryClient.removeQueries();
      logout();
      queryClient.removeQueries({ queryKey: ['user'] });
      // queryClient.removeQueries({ queryKey: ["activities"] });
      // queryClient.removeQueries({ queryKey: ["profile"] });
      navigate('login');
    },
  });

  // const registerUser = useMutation({
  // 	mutationFn: async (creds: RegisterSchema) => {
  // 		await agent.post("/account/register", creds);
  // 	},
  // });

  // const verifyEmail = useMutation({
  // 	mutationFn: async ({
  // 		userId,
  // 		code,
  // 	}: {
  // 		userId: string;
  // 		code: string;
  // 	}) => {
  // 		await agent.get(`/confirmEmail?userId=${userId}&code=${code}`);
  // 	},
  // });

  // const resendConfirmationEmail = useMutation({
  // 	mutationFn: async ({
  // 		email,
  // 		userId,
  // 	}: {
  // 		email?: string;
  // 		userId?: string | null;
  // 	}) => {
  // 		await agent.get(`/account/resendConfirmEmail`, {
  // 			params: {
  // 				email,
  // 				userId,
  // 			},
  // 		});
  // 	},
  // 	onSuccess: () => {
  // 		toast.success("Email sent. Please check your email");
  // 	},
  // 	onError: () => {
  // 		toast.error("Unauthorized");
  // 	},
  // });

  // const changePassword = useMutation({
  // 	mutationFn: async (data: ChangePasswordSchema) => {
  // 		await agent.post("/account/change-password", data);
  // 	},
  // });

  // const forgotPassword = useMutation({
  // 	mutationFn: async (email: string) => {
  // 		await agent.post("/forgotPassword", { email });
  // 	},
  // });

  // const resetPassword = useMutation({
  // 	mutationFn: async (data: ResetPassword) => {
  // 		await agent.post("/resetPassword", data);
  // 	},
  // });

  return {
    loginUser,
    // registerUser,
    logoutUser,
    currentUser,
    loadingUserInfo,
    // verifyEmail,
    // resendConfirmationEmail,
    // changePassword,
    // forgotPassword,
    // resetPassword,
  };
}
