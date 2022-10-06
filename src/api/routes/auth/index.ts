/** Express router providing auth related routes
 * @module routers/auth
 * @requires express
 */

import { Router } from 'express'
import { logIn, signUp } from './user.auth.route'

/**
 * Express route to mount user related functions on.
 * @type {object}
 * @const
 * @namespace authRouter
 */
const route = Router()

/**
 * Route serving login form.
 * @name Auth routes
 * @function
 * @memberof module:routers/auth~authRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
export default (app: Router): void => {
  app.use('/auth', route)
  logIn(route)
  signUp(route)
}
