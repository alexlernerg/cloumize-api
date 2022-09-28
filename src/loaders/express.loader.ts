import express, { NextFunction } from 'express'
import cors from 'cors'
import { appConfig } from '../config'
import routes from '../api'

interface IExpress {
  app: express.Router
}

export default ({ app }: IExpress): void => {
  /**
   * Health Check endpoints
   */
  app.get('/status', (req, res) => {
    res.status(200).end()
  })

  /**
  * A middleware that allows cross-origin resource sharing.
  */
  app.use(
    cors({
      origin: [appConfig.FRONT_URL, appConfig.DEV_URL],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  )

  /**
  * This is a middleware that sets the header if-none-match to no-match-for-this.
  */
  app.use(function (req, res, next) {
    req.headers['if-none-match'] = 'no-match-for-this'
    next()
  })

  /**
    * A middleware that parses the body of the request and makes it available in the req.body object.
    */
  app.use(express.json())

  /**
    * A middleware that is used to prefix all the routes with the API prefix.
    */
  app.use(appConfig.API.PREFIX, routes())

  /**
  * This is a middleware that is used to catch all the routes that are not defined in the application.
  */
  app.use((req, res, next: NextFunction) => {
    next({
      message: 'Not Found',
      status: 404
    })
  })

  /**
   * This is a middleware that is used to catch all the routes that are not defined in the application.
   */
  app.use((err: any, req: any, res: any, next: NextFunction) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({ message: err.message })
        .end()
    }
    return next(err)
  })

  /**
  * This is a middleware that is used to catch all the routes that are not defined in the application.
  */
  app.use((err: any, req: any, res: any, next: NextFunction) => {
    res.status(err.status || 500)
    res.json({
      errors: {
        message: err.message
      }
    })
  })
}
