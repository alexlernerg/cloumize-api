import { NextFunction, Router } from 'express'
import UserService from './../../services/user.service'
import { Container } from 'typedi'
import {
  isUserAuth,
  ValidateChangeRecoveredPassword,
  ValidatePasswordChange,
  ValidateRecoverPassword,
  ValidateUser
} from './../middlewares'

const route = Router()

export default (app: Router): void => {
  app.use('/user', route)

  app.get('/me', isUserAuth, ValidateUser, async (req: any, res, next: NextFunction) => {
    const userService = Container.get(UserService)
    console.info('Calling Post User endpoint with body: %o', req.body)

    try {
      const idUser = Number(req.token.id)
      const userData = await userService.ReadByField({ key: 'id', value: idUser })

      return res.json(userData).status(200)
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  app.put('/update', isUserAuth, ValidatePasswordChange, async (req: any, res, next: NextFunction) => {
    try {
      const idUser = Number(req.token.id)
      const data = req.body

      return res.json(await Container.get(UserService).Update(idUser, data))
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  app.put('/delete', isUserAuth, ValidatePasswordChange, async (req: any, res, next: NextFunction) => {
    try {
      const idUser = Number(req.token.id)

      return res.json(await Container.get(UserService).Delete(idUser))
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  app.put('/password-change', isUserAuth, ValidatePasswordChange, async (req: any, res, next: NextFunction) => {
    try {
      const idUser = Number(req.token.id)
      const data = req.body

      return res.json(await Container.get(UserService).ChangePassword(idUser, data))
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  app.post('/recover-password', ValidateRecoverPassword, async (req: any, res, next: NextFunction) => {
    try {
      const { email } = req.body

      return res.json(await Container.get(UserService).RecoverPassword(email)).status(200)
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  app.post(
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
