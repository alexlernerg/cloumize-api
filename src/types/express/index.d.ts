/* eslint-disable no-unused-vars */
import User from '../../models/user.model'

declare global {
  namespace Express {
    export interface Request {
      currentUser: User;
      body: any;
    }

    export interface Response {
      status: number;
    }
  }

  namespace Models {
    export type UserModel = User;
  }
}

declare module '*.json' {
  const value: any
  export default value
}
