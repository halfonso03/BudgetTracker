// components/UserForm.tsx
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, updateUser } from '../../api/userService';

interface UserFormProps {
  userId?: string; // If provided, we are editing; otherwise, creating
  initialData?: { firstName: string; lastName: string; email: string };
  onSuccess?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ userId, initialData, onSuccess }) => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    password: '', // Only needed for creation
  });

  const isEditing = Boolean(userId);

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: (newUserData: CreateUserRequest) => createUser(newUserData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (onSuccess) onSuccess();
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: (updateData: UpdateUserRequest) => updateUser(userId!, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      if (onSuccess) onSuccess();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      updateMutation.mutate({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error || updateMutation.error;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
      <h3>{isEditing ? 'Edit User' : 'Create User'}</h3>

      <div>
        <label>First Name:</label>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Last Name:</label>
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      {!isEditing && (
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>
      )}

      {error instanceof Error && <p style={{ color: 'red' }}>{error.message}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : isEditing ? 'Update User' : 'Create User'}
      </button>
    </form>
  );
};