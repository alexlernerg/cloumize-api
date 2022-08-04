export interface User {
  idUser?: number;
  email?: string;
  password: string;
  salt: string;
  deleted?: boolean;
}

export interface UserInput {
  email: string;
  password?: string;
}

export interface UserLoginOutput{
  user: User;
  token: string;
}

export interface PasswordChange{
  lastPassword: string;
  newPassword: string;
}
