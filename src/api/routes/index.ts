import { Router } from 'express'

import authRoute from '../routes/auth/user.auth.route'
import userRoute from '../routes/user.route'
import stripeRoute from '../routes/payment.route'
import DataRoute from '../routes/data.route'

export default (): Router => {
  const app = Router()

  authRoute(app)
  userRoute(app)
  stripeRoute(app)
  DataRoute(app)

  return app
}
