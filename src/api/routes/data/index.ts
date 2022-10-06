/** Express router providing auth related routes
 * @module routers/data
 * @requires express
 */

import { Router } from 'express'
import { getData, putData, postData, deleteData } from './data.route'

/**
 * Express route to mount user related functions on.
 * @type {object}
 * @const
 * @namespace dataRouter
 */
const route = Router()

/**
 * Route serving login form.
 * @name Data routes
 * @function
 * @memberof module:routers/data~dataRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
export default (app: Router): void => {
  app.use('/data', route)
  getData(route)
  putData(route)
  postData(route)
  deleteData(route)
}
