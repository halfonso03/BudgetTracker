// types/user.ts
type CreateUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}

type CreateUserResponse = {
  id: string;
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
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

type ResetPasswordRequest = {
  newPassword: string
  forcePasswordChangeOnNextLogin: boolean
}