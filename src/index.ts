import express from 'express'
import CONFIG from './config'
import loader from './loaders'
/**
 * Start app server
 */
async function startServer (): Promise<any> {
  const app = express()
  await loader({ expressApp: app })

  app
    .listen(Number(CONFIG.PORT), '0.0.0.0', () => {
      console.info(`
      ################################################
      🛡️  Server listening on port: ${CONFIG.PORT} 🛡️
      ################################################
    `)
    })
    .on('error', err => {
      console.error(err)
      process.exit(1)
    })
}

startServer()
