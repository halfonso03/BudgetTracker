import Button from '../../components/Button';
import useAccount, { type LoginFormValues } from '../../api/hooks/auth/useAuth';
import toast from 'react-hot-toast';
import StackedFormRow from '../../ui/StackedFormRow';
import Input from '../../components/Input';
import { Check } from 'lucide-react';
import { useForm } from 'react-hook-form';

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'hialfonso@nhac.org',
      password: 'Password#1',
    },
  });

  const { loginUser, isLoginPending, isLoginSuccess, errorMessage } =
    useAccount();

  const onSubmit = (data: LoginFormValues) => {
    // setIsLoggingIn(true);

    try {
      loginUser(data);
    } catch (error) {
      toast.error(error!.toString());
    } finally {
      // setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex justify-center w-full  min-h-screen border bg-dark-content absolute top-0 left-0 ">
      <div className="self-center flex justify-center w-100 relative">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="self-center animate-fade-in w-80"
        >
          <div className=" border border-gray-300 p-8 flex flex-col justify-center rounded-md gap-5 dark:border-neutral-700">
            <div
              className="absolute opacity-0 pointer-events-none bottom-0 left-0 -z-10 h-0 w-0 overflow-hidden"
              aria-hidden="true"
            >
              <input
                type="text"
                name="username"
                tabIndex={-1}
                autoComplete="username"
              />
              <input
                type="password"
                name="password"
                tabIndex={-1}
                autoComplete="current-password"
              />
            </div>

            <StackedFormRow
              id="email"
              label="Email"
              error={errors?.email?.message}
            >
              <Input
                type="text"
                {...register('email', { value:"sdsd", required: 'Email is required' })}
              ></Input>
            </StackedFormRow>

            <StackedFormRow
              id="password"
              label="Password"
              error={errors?.password?.message}
            >
              <Input
                type="password"
                {...register('password', { required: 'Password is required' })}
              ></Input>
            </StackedFormRow>
            <Button
              type="submit"
              variation="primary"
              buttonSize="small"
              disabled={isLoginPending || isLoginSuccess}
              additionalclasses="w-full p-1"
            >
              {isLoginSuccess ? (
                <Check></Check>
              ) : isLoginPending ? (
                <div className="animate-spin h-6 w-6 border-4 border-gray-200 border-t-transparent border-b-transparent rounded-full"></div>
              ) : (
                'OK'
              )}
            </Button>

            {/* <div className="mt-3 p-4 border border-slate-400 bg-tranparent text-gray-700 dark:border-neutral-700 dark:text-gray-50 ">
              You must login with an Active Directory account.
              <div className=" underline mt-2 uppercase">
                Failing to login after 5 attempts with a valid account will
                disable the account!
              </div>
            </div> */}
            {errorMessage && (
              <div className="text-red-500 mt-5 mb-0 font-semibold text-xl">
                {errorMessage}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
