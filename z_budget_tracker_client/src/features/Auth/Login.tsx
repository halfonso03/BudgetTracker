import useAuth from '../../contexts/useAuth';

const Login = () => {
  const { login } = useAuth();
  function onClick() {
    login(1);
  }
  return <button onClick={onClick}>Login</button>;
};
export default Login;
