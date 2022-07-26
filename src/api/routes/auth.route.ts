import { Router, NextFunction, Response, Request } from 'express'
import { Container } from 'typedi'
import AuthService from '../../services/auth.service'
import middlewares from '../middlewares'
import { celebrate, Joi } from 'celebrate'

const route = Router()

export default (app: Router): void => {
  app.use('/auth', route)

  route.post(
    '/signup',
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
        // publicAddress: Joi.string().required()
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      const authServiceInstance = Container.get(AuthService)

      console.info('Calling Sign-Up endpoint with body: %o', req.body)

      if (!req.body) {
        console.error('🔥 Body: %o', null)
        return next('Something went wrong')
      }

      try {
        const { user, token } = await authServiceInstance.SignUp(req.body as any)

        return user && token
          ? res.status(201).json({ user, token })
          : next({ status: 400, message: 'User not created' })
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    }
  )

  route.post(
    '/signin',
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
      })
    }),
    async (req, res, next: NextFunction) => {
      const authServiceInstance = Container.get(AuthService)
      console.info('Calling Sign-In endpoint with body: %o', req.body)

      try {
        const { email, password } = req.body
        const { user, token } = await authServiceInstance.SignIn(email, password)

        return res.json({ user, token }).status(200)
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    }
  )

  /**
   * @TODO Let's leave this as a place holder for now
   * The reason for a logout route could be deleting a 'push notification token'
   * so the device stops receiving push notifications after logout.
   *
   * Another use case for advance/enterprise apps, you can store a record of the jwt token
   * emitted for the session and add it to a black list.
   * It's really annoying to develop that but if you had to, please use Redis as your data store
   */
  route.post('/logout', middlewares.isAuth, (req, res, next: NextFunction) => {
    console.info('Calling Sign-Out endpoint with body: %o', req.body)
    try {
      // @TODO AuthService.Logout(req.user) do some clever stuff
      return res.status(200).end()
    } catch (e) {
      console.error('🔥 error %o', e)
      return next(e)
    }
  })
}
