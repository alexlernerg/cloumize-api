export {};

declare global {
  namespace Express {
    export interface Request {
      currentUser: any;
      body: any;
    }

    export interface Response {
      status: number;
    }
  }
}

declare module '*.json' {
  const value: any
  export default value
}
