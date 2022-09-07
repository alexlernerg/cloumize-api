/* eslint-disable no-unused-vars */
import { UserModel } from '../../models'

declare global {
  namespace Express {
    export interface Request {
      currentUser: UserModel;
      body: any;
    }

    export interface Response {
      status: number;
    }
  }

  namespace Models {
    export type User = UserModel
  }
}

declare module '*.json' {
  const value: any
  export default value
}
