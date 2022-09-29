import { NextFunction, Router } from 'express'
import UserService from './../../services/user.service'
import { Container } from 'typedi'
import {
  isUserAuth,
  ValidateChangeRecoveredPassword,
  ValidatePasswordChange,
  ValidateRecoverPassword
} from './../middlewares'

const route = Router()

/**
 * @remarks USER ROUTES
 */
export default (app: Router): void => {
  app.use('/user', route)

  /**
   * This route is used to obtain the user data given a JWT in the req.header.
   * @returns The user data.
   */
  route.get('/me', isUserAuth, async (req: any, res, next: NextFunction) => {
    const userService = Container.get(UserService)
    console.info('Calling Post User endpoint with body: %o', req.token)

    try {
      const idUser = req.token.id
      const userData = await userService.ReadByField({ key: 'external_id', value: idUser })
      return res.json(userData).status(200)
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  /**
   * This route is used to obtain the user data given a JWT in the req.header.
   * @param {any} data - any - The updated data to save.
   * @returns The user data updated result.
   */
  route.put('/update', isUserAuth, ValidatePasswordChange, async (req: any, res, next: NextFunction) => {
    try {
      const idUser = Number(req.token.id)
      const data = req.body

      return res.json(await Container.get(UserService).Update(idUser, data))
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  /**
   * This route is used to obtain the user data given a JWT in the req.header.
   * @returns The result of deleting the given user from DB.
   */
  route.put('/delete', isUserAuth, ValidatePasswordChange, async (req: any, res, next: NextFunction) => {
    try {
      const idUser = Number(req.token.id)

      return res.json(await Container.get(UserService).Delete(idUser))
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  /**
   * This route is used to change the old password.
   * @param {any} data - any - The updated data to save.
   * @returns The user password updated result.
   */
  route.put('/password-change', isUserAuth, ValidatePasswordChange, async (req: any, res, next: NextFunction) => {
    try {
      const idUser = Number(req.token.id)
      const data = req.body

      return res.json(await Container.get(UserService).ChangePassword(idUser, data))
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  /**
   * This route is used to obtain an email link for password recovery.
   * @param {string} email - string - The user's email to send the link.
   * @returns The user password updated result.
   */
  route.post('/recover-password', ValidateRecoverPassword, async (req: any, res, next: NextFunction) => {
    try {
      const { email } = req.body

      return res.json(await Container.get(UserService).RecoverPassword(email)).status(200)
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  /**
   * This route is used to change the old password when forgotten.
   * @param {any} password - any - The updated password to save.
   * @returns The user password updated result.
   */
  route.post(
    '/change-password/:token',
    ValidateChangeRecoveredPassword,
    async (req: any, res, next: NextFunction) => {
      try {
        const { password } = req.body
        const { token } = req.params

        if (!token) {
          throw new Error('Se ha producido un error, contacte con servicio técnico.')
        }

        return res.json(await Container.get(UserService).ChangeRecoveredPassword(token, password)).status(200)
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    }
  )
}
