// import { GetDataService } from '../../services/data.service'
import { Router } from 'express'
import Container from 'typedi'
import { isUserAuth, ValidateData } from '../middlewares'
import { ApiDataService } from '../../services/api.data.service'
import isDeletable from '../../helpers/is.deletable'

const route = Router()

export default (app: Router): void => {
  app.use(route)

  app.get('/data/:page',
    // isUserAuth,
    async (req, res, next) => {
      // app.get('/data/:table/:id', isUserAuth, async (req, res, next) => {
      try {
        // const { table, id } = req.params
        const { page } = req.params
        // if (!id || !key || !value) {
        //   console.error('🔥 idProvince: %o', null)
        //   return next('Invalid Body')
        // }

        // if (!id || !table) {
        //   console.error('🔥 idProvince: %o', null)
        //   return next('Invalid Params')
        // }

        if (!page) {
          console.error('🔥 there is no ID for the page', null)
          return next('Invalid Params')
        }

        // const pointer = await Container.get(ApiDataService).GetPointer(id)
        // const dataService = new GetDataService(pointer)
        // const res = await dataService.ReadByField({ key, value })

        // const res = await Container.get(ApiDataService).ReadData(table, id)
        const result = await Container.get(ApiDataService).ReadData(page)
        console.log('YA TERMINO', result)
        return res.json(result).status(200)
      } catch (e) {
        console.error('🔥 error: %o', e)
        return next(e)
      }
    })

  app.post('/data/:table/:id', isUserAuth, ValidateData, async (req, res, next) => {
    try {
      // const { id, key, value, data } = req.body
      const { data } = req.body
      const { table, id } = req.params

      // if (!id || !key || !value || !data) {
      //   console.error('🔥 idProvince: %o', null)
      //   return next('Invalid Body')
      // }

      if (!table || !id || !data) {
        console.error('🔥 idProvince: %o', null)
        return next('Invalid Body')
      }

      // const pointer = await Container.get(ApiDataService).GetPointer(id)
      // const dataService = new GetDataService(pointer)
      // const res = await dataService.Create({ key, value })

      const res = await Container.get(ApiDataService).CreateData(table, id, data)

      res.json(res.status(200))
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  app.put('/data/:table/:id', isUserAuth, ValidateData, async (req, res, next) => {
    try {
      // const { id, key, value, data } = req.body
      const { data } = req.body
      const { table, id } = req.params

      // if (!id || !key || !value || !data) {
      //   console.error('🔥 idProvince: %o', null)
      //   return next('Invalid Body')
      // }

      if (!table || !id || !data) {
        console.error('🔥 idProvince: %o', null)
        return next('Invalid Body')
      }

      // const pointer = await Container.get(ApiDataService).GetPointer(id)
      // const dataService = new GetDataService(pointer)
      // const res = await dataService.Update({ key, value })

      const res = await Container.get(ApiDataService).UpdateData(table, id, data)

      res.json(res.status(200))
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })

  app.delete('/data/:table/:id', isUserAuth, async (req, res, next) => {
    try {
      const { table, id } = req.params
      // const { pointerId, dataId } = req.body
      // const pointer = await Container.get(ApiDataService).GetPointer(pointerId)
      // const dataService = new GetDataService(pointer)
      // if (!dataId) {
      //   console.error('🔥 idProvince: %o', null)
      //   return next('Falta id de los datos')
      // }

      if (!table || !id || !isDeletable(table)) {
        console.error('🔥 idProvince: %o', null)
        return next('Invalid Body')
      }

      return res.json({ isDelete: await Container.get(ApiDataService).DeleteData(table, id) }).status(200)
    } catch (e) {
      console.error('🔥 error: %o', e)
      return next(e)
    }
  })
}
