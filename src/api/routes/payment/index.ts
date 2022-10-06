/** Express router providing auth related routes
 * @module routers/payment
 * @requires express
 */

import express, { Router } from 'express'
import { consultingPrice, updatePrice, createCheckoutSession, createPortalSession, webhook } from './payment.route'

/**
 * Express route to mount user related functions on.
 * @type {object}
 * @const
 * @namespace paymentRouter
 */
const route = Router()

/**
 * Route serving login form.
 * @name Data routes
 * @function
 * @memberof module:routers/payment~paymentRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
export default (app: Router): void => {
  app.use(express.static('public'))
  app.use(express.urlencoded({ extended: true }))
  app.use('/payment', route)

  consultingPrice(route)
  updatePrice(route)
  createCheckoutSession(route)
  createPortalSession(route)
  webhook(route)
}
