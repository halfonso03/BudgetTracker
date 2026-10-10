import { useMutation, useQueryClient } from '@tanstack/react-query';
import agent from '../../agent';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../../contexts/useAuth';
import { useHasUnsavedChangesStore } from '../../../state/useHasUnsavedChangesStore';

const useLogout = () => {
  const { hasUnsavedChanges, setHasUnsavedChanges } =
    useHasUnsavedChangesStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { mutate: logoutUser } = useMutation({
    mutationFn: async () => {
      agent.post('/account/logout');
    },
    onSuccess: async () => {
      // queryClient.removeQueries();
      if (hasUnsavedChanges) {
        setHasUnsavedChanges(false);
      }
      navigate('/login', { replace: true });
      logout();
      queryClient.removeQueries();
    },
  });

  return { logoutUser };
};

export default useLogout;
