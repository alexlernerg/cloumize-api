import 'reflect-metadata' // We need this in order to use @Decorators
import express from 'express'
import { appConfig } from './config'
import loader from './loaders'

/**
 * @category Data Service
 * This is the entry point of the Express App hosting the API.
 */
async function startServer (): Promise<any> {
  const app = express()
  await loader({ expressApp: app })

  app
    .listen(Number(appConfig.PORT), appConfig.HOST, () => {
      console.info(`
      ################################################
      🛡️  Server listening on port: ${appConfig.PORT} 🛡️
      ################################################
    `)
    })
    .on('error', err => {
      console.error(err)
      process.exit(1)
    })
}
startServer()
