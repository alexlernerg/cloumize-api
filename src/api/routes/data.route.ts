/* eslint-disable camelcase */
import { Router, NextFunction } from 'express'
// import { GetDataService } from '../../services/data.service'
import Container from 'typedi'
import { isUserAuth } from '../middlewares'
import { ApiDataService } from '../../services/api.data.service'
// import isDeletable from '../../helpers/is.deletable'
import { isValidPage } from '../middlewares/validation/validation.data'
import UserService from 'src/services/user.service';

const route = Router()

export default (app: Router): void => {
  app.use(route)

  app.get('/data/:page',
    isUserAuth,
    async (req:any, res:any, next:NextFunction) => {
      try {
        const { page } = req.params
        console.log('PAGE REQUESTED :', req.params)

        if (!isValidPage(page)) {
          return res.status(422).send('Unprocessable Entity')
        } else {
          // GET TOKEN ID = USER UUID IN DB.
          const { id } = req.token

          // GET USER CM ID IN DB.
          const { user_id_cm } = await Container.get(UserService).ReadByField({ key: 'user_uuid', value: id })

          // POPULATE HEADERS.
          const headers = {
            authToken: 'abc123',
            id: `${user_id_cm}`,
            uuid: `${id}`
          }

          const result = await Container.get(ApiDataService).ReadData(page, headers)
          return res.json(result).status(200)
        }
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    })

  app.post('/data/:page',
    isUserAuth,
    async (req: any, res: any, next: NextFunction) => {
      try {
        const { page } = req.params
        const { data } = req.body

        console.log('PAGE REQUESTED :', req.params)

        if (!isValidPage(page)) {
          return res.status(422).send('Unprocessable Entity')
        } else {
          // GET TOKEN ID = USER UUID IN DB.
          const { id } = req.token

          // GET USER CM ID IN DB.
          const { user_id_cm } = await Container.get(UserService).ReadByField({ key: 'user_uuid', value: id })

          // POPULATE HEADERS.
          const headers = {
            authToken: 'abc123',
            id: user_id_cm,
            uuid: id
          }

          // ADD EXTRA DATA TO PAYLOAD WHEN NEEDED.
          if (page === 'aprove-saving-finder') data.user_id_cm = id

          const result = await Container.get(ApiDataService).CreateData(page, headers, data)
          return res.json(result).status(200)
        }
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    })

  app.put('/data/:page',
    isUserAuth,
    async (req:any, res:any, next:NextFunction) => {
      try {
        const { page } = req.params
        const { data } = req.body

        console.log('PAGE REQUESTED :', req.params)
        if (!isValidPage(page)) {
          return res.status(422).send('Unprocessable Entity')
        } else {
          // GET TOKEN ID = USER UUID IN DB.
          const { id } = req.token

          // GET USER CM ID IN DB.
          const { user_id_cm } = await Container.get(UserService).ReadByField({ key: 'user_uuid', value: id })

          // POPULATE HEADERS.
          const headers = {
            authToken: 'abc123',
            id: user_id_cm,
            uuid: id
          }

          // ADD EXTRA DATA TO PAYLOAD WHEN NEEDED.
          if (page === 'aprove-saving-finder') data.user_id_cm = id

          const result = await Container.get(ApiDataService).UpdateData(page, headers, data)
          return res.json(result).status(200)
        }
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    })

  app.delete('/data/:page',
    isUserAuth,
    async (req:any, res:any, next:NextFunction) => {
      try {
        const { page } = req.params
        const { data } = req.body

        console.log('PAGE REQUESTED :', req.params)

        if (!isValidPage(page)) {
          return res.status(422).send('Unprocessable Entity')
        } else {
          // GET TOKEN ID = USER UUID IN DB.
          const { id } = req.token

          // GET USER CM ID IN DB.
          const { user_id_cm } = await Container.get(UserService).ReadByField({ key: 'user_uuid', value: id })

          // POPULATE HEADERS.
          const headers = {
            authToken: 'abc123',
            id: user_id_cm,
            uuid: id
          }
          const result = await Container.get(ApiDataService).DeleteData(page, headers, data)
          return res.json(result).status(200)
        }
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    })
}
