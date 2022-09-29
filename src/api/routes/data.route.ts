/* eslint-disable camelcase */
import { Router, NextFunction } from 'express'
// import { GetDataService } from '../../services/data.service'
import Container from 'typedi'
import { isUserAuth } from '../middlewares'
import { ApiDataService } from '../../services/api.data.service'
import { isValidPage } from '../middlewares/validation/validation.data'

const route = Router()

/**
 * @category DATA ROUTES
 */
export default (app: Router): void => {
  app.use(route)

  /**
   * This route is used to GET(READ) data from the Cloumize DB.
   * It requires isUserAuth middleware (user is logged in)
   * @returns The result of the GET query to the cloumize API.
   */
  route.get('/data/:page',
    isUserAuth,
    isValidPage,
    async (req: any, res: any, next: NextFunction) => {
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
   * This route is used to POST (CREATE) data to the Cloumize DB.
   * It requires isUserAuth middleware (user is logged in)
   * @param {string} page - string - The reference to set the API URL for the query.
   * @param {any} data - any - The data object to post.
   * @returns The result of the POST query to the cloumize API.
   */
  route.post('/data/:page',
    isUserAuth,
    isValidPage,
    async (req: any, res: any, next: NextFunction) => {
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
   * This route is used to PUT (UPDATE) data from the Cloumize DB.
   * It requires isUserAuth middleware (user is logged in)
   * @param {string} page - string - The reference to set the API URL for the query.
   * @param {any} data - any - The data object to put.
   * @returns The result of the PUT query to the cloumize API.
   */
  route.put('/data/:page',
    isUserAuth,
    isValidPage,
    async (req: any, res: any, next: NextFunction) => {
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
   * @param {string} page - string - The reference to set the API URL for the query.
   * @param {any} data - any - The data object contains the id of the entry to delete.
   * @returns The result of the PUT query to the cloumize API.
   */
  route.delete('/data/:page',
    isUserAuth,
    isValidPage,
    async (req: any, res: any, next: NextFunction) => {
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
