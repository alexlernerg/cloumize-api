import { IRouter, NextFunction, Response } from 'express'
import Container from 'typedi'
import { isUserAuth, isValidPage } from '../../middlewares'
import { ApiDataService } from '../../../services'
import { IRequest } from '../../../types/interfaces'

/**
 * @group Data Routes.
 * This are the api-to-api CRUD routes.
 */

/**
 * It's a route that returns data from the database
 * @param {IRouter} route - IRouter - this is the express router that we are using to create the route.
 * @returns A router with a get method that takes a path with a page parameter, two middlewares,
 * and a callback function that returns a json object with the result.
 */
export const getData = (route: IRouter): void => {
  route.get('/:page',
    isUserAuth,
    isValidPage,
    async (req: IRequest, res: Response, next: NextFunction) => {
      console.log('GET DATA')

      try {
        const { page } = req.params
        const { id } = req.token

        const result = await Container.get(ApiDataService).ReadData({ page, id })

        return res.json(result).status(200)
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    })
}

/**
 * It takes a route, adds a post method to it, and returns the route
 * @param {IRouter} route - IRouter - this is the route that we're going to be using.
 * @returns A router with a post method that takes a path with a page parameter, two middlewares,
 * and a callback function that returns a json object with the result.
 */
export const postData = (route: IRouter): void => {
  route.post('/:page',
    isUserAuth,
    isValidPage,
    async (req: IRequest, res: Response, next: NextFunction) => {
      try {
        const { page } = req.params
        const { data } = req.body
        const { id } = req.token

        const result = await Container.get(ApiDataService).CreateData({ page, id, data })

        return res.json(result).status(200)
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    })
}

/**
 * It takes a route, adds a put method to it, and returns the route
 * @param {IRouter} route - IRouter - this is the route that we're going to be using.
 * @returns A router with a put method that takes a path with a page parameter, two middlewares,
 * and a callback function that returns a json object with the result.
 */
export const putData = (route: IRouter): void => {
  route.put('/:page',
    isUserAuth,
    isValidPage,
    async (req: IRequest, res: Response, next: NextFunction) => {
      try {
        const { page } = req.params
        const { data } = req.body
        const { id } = req.token

        const result = await Container.get(ApiDataService).UpdateData({ page, id, data })

        return res.json(result).status(200)
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    })
}

/**
 * It deletes data from the database
 * @param {IRouter} route - IRouter - this is the route that we're going to be using.
 * @returns A router with a delete method that takes a path with a page parameter, two middlewares,
 * and a callback function that returns a json object with the result.
 */
export const deleteData = (route: IRouter): void => {
  route.delete('/:page',
    isUserAuth,
    isValidPage,
    async (req: IRequest, res: Response, next: NextFunction) => {
      try {
        const { page } = req.params
        const { data } = req.body
        const { id } = req.token

        const result = await Container.get(ApiDataService).DeleteData({ page, id, data })

        return res.json(result).status(200)
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    })
}
