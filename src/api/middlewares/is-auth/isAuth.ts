import e from 'express'
import jwt from 'express-jwt'
import { appConfig } from '../../../config'

/**
 * If the authorization header is present and starts with the word "Token" or "Bearer", return the
 * token. Otherwise, return null
 * @param {any} req - any: This is the request object that is passed to the middleware function.
 * @returns The token from the header
 */
const getTokenFromHeader = (req: any): void => {
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1]
  }
  return null
}

/**
 * It's a middleware that checks if the request has a valid JWT token in the header
 * @param {string} key - The key is the type of token you want to verify. For example, if you want to
 * verify the access token, you can pass the key as access.
 * @returns A function that takes a key and returns a function that takes a request and returns a
 * response.
 */
export default function isAuth (key:string): e.RequestHandler {
  return jwt({
    secret: appConfig[`JWT_${key}_SECRECT`],
    algorithms: [appConfig.JWT_ALGORITHM],
    userProperty: 'token',
    getToken: getTokenFromHeader
  })
}
