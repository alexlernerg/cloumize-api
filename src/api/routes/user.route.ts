import { celebrate, Joi } from 'celebrate'
import { Router } from 'express'
import UserService from './../../services/user.service'
import { Container } from 'typedi'
import middlewares from '../middlewares'
const route = Router()

export default (app: Router): void => {
  app.use('/users', route)

  route.get('/me', middlewares.isAuth, async (req: any, res: any, next: any) => {
    const userServiceInstance = Container.get(UserService)
    const { email } = req.token

    try {
      const currentUser = await userServiceInstance.currentUser(email)

      return currentUser ? res.status(200).json(currentUser) : res.sendStatus(401)
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  route.patch(
    '/me',
    middlewares.isAuth,
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
      })
    }),
    async (req, res, next) => {
      const userServiceInstance = Container.get(UserService)
      const idUser = req['token'].id

      if (!req.body) {
        console.error('🔥 Body: %o', null)
        return next('Something went wrong')
      }

      try {
        const user = await userServiceInstance.Patch(idUser, req.body as any)
        res.status(200).json({ user })
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    }
  )

  // TODO: idUser es en realidad el email !
  route.delete('/me', middlewares.isAuth, async (req, res, next) => {
    const userServiceInstance = Container.get(UserService)
    const idUser = req['token'].email
    // console.log('idUSer', idUser)

    try {
      const isDelete = await userServiceInstance.Delete(idUser)
      res.status(200).json(isDelete)
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  // Recovery password
  route.post('/password_reset', async (req, res, next) => {
    const { email } = req.body
    const userServiceInstance = Container.get(UserService)

    if (!req.body) {
      console.error('🔥 Body: %o', null)
      return next('Something went wrong')
    }

    try {
      const response = await userServiceInstance.resetPassword(email)
      res.status(200).send(response)
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  // Pendiente: Eliminar.
  // route.get('/password_reset/:token', async (req, res, next) => {
  //   const token = req.params.token
  //   const userServiceInstance = Container.get(UserService)
  //   try {
  //     const response = await userServiceInstance.doResetPassword(token)
  //     res.status(200).send(response)
  //   } catch (e) {
  //     console.error('🔥 error: %o', e)
  //     return next(e)
  //   }
  // })

  route.put('/password_reset', async (req, res, next) => {
    const pastToken = req.body.tokenUser
    const password = req.body.password
    const userServiceInstance = Container.get(UserService)
    try {
      const response = await userServiceInstance.changePassword(pastToken, password)
      res.status(200).send(response)
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })
}
