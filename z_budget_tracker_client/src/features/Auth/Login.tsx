import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';

import useAccount from '../../api/hooks/auth/useAuth';
import toast from 'react-hot-toast';
import { useState } from 'react';

const Login = () => {
  const [isLogginIn, setIsLoggingIn] = useState(false);
  const { loginUser } = useAccount();
  const navigate = useNavigate();

  async function onClick() {
    setIsLoggingIn(true);
    try {
      await loginUser.mutateAsync(
        { email: 'hialfonso@nhac.org', password: 'ReallyComplexPassword#1' },
        {
          onSuccess: () => {
            // console.log(location.state?.from);
            navigate('/');
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      );
    } catch (error) {
      toast.error(error!.toString());
    } finally {
      setIsLoggingIn(false);
    }

    // login(1);
    //
  }
  return (
    <Button buttonSize="small" onClick={onClick} disabled={isLogginIn}>
      Login
    </Button>
  );
};
export default Login;
