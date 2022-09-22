// import { GetDataService } from '../../services/data.service'
import { Router } from 'express'
import Container from 'typedi'
import { isUserAuth } from '../middlewares'
import { ApiDataService } from '../../services/api.data.service'
// import isDeletable from '../../helpers/is.deletable'
import { isValidPage } from '../middlewares/validation/validation.data'

const route = Router()

export default (app: Router): void => {
  app.use(route)

  route.get('/data/:page',
    isUserAuth,
    async (req, res, next) => {
      try {
        const { page } = req.params
        console.log('PAGE REQUESTED :', req.params)

        if (!isValidPage(page)) {
          return res.status(422).send('Unprocessable Entity')
        } else {
          const result = await Container.get(ApiDataService).ReadData(page)
          return res.json(result).status(200)
        }
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    })

  route.post('/data/:page',
    isUserAuth,
    async (req, res, next) => {
      try {
        const { page } = req.params
        const { data } = req.body

        console.log('PAGE REQUESTED :', req.params)

        if (!isValidPage(page)) {
          return res.status(422).send('Unprocessable Entity')
        } else {
          const result = await Container.get(ApiDataService).CreateData(page, data)
          return res.json(result).status(200)
        }
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    })

  route.put('/data/:page',
    isUserAuth,
    async (req, res, next) => {
      try {
        const { page } = req.params
        const { data } = req.body

        console.log('PAGE REQUESTED :', req.params)
        if (!isValidPage(page)) {
          return res.status(422).send('Unprocessable Entity')
        } else {
          const result = await Container.get(ApiDataService).UpdateData(page, data)
          return res.json(result).status(200)
        }
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    })

  route.delete('/data/:page',
    isUserAuth,
    async (req, res, next) => {
      try {
        const { page } = req.params
        const { data } = req.body

        console.log('PAGE REQUESTED :', req.params)

        if (!isValidPage(page)) {
          return res.status(422).send('Unprocessable Entity')
        } else {
          const result = await Container.get(ApiDataService).DeleteData(page, data)
          return res.json(result).status(200)
        }
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    })
}
