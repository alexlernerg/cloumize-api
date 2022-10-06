/** Express router providing auth related routes
 * @module routers/user
 * @requires express
 */

import { Router } from 'express'
import { me, update, deleteUser, changePasswordToken, passwordChange, recoverPassword } from './user.route'

/**
 * Express route to mount user related functions on.
 * @type {object}
 * @const
 * @namespace userRouter
 */
const route = Router()

/**
 * Route serving user.
 * @name User routes
 * @function
 * @memberof module:routers/user~userRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
export default (app: Router): void => {
  app.use('/user', route)

  me(route)
  update(route)
  deleteUser(route)
  changePasswordToken(route)
  recoverPassword(route)
  passwordChange(route)
}
