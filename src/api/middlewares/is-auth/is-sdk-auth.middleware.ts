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

const isSDKAuth = jwt({
  secret: appConfig.JWT_SDK_SECRECT, // The _secret_ to sign the JWTs
  algorithms: [appConfig.JWT_ALGORITHM], // JWT Algorithm
  audience: 'http://myapi/protected', // You can specify audience and/or issuer as well
  userProperty: 'token', // Use req.token to store the JWT
  getToken: getTokenFromHeader // How to extract the JWT from the request
})

export default isSDKAuth
