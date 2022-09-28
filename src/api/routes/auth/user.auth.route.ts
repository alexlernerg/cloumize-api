import { Router, NextFunction } from 'express'
import AuthService from '../../../services/auth/auth.user.service'
import { Container } from 'typedi'
import { ValidateLogin, ValidateSignUp } from '../../middlewares'

const route = Router()

export default (app: Router): void => {
  app.use('/auth', route)

  /**
   * This route is used to login into the App.
   * @param {string} email - string - The user email.
   * @param {string} password - string - The user password.
   * @returns A JWT.
   */
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

  /**
   * This route is used to signup into the App.
   * @param {string} email - string - The user email.
   * @param {string} password - string - The user password.
   * @returns A JWT.
   */
  route.post(
    '/signup',
    ValidateSignUp,
    async (req, res, next: NextFunction) => {
      try {
        const { email, password, awsAccountName, companyName, userName } = req.body
        console.log('req.body', req.body)
        const signup = await Container.get(AuthService).SignUp({
          email,
          password,
          awsAccountName,
          companyName,
          userName
        })

        return res.json(signup).status(200)
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    }
  )
}
