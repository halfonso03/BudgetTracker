// components/UserForm.tsx
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUserMutations } from '../../../api/hooks/users/useUserMutations';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import StackedFormRow from '../../../ui/StackedFormRow';
import { useUserQuery } from '../../../api/hooks/users/useUserQuery';
import toast from 'react-hot-toast';

interface UserFormProps {
  onSuccess?: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
}

export const UserForm: React.FC<UserFormProps> = ({ onSuccess }) => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const isEditing = Boolean(id);

  const {
    data: userData,
    isLoading: isFetchingUser,
    error: fetchError,
  } = useUserQuery(id);

  // Dynamic Yup validation schema
  const schema = yup
    .object({
      firstName: yup.string().required('First name is required'),
      lastName: yup.string().required('Last name is required'),
      email: yup
        .string()
        .email('Invalid email format')
        .required('Email is required'),
      password: isEditing
        ? yup
            .string()
            .transform((val) => (val === '' ? undefined : val))
            .optional()
            .min(6, 'Password must be at least 6 characters')
        : yup
            .string()
            .required('Password is required')
            .min(6, 'Password must be at least 6 characters'),
      confirmPassword: yup.string().when('password', {
        is: (val: string | undefined) => Boolean(val && val.length > 0),
        then: (schema) =>
          schema
            .required('Please confirm your password')
            .oneOf([yup.ref('password')], 'Passwords must match'),
        otherwise: (schema) => schema.optional(),
      }),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Populate form fields once user data is fetched
  useEffect(() => {
    if (userData) {
      reset({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: '',
        confirmPassword: '',
      });
    }
  }, [userData, reset]);

  const { createUser, updateUser, resetPassword } = useUserMutations();

  const onSubmit = (data: FormData) => {
    if (isEditing && id) {
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      };

      updateUser.mutate(
        { id, data: updateData },
        {
          onSuccess: () => {
            // If a new password was entered during edit, update it via reset-password endpoint
            if (data.password) {
              resetPassword.mutate(
                {
                  id,
                  data: {
                    newPassword: data.password,
                    forcePasswordChangeOnNextLogin: false,
                  },
                },
                {
                  onSuccess: () => {
                    if (onSuccess) onSuccess();
                    toast.success('User updated.');
                  },
                },
              );
            } else {
              if (onSuccess) onSuccess();
              toast.success('User updated.');
            }
          },
        },
      );
    } else {
      const createData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password || '',
      };

      createUser.mutate(createData, {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          } else {
            navigate('/users');
          }
        },
      });
    }
  };

  if (isFetchingUser) {
    return (
      <p className="text-center py-6 text-gray-500">Loading user data...</p>
    );
  }

  if (fetchError) {
    return (
      <p className="text-center py-6 text-red-600">
        Error loading user: {fetchError.message}
      </p>
    );
  }

  const isLoading =
    createUser.isPending || updateUser.isPending || resetPassword.isPending;
  const mutationError =
    createUser.error || updateUser.error || resetPassword.error;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 bg-white space-y-4"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {isEditing ? 'Edit User' : 'Create User'}
      </h3>

      <StackedFormRow
        id="firstName"
        label="First Name"
        error={errors?.firstName?.message}
        useMessage={true}
      >
        <Input {...register('firstName')} />
      </StackedFormRow>

      <StackedFormRow
        id="lastName"
        label="Last Name"
        error={errors?.lastName?.message}
        useMessage={true}
      >
        <Input {...register('lastName')} />
      </StackedFormRow>

      <StackedFormRow
        id="email"
        label="Email"
        error={errors?.email?.message}
        useMessage={true}
      >
        <Input type="email" {...register('email')} />
      </StackedFormRow>

      {/* Password Field (Required for create, optional/updatable for edit) */}
      <StackedFormRow
        id="password"
        label={isEditing ? 'New Password (Optional)' : 'Password'}
        error={errors?.password?.message}
        useMessage={true}
      >
        <Input type="password" {...register('password')} />
      </StackedFormRow>

      {/* Confirm Password Field */}
      <StackedFormRow
        id="confirmPassword"
        label="Confirm Password"
        error={errors?.confirmPassword?.message}
        useMessage={true}
      >
        <Input type="password" {...register('confirmPassword')} />
      </StackedFormRow>

      {/* API Mutation Error */}
      {mutationError instanceof Error && (
        <p className="text-sm text-red-600">{mutationError.message}</p>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variation="primary"
        buttonSize="small"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
      </Button>
    </form>
  );
};
