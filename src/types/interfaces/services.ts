import { Method } from 'axios'

/* eslint-disable camelcase */
export interface IUser {
  id?: string| number;
  user_id_cm?: string|number;
  email?: string;
  password?: string;
  salt?: string;
  deleted?: boolean;
  created_at?: Date;
  updated_at?: Date;
  external_id?: string;
  user_uuid?: string;
  user_name?: string;
  company_name?: string;
  aws_account_name?: string;
}

export interface IUserInput {
  email: string;
  password?: string;
}

export interface IUserLoginOutput {
  user: IUser;
  token: string;
}

export interface IPasswordChange {
  lastPassword: string;
  newPassword: string;
}

/**
 DATA SERVICE INTERFACES
 */

export interface IHeaders {
  authToken: string;
  id: string;
  uuid: string;
}

export interface IAxiosService {
  page: string;
  _method: Method;
  headers: IHeaders;
  data?: any
}

export interface ICreateData {
  page: string;
  id: string;
  data: any
}

export interface IReadData {
  page: string;
  id: string;
}

export interface IUpdateData {
  page: string;
  id: string;
  data: any
}

export interface IDeleteData {
  page: string;
  id: string;
  data: any
}
