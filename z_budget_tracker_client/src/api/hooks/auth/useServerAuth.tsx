import { useMutation, useQueryClient } from '@tanstack/react-query';
import agent from '../../agent';
import { useNavigate } from 'react-router-dom';
import useClientAuth from '../../../contexts/useAuth';
import toast from 'react-hot-toast';
import { useHasUnsavedChangesStore } from '../../../state/useHasUnsavedChangesStore';
import { useState } from 'react';
import type { AxiosError, AxiosResponse } from 'axios';
export type LoginFormValues = { email: string; password: string };
export type LoginResponse = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
};

export default function useServerAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const { hasUnsavedChanges, setHasUnsavedChanges } =
    useHasUnsavedChangesStore();

  const { login } = useClientAuth();

  const {
    mutate: loginUser,
    isPending: isLoginPending,
    isSuccess: isLoginSuccess,
  } = useMutation({
    mutationFn: async (creds: { email: string; password: string }) => {
      const response: AxiosResponse = await agent.post(
        '/account/login-user',
        creds,
      );

      console.log('response', response);
      const loginResponse = response.data as LoginResponse;
      return loginResponse;
    },
    onSuccess: (response: LoginResponse) => {
      if (hasUnsavedChanges) {
        setHasUnsavedChanges(false);
      }
      queryClient.invalidateQueries({
        queryKey: ['user'],
      });
      login(response);
      navigate('/');
    },
    onError: (error: AxiosError) => {
      if (error.response) {
        // The server responded with a status code outside the 2xx range (e.g., 400)
        const errorData = error.response.data;
        console.log('Server Error Status:', error.response); // 400
        console.log('Server Error Data:', errorData); // { message: "Invalid payload", ... }
        setErrorMessage(error.response.data as string);
      } else {
        console.error('Network or Setup Error:', error.message);
        setErrorMessage(error.message as string);
      }
      toast.error(error.message);
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
    isLoginPending,
    isLoginSuccess,
    errorMessage,
    // registerUser,
    // currentUser,
    // loadingUserInfo,
    // verifyEmail,
    // resendConfirmationEmail,
    // changePassword,
    // forgotPassword,
    // resetPassword,
  };
}
