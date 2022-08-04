import { NextFunction, Router } from 'express'
import UserService from './../../services/user.service'
import { Container } from 'typedi'
import isAuth from '../middlewares/is-auth.middleware'

import {
  ValidateChangeRecoveredPassword,
  ValidatePasswordChange,
  ValidateRecoverPassword,
  ValidateUser
} from '../middlewares/validation.middleware'

const route = Router()

export default (app: Router): void => {
  app.use(route)

  app.post('/user', isAuth, ValidateUser, async (req, res, next) => {
    const userService = Container.get(UserService)
    console.info('Calling Post User endpoint with body: %o', req.body)

    try {
      const { email, password } = req.body
      const idUser = await userService.Create({ email, password })

      return res.json({ email, idUser }).status(200)
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  app.put('/user/update', isAuth, ValidatePasswordChange, async (req: any, res, next: NextFunction) => {
    try {
      const idUser = Number(req.token.id)
      const data = req.body

      return res.json(await Container.get(UserService).ChangePassword(idUser, data))
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  app.post('/user/recover-password', ValidateRecoverPassword, async (req: any, res, next: NextFunction) => {
    try {
      const { email } = req.body

      return res.json(await Container.get(UserService).RecoverPassword(email)).status(200)
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  app.post(
    '/user/change-password/:token',
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
