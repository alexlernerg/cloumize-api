import e from 'express'
import jwt from 'express-jwt'
import { appConfig } from '../../../config'

/**
 * We are assuming that the JWT will come in a header with the form
 *
 * Authorization: Bearer ${JWT}
 *
 * But it could come in a query parameter with the name that you want like
 * GET https://my-bulletproof-api.com/stats?apiKey=${JWT}
 * Luckily this API follow _common sense_ ergo a _good design_ and don't allow that ugly stuff
 */
const getTokenFromHeader = (req: any): void => {
  /**
   * @TODO Edge and Internet Explorer do some weird things with the headers
   * So I believe that this should handle more 'edge' cases ;)
   */
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1]
  }
  return null
}

/**
 * It's a middleware function that checks if the user is authenticated
 * @param {string} key - The key is the type of token you want to verify.
 * @returns A function that takes a key as a parameter and returns a function that takes a request and
 * response as parameters.
 */
export default function isAuth (key:string): e.RequestHandler {
  return jwt({
    secret: appConfig[`JWT_${key}_SECRECT`],
    algorithms: [appConfig.JWT_ALGORITHM],
    userProperty: 'token',
    getToken: getTokenFromHeader
  })
}
