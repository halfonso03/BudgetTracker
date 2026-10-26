// hooks/useUserMutations.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, resetPassword, updateUser, changeAccountLockStatus, forceResetPassword, userResetPassword } from './userService';

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

    const changeAccountLockStatusMutation = useMutation({
        mutationFn: async ({ id, locked }: { id: string; locked: boolean }) => {
            await changeAccountLockStatus(id, locked)
            return id;
        },
        onSuccess: (id: string) => {
            queryClient.setQueryData(['users'], (oldUsers: UserListItem[]) => {
                return oldUsers.map((u) => ({
                    ...u,
                    isLocked:
                        u.id.toString() === id ? !u.isLocked : u.isLocked,
                }));
            });
        }
    });

    const forceResetPasswordMutation = useMutation({
        mutationFn: (id: string) => forceResetPassword(id),
    });

    const userResetPasswordMutation = useMutation({
        mutationFn: (data: { id: string, newPassword: string }) => userResetPassword(data.id, data.newPassword),
    });

    return {
        createUser: createMutation,
        updateUser: updateMutation,
        resetPassword: resetPasswordMutation,
        changeAccountLockStatus: changeAccountLockStatusMutation,
        forceResetPassword: forceResetPasswordMutation,
        userResetPassword: userResetPasswordMutation
    };
}