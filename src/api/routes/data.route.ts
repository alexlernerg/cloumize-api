/* eslint-disable camelcase */
import { Router, NextFunction, Response } from 'express'
import Container from 'typedi'
import { isUserAuth, isValidPage } from '../middlewares'
import { ApiDataService } from '../../services'
import { IRequest } from '../../types/interfaces'

const route = Router()

/**
 * @group
 * It's a function that takes an express app as a parameter and then adds a bunch of routes to it
 * @param {Router} app - Router - The express router object.
 */
export default function DataRoute(app: Router): void {
  app.use(route)

  /**
   * A route that is used to GET data from the Cloumize DB.
   * It requires isUserAuth middleware (user is logged in)
   * It requires isValidPage middleware (page exists)
   * @param {string} page - string - The reference to set the API URL for the query.
   * @returns The result of the GET query to the cloumize API.
  */
  route.get('/data/:page',
    isUserAuth,
    isValidPage,
    async (req: IRequest, res: Response, next: NextFunction) => {
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

  /**
   * A route that is used to POST data to the Cloumize DB.
   * It requires isUserAuth middleware (user is logged in)
   * It requires isValidPage middleware (page exists)
   * @param {string} page - string - The reference to set the API URL for the query.
   * @param {any} data - any - The data object to post.
   * @returns The result of the POST query to the cloumize API.
  */
  route.post('/data/:page',
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

  /**
   * A route that is used to PUT data to the Cloumize DB.
   * It requires isUserAuth middleware (user is logged in)
   * It requires isValidPage middleware (page exists)
   * @param {string} page - string - The reference to set the API URL for the query.
   * @param {any} data - any - The data object to post.
   * @returns The result of the POST query to the cloumize API.
  */
  route.put('/data/:page',
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

  /**
   * This route is used to DELETE (ELIMINATE) data from the Cloumize DB.
   * It requires isUserAuth middleware (user is logged in)
   * It requires isValidPage middleware (page exists)
   * @param {string} page - string - The reference to set the API URL for the query.
   * @param {any} data - any - The data object contains the id of the entry to delete.
   * @returns The result of the DELETE query to the cloumize API.
   */
  route.delete('/data/:page',
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
