import { IRequest } from './../../../types/interfaces'
import { IRouter, NextFunction, Response } from 'express'
import { UserService } from './../../../services'
import { Container } from 'typedi'
import {
  isUserAuth,
  ValidateChangeRecoveredPassword,
  ValidatePasswordChange,
  ValidateRecoverPassword
} from './../../middlewares'

/**
 * @group User Routes.
 * This are the user CRUD routes.
 */

/**
 * It's a route that returns the user data of the user that is logged in
 * @param {IRouter} route - IRouter - this is the Express Router object that we're using to define our
 * routes.
 * @returns A router with a get method that takes a path, a middleware,
 * and a callback function that returns a json object with the user information based on the JWT.
 */
export const me = (route: IRouter): void => {
  route.get('/me', isUserAuth, async (req: IRequest, res: Response, next: NextFunction) => {
    const userService = Container.get(UserService)
    console.log('GET USER DATA')

    try {
      const idUser = req.token.id
      const userData = await userService.ReadByField({ key: 'external_id', value: idUser })
      return res.json(userData).status(200)
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })
}

/**
 * It updates the user's password
 * @param {IRouter} route - IRouter
 * @returns A router with a put method that takes a path, two middlewares,
 * and a callback function that returns a json object with a boolean value of the operation
 */
export const update = (route: IRouter): void => {
  route.put('/update', isUserAuth, async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const idUser = req.token.id
      const data = req.body

      return res.json(await Container.get(UserService).Update(idUser, data))
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })
}

/**
 * It's a route that deletes a user
 * @param {IRouter} route - IRouter
 * @returns A router with a put method that takes a path, two middlewares,
 * and a callback function that returns a json object with a boolean value of the operation.
 */
export const deleteUser = (route: IRouter): void => {
  route.put('/delete', isUserAuth, async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const idUser = Number(req.token.id)

      return res.json(await Container.get(UserService).Delete(idUser))
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })
}

/**
 * It's a route that changes the password of the user who is logged in
 * @param {IRouter} route - IRouter - this is the route that we are going to use to create the route.
 * @returns A router with a put method that takes a path, two middlewares,
 * and a callback function that returns a json object with a boolean value of the operation.
 */
export const passwordChange = (route: IRouter): void => {
  route.put('/password-change', isUserAuth, ValidatePasswordChange, async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const idUser = req.token.id
      const data = req.body

      return res.json(await Container.get(UserService).ChangePassword(idUser, data))
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })
}

/**
 * It validates the request body, then calls the RecoverPassword method of the UserService class, and
 * returns the result
 * @param {IRouter} route - IRouter - this is the route that we're going to add the endpoint to.
 * @returns A router with a post method that takes a path, a middlewares,
 * and a callback function that returns a json object with a boolean value of the operation.
 */
export const recoverPassword = (route: IRouter): void => {
  route.post('/recover-password', ValidateRecoverPassword, async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body
      return res.json(await Container.get(UserService).RecoverPassword(email)).status(200)
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })
}

/**
 * It receives a route, and returns a route with a post method that validates the request body, and
 * then calls the ChangeRecoveredPassword method of the UserService
 * @param {IRouter} route - IRouter
 * @returns A router with a post method that takes a path, a middlewares,
 * and a callback function that returns a json object with a boolean value of the operation.
 */
export const changePasswordToken = (route: IRouter): void => {
  route.put(
    '/change-password/:token',
    ValidateChangeRecoveredPassword,
    async (req: IRequest, res: Response, next: NextFunction) => {
      try {
        const { password } = req.body
        const { token } = req.params

        console.log('token y password', token, password)

        if (!token) {
          throw new Error('An error happened. Contact with technical service')
        }

        return res.json(await Container.get(UserService).ChangeRecoveredPassword(token, password)).status(200)
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    }
  )
}
