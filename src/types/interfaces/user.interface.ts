/* eslint-disable camelcase */
export interface User {
  idUser?: number;
  email?: string;
  password: string;
  salt: string;
  deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
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
