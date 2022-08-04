import { Router } from 'express'
import { GetDataService } from '../../services/data.service'
import Container from 'typedi'
import { isAuth } from '../middlewares'
import { ApiDataService } from '../../services/api.data.service'

const route = Router()

export default (app: Router): void => {
  app.use(route)

  app.get('/data', isAuth, async (req, res, next) => {
    try {
      const { id, key, value } = req.body

      if (!id || !key || !value) {
        console.error('🔥 idProvince: %o', null)
        return next('Invalid Body')
      }

      const pointer = await Container.get(ApiDataService).GetPointer(id)
      const dataService = new GetDataService(pointer)
      const res = await dataService.ReadByField({ key, value })

      res.json(res.status(200))
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  app.post('/data', isAuth, async (req, res, next) => {
    try {
      const { id, key, value, data } = req.body

      if (!id || !key || !value || !data) {
        console.error('🔥 idProvince: %o', null)
        return next('Invalid Body')
      }

      const pointer = await Container.get(ApiDataService).GetPointer(id)
      const dataService = new GetDataService(pointer)
      const res = await dataService.Create({ key, value })

      res.json(res.status(200))
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  app.put('/data', isAuth, async (req, res, next) => {
    try {
      const { id, key, value, data } = req.body

      if (!id || !key || !value || !data) {
        console.error('🔥 idProvince: %o', null)
        return next('Invalid Body')
      }

      const pointer = await Container.get(ApiDataService).GetPointer(id)
      const dataService = new GetDataService(pointer)
      const res = await dataService.Update({ key, value })

      res.json(res.status(200))
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  app.delete('/data', isAuth, async (req, res, next) => {
    try {
      const { pointerId, dataId } = req.body
      const pointer = await Container.get(ApiDataService).GetPointer(pointerId)
      const dataService = new GetDataService(pointer)

      if (!dataId) {
        console.error('🔥 idProvince: %o', null)
        return next('Falta id de los datos')
      }

      return res.json({ isDelete: await dataService.Delete(dataId) }).status(200)
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })
}
