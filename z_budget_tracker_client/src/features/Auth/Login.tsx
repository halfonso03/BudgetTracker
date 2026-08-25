import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import useAuth from '../../contexts/useAuth';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  function onClick() {
    login(1);

    navigate('/reprogramming');
  }
  return (
    <Button buttonSize="small" onClick={onClick}>
      Login
    </Button>
  );
};
export default Login;
