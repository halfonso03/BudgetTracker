// api/userService.ts

import agent from "../../agent";

export async function getUsers(): Promise<UserListItem[]> {
  const response = await agent.get<UserListItem[]>('/users');
  return response.data;
}

export async function getUserById(id: string): Promise<UserListItem> {
  const response = await agent.get<UserListItem>(`/users/${id}`);
  return response.data;
}

export async function createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
  const response = await agent.post<CreateUserResponse>('/users', data);
  return response.data;
}

export async function updateUser(id: string, data: UpdateUserRequest): Promise<UpdateUserResponse> {
  const response = await agent.put<UpdateUserResponse>(`/users/${id}`, data);
  return response.data;
}

export async function resetPassword(id: string, data: ResetPasswordRequest): Promise<void> {
  await agent.post(`/users/${id}/reset-password`, data);
}

export async function changeAccountLockStatus(id: string, isLocked: boolean): Promise<void> {
  await agent.post(`/users/${id}/lockout`, { isLocked: isLocked });
}

export async function forceResetPassword(id: string): Promise<void> {
  await agent.post(`/users/${id}/force-reset-password`);
}

export async function userResetPassword(id: string, newPassword: string): Promise<void> {
  await agent.post(`/users/${id}/user-reset-password`, { newPassword });
}

