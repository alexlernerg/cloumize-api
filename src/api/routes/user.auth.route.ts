import { Router, NextFunction } from 'express'
import AuthService from '../../services/auth/auth.user.service'
import { Container } from 'typedi'
import { isAuth, ValidateLogin, ValidateSignUp } from '../middlewares'

const route = Router()

export default (app: Router): void => {
  app.use('/auth', route)

  route.post('/login', ValidateLogin, async (req, res, next: NextFunction) => {
    try {
      const { email, password } = req.body
      const login = await Container.get(AuthService).Login(email, password)

      return res.json(login).status(200)
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  route.post('/signup', ValidateSignUp, async (req, res, next: NextFunction) => {
    try {
      const { email, password } = req.body
      const signup = await Container.get(AuthService).SignUp({ email, password })

      return res.json(signup).status(200)
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  /**
   * @TODO Let's leave this as a place holder for now
   * The reason for a logout route could be deleting a 'push notification token'
   * so the device stops receiving push notifications after logout.
   *
   * Another use case for advance/enterprise apps, you can store a record of the jwt token
   * emitted for the session and add it to a black list.
   * It's really annoying to develop that but if you had to, please use Redis as your data store
   */
  route.post('/logout', isAuth, (req, res, next: NextFunction) => {
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
