import { useMutation, useQueryClient } from '@tanstack/react-query';
import agent from '../../agent';
import { useNavigate } from 'react-router-dom';
import useClientAuth from '../../../contexts/useClientAuth';
import { useHasUnsavedChangesStore } from '../../../state/useHasUnsavedChangesStore';

const useLogout = () => {
  const { setHasUnsavedChanges } = useHasUnsavedChangesStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout } = useClientAuth();

  const { mutate: logoutUser } = useMutation({
    mutationFn: async () => {
      await agent.post('/account/logout');
    },
    onSuccess: async () => {
      setHasUnsavedChanges(false);
      logout();
      queryClient.removeQueries();
      navigate('/login', { replace: true });
    },
  });

  return { logoutUser };
};

export default useLogout;
