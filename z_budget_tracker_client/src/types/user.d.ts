// types/user.ts
type CreateUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

type CreateUserResponse = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

type UpdateUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
}

type UpdateUserResponse = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

type ResetPasswordRequest = {
  newPassword: string
  forcePasswordChangeOnNextLogin: boolean
}

type UserListItem = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  lastLoginDate: string | null; // ISO string format from backend API
  isLockoutEnabled: boolean;
  accessFailedCount: number;
  isLocked: boolean
}