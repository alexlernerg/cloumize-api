import { Router } from 'express'
import auth from './routes/auth.route'
import user from './routes/user.route'

/** */
export default (): Router => {
  const app = Router()

  auth(app)
  user(app)

  return app
}
