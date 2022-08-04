import { Router, NextFunction } from 'express'
import { Container } from 'typedi'
import { isAdminAuth, ValidateLoginBoddy } from '../../middlewares'
import { AdminAuthService } from '../../../services/auth'

const route = Router()

export default (app: Router): void => {
  app.use('/auth/admin', route)

  route.post('/login', ValidateLoginBoddy, async (req, res, next: NextFunction) => {
    console.info('Calling Post Login endpoint with body: %o', req.body)
    try {
      const { email, password } = req.body
      const login = await Container.get(AdminAuthService).Login(email, password)

      return res.json(login).status(200)
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  route.post('/logout', isAdminAuth, (req, res, next: NextFunction) => {
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
