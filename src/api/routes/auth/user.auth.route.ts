import { IRouter, NextFunction } from 'express'
import { AuthService } from '../../../services'
import { Container } from 'typedi'
import { ValidateLogin, ValidateSignUp } from '../../middlewares'

/**
 * @group Auth Routes.
 * This are the user auth routes.
 */

/**
 * It takes a route, and returns a route with a post request that validates the login, and then calls
 * the login function in the auth service.
 * @param {IRouter} route - IRouter - this is the express router that we're using to create our routes.
 * @returns A router with a post method that takes a path, a middleware, and a callback function that returns a json object with the result.
 */
export const logIn = (route: IRouter): IRouter => {
  return route.post('/login', ValidateLogin, async (req, res, next: NextFunction) => {
    try {
      const { email, password } = req.body
      const login = await Container.get(AuthService).Login(email, password)

      return res.json(login).status(200)
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })
}

/**
 * It takes a route as an argument, and returns a route with a post request that validates the request
 * body, and then calls the signup function in the auth service.
 * @param {IRouter} route - IRouter - this is the route that we're going to add the signup route to.
 * @returns A router with a post method that takes a path, a middleware, and a callback function that returns a json object with the result.
 */
export const signUp = (route: IRouter): IRouter => {
  return route.post(
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
