/* eslint-disable camelcase */
import { Router, NextFunction } from 'express'
// import { GetDataService } from '../../services/data.service'
import Container from 'typedi'
import { isUserAuth } from '../middlewares'
import { ApiDataService } from '../../services/api.data.service'
import { isValidPage } from '../middlewares/validation/validation.data'
import UserService from '../../services/user.service'

const route = Router()

/**
 * This routes are used for CRUD operations on the Cloumize DB via the Cloumize API's.
 * @returns The data routes.
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
    async (req: any, res: any, next: NextFunction) => {
      try {
        const { page } = req.params

        if (!isValidPage(page)) {
          return res.status(422).send('Unprocessable Entity')
        } else {
          // GET ID FROM JWT = user_uuid IN DB.
          // TODO: CAMBIAR id
          const { id } = req.token

          // GET user_id_cm IN DB (FOR THE REQ HEADERS).
          const user = await Container.get(UserService).ReadByField({ key: 'external_id', value: id })

          const { user_uuid, id: _ID } = user // TODO: CAMBIAR por const { id: _ID } = user[0] ;
          const headers = {
            authToken: process.env.API_KEY || 'abc123',
            id: `${_ID}`,
            uuid: `${user_uuid}` // TODO: CAMBIAR EN HEADERS POR SALT salt: `${salt}`
          }

          const result = await Container.get(ApiDataService).ReadData({ page, headers })
          console.log('result', result)
          return res.json(result).status(200)
        }
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
    async (req: any, res: any, next: NextFunction) => {
      try {
        const { page } = req.params
        const { data } = req.body

        if (!isValidPage(page)) {
          return res.status(422).send('Unprocessable Entity')
        } else {
          // GET TOKEN ID = USER UUID IN DB.
          const { id } = req.token

          // GET USER CM ID IN DB.
          const { user_uuid, id: _ID } = await Container.get(UserService).ReadByField({ key: 'external_id', value: id })
          console.log('id', _ID)
          // POPULATE HEADERS.
          const headers = {
            authToken: process.env.API_KEY || 'abc123',
            id: _ID,
            uuid: user_uuid
          }

          // ADD EXTRA DATA TO PAYLOAD WHEN NEEDED.
          console.log('DATA', data)
          if (page === 'aprove-saving-finder' || page === 'insert-arn') data.user_id_cm = '2'

          const result = await Container.get(ApiDataService).CreateData({ page, headers, data })
          return res.json(result).status(200)
        }
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
    async (req: any, res: any, next: NextFunction) => {
      try {
        const { page } = req.params
        const { data } = req.body

        if (!isValidPage(page)) {
          return res.status(422).send('Unprocessable Entity')
        } else {
          // GET TOKEN ID = USER UUID IN DB.
          const { id } = req.token

          // GET USER CM ID IN DB.
          const { user_uuid, id: _ID } = await Container.get(UserService).ReadByField({ key: 'external_id', value: id })

          // POPULATE HEADERS.
          const headers = {
            authToken: process.env.API_KEY || 'abc123',
            id: _ID,
            uuid: user_uuid
          }

          // ADD EXTRA DATA TO PAYLOAD WHEN NEEDED.
          if (page === 'aprove-saving-finder' || page === 'insert-arn') data.user_id_cm = id

          const result = await Container.get(ApiDataService).UpdateData({ page, headers, data })
          return res.json(result).status(200)
        }
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
    async (req: any, res: any, next: NextFunction) => {
      try {
        const { page } = req.params
        const { data } = req.body

        if (!isValidPage(page)) {
          return res.status(422).send('Unprocessable Entity')
        } else {
          // GET TOKEN ID = USER UUID IN DB.
          const { id } = req.token

          // GET USER CM ID IN DB.
          const { user_uuid, id: _ID } = await Container.get(UserService).ReadByField({ key: 'external_id', value: id })

          // POPULATE HEADERS.
          const headers = {
            authToken: process.env.API_KEY || 'abc123',
            id: _ID,
            uuid: user_uuid
          }
          const result = await Container.get(ApiDataService).DeleteData({ page, headers, data })
          return res.json(result).status(200)
        }
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    })
}
