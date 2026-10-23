// api/userService.ts

import agent from "./agent";



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