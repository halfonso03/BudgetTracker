// hooks/useUserMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, resetPassword, updateUser } from './userService';

export function useUserMutations() {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data: CreateUserRequest) => createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) => updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const resetPasswordMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: ResetPasswordRequest }) => resetPassword(id, data),
    });

    return {
        createUser: createMutation,
        updateUser: updateMutation,
        resetPassword: resetPasswordMutation,
    };
}