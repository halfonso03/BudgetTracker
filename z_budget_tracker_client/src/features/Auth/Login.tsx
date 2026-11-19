import Button from '../../components/Button';
import { type LoginFormValues } from '../../api/hooks/auth/useLogin';
import toast from 'react-hot-toast';
import StackedFormRow from '../../ui/StackedFormRow';
import Input from '../../components/Input';
import { Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import useLogin from '../../api/hooks/auth/useLogin';

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
    useLogin();

  const onSubmit = async (data: LoginFormValues) => {
    // setIsLoggingIn(true);

    try {
      await loginUser(data);
    } catch (error) {
      toast.error(error!.toString());
    } finally {
      // setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex justify-center w-full  min-h-screen bg-dark-content  top-0 left-0 dark:bg-slate-900 ">
      <div className="self-center flex flex-col gap-16 justify-start mb-20">
        <div className=" border-neutral-300 dark:border-slate-700/50 p-3 rounded-md dark:text-white w-[50%] text-lg/7 border m-auto space-y-1">
          This system is a prototype designed as a "shadow"
          expense tracking solution. Built to run alongside existing processes,
          it demonstrates end-to-end workflows for budgeting, fund
          reprogrammings, payment management, and financial reporting. While the
          overall platform is still an early-stage proof of concept, several
          core modules are already fully functional and ready for live
          demonstration. For more information or a demonstration please send an
          email to hialfonso@nhac.org.
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="self-center  w-80"
        >
          <div className='rounded-md border border-neutral-200 dark:border-slate-700/60 py-6 px-4'>
            <div className=" flex flex-col justify-center rounded-md gap-5 ">
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
                  placeholder="Enter your email..."
                  {...register('email', {
                    value: 'sdsd',
                    required: 'Email is required',
                  })}
                ></Input>
              </StackedFormRow>
              <StackedFormRow
                id="password"
                label="Password"
                error={errors?.password?.message}
              >
                <Input
                  type="password"
                  placeholder="Enter your password..."
                  {...register('password', {
                    required: 'Password is required',
                  })}
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
                <div className="text-red-500 mt-5 mb-0 font-semibold text-lg">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
