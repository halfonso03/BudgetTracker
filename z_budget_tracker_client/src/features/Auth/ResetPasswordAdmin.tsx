// components/PasswordResetForm.tsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '../../components/Button';
import Input from '../../components/Input';
import StackedFormRow from '../../ui/StackedFormRow';
import toast from 'react-hot-toast';
import { useUserMutations } from '../../api/hooks/users/useUserMutations';

interface FormData {
  password: string;
  confirmPassword: string;
}

// Yup validation schema for password change
const schema = yup
  .object({
    password: yup
      .string()
      .required('New password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup
      .string()
      .required('Please confirm your password')
      .oneOf([yup.ref('password')], 'Passwords must match'),
  })
  .required();

export const ResetPasswordAdmin: React.FC = () => {
  const { id } = useParams<{ id?: string }>();

  const navigate = useNavigate();
  const { userResetPassword } = useUserMutations();

  const [serverErrors, setErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Define the mutation for updating the password

  async function onSubmit(data: FormData) {
    await userResetPassword.mutateAsync(
      { id: id!, newPassword: data.password },
      {
        onSuccess: () => {
          toast.success('Password updated. Returning to login page.');
          setTimeout(() => {
            navigate('/login');
          }, 1500);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (e: any) => {
          console.log(e.response.data.errors);

          const errors2 = [];
          for (const err in e.response.data.errors) {
            console.log('first', e.response.data.errors[err][0])
            errors2.push(e.response.data.errors[err][0]);
          }
          setErrors(errors2)
        },
      },
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto p-6 bg-white space-y-4"
    >
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          Update Your Password
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          For security reasons, you must change your password before continuing.
        </p>
      </div>

      <StackedFormRow
        id="password"
        label="New Password"
        useMessage={true}
        error={errors?.password?.message}
      >
        <Input type="password" {...register('password')} />
      </StackedFormRow>

      <StackedFormRow
        id="confirmPassword"
        label="Confirm New Password"
        error={errors?.confirmPassword?.message}
        useMessage={true}
      >
        <Input type="password" {...register('confirmPassword')} />
      </StackedFormRow>

      {/* {userResetPassword.error instanceof Error && (
        <p className="text-sm text-red-600">
          {userResetPassword.error.message}
        </p>
      )} */}

      <Button
        type="submit"
        variation="primary"
        buttonSize="medium"
        disabled={userResetPassword.isPending}
      >
        {userResetPassword.isPending
          ? 'Updating Password...'
          : 'Update Password'}
      </Button>

      {serverErrors.map((e) => (<div className='text-red-500 font-medium'>{e}</div>))}
    </form>
  );
};
