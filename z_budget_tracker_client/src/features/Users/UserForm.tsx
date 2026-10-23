// components/UserForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUserMutations } from '../../api/hooks/users/useUserMutations';

interface UserFormProps {
  userId?: string; // If provided, we are editing; otherwise, creating
  initialData?: { firstName: string; lastName: string; email: string };
  onSuccess?: () => void;
}

// Define form data type combining optional password for editing
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

export const UserForm: React.FC<UserFormProps> = ({
  userId,
  initialData,
  onSuccess,
}) => {
  const isEditing = Boolean(userId);

  // Dynamic Yup validation schema based on mode (Create vs Edit)
  const schema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: isEditing
      ? yup.string().optional()
      : yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  }).required();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      email: initialData?.email || '',
      password: '',
    },
  });

  const { createUser, updateUser } = useUserMutations();

  const onSubmit = (data: FormData) => {
    if (isEditing && userId) {
      const updateData: UpdateUserRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      };

      updateUser.mutate(
        { id: userId, data: updateData },
        {
          onSuccess: () => {
            if (onSuccess) onSuccess();
          },
        }
      );
    } else {
      const createData: CreateUserRequest = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password || '',
      };

      createUser.mutate(createData, {
        onSuccess: () => {
          if (onSuccess) onSuccess();
        },
      });
    }
  };

  const isLoading = createUser.isPending || updateUser.isPending;
  const mutationError = createUser.error || updateUser.error;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {isEditing ? 'Edit User' : 'Create User'}
      </h3>

      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">First Name</label>
        <input
          type="text"
          {...register('firstName')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.firstName && (
          <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Last Name</label>
        <input
          type="text"
          {...register('lastName')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.lastName && (
          <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          {...register('email')}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password (Only for Create Mode) */}
      {!isEditing && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            {...register('password')}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
      )}

      {/* API Mutation Error */}
      {mutationError instanceof Error && (
        <p className="text-sm text-red-600">{mutationError.message}</p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
      </button>
    </form>
  );
};