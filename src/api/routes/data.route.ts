/* eslint-disable camelcase */
import { Router, NextFunction } from 'express'
// import { GetDataService } from '../../services/data.service'
import Container from 'typedi'
import { isUserAuth } from '../middlewares'
import { ApiDataService } from '../../services/api.data.service'
import { isValidPage } from '../middlewares/validation/validation.data'
import UserService from '../../services/user.service'

const route = Router()

export default (app: Router): void => {
  app.use(route)

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

          const { id: _ID } = user[0] // TODO: CAMBIAR por const { id: _ID } = user[0] ;
          const headers = {
            authToken: process.env.API_KEY || 'abc123',
            id: `${_ID}`,
            uuid: `${id}` // TODO: CAMBIAR EN HEADERS POR SALT salt: `${salt}`
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
          const { id: _ID } = await Container.get(UserService).ReadByField({ key: 'external_id', value: id })

          // POPULATE HEADERS.
          const headers = {
            authToken: process.env.API_KEY || 'abc123',
            id: _ID,
            uuid: id
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
          const { id: _ID } = await Container.get(UserService).ReadByField({ key: 'external_id', value: id })

          // POPULATE HEADERS.
          const headers = {
            authToken: process.env.API_KEY || 'abc123',
            id: _ID,
            uuid: id
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
          const { id: _ID } = await Container.get(UserService).ReadByField({ key: 'external_id', value: id })

          // POPULATE HEADERS.
          const headers = {
            authToken: process.env.API_KEY || 'abc123',
            id: _ID,
            uuid: id
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
