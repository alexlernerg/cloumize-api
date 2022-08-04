import { Router } from 'express'
import authRoute from './routes/auth.route'
import userRoute from './routes/user.route'
import stripeRoute from './routes/payment.route'
import provinceRoute from './routes/data.route'

/** */
export default (): Router => {
  const app = Router()

  authRoute(app)
  userRoute(app)
  stripeRoute(app)
  provinceRoute(app)

  return app
}
