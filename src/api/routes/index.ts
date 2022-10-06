
/** Express router providing auth related routes
 * @module routers
 * @requires express
 */

import { Router } from 'express'

import authRoute from '../routes/auth'
import userRoute from '../routes/user'
import stripeRoute from '../routes/payment'
import dataRoute from '../routes/data'

/**
 * Main Routes Exports.
 * @name All the routes
 * @function
 * @memberof module:routers
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
export default (): Router => {
  const app = Router()

  authRoute(app)
  dataRoute(app)
  stripeRoute(app)
  userRoute(app)

  return app
}
