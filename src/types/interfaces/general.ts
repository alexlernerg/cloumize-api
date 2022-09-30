import { Request } from 'express'

interface IToken {
  id: string
}

export interface IRequest extends Request {
  token: IToken
}

export interface ResponseError extends Error {
  status?: number;
}
