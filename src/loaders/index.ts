import express from 'express'
import expressLoader from './express.loader'
import mysqlLoader from './mysql.loader'
// import wsLoader from '../api/ws/websocket'
import nodemailerLoader from './nodemailer'
interface IExpressLoader {
  expressApp: express.Router;
}

/**
 * @category LOADERS
 */
export default async ({ expressApp }: IExpressLoader): Promise<any> => {
  await mysqlLoader() ? console.info('✅ Connected to database') : console.info('🚫 Database error connection')

  await nodemailerLoader()
  console.info('✅ Nodemailer loaded')

  // wsLoader(httpServer)
  // console.info('✅ WebSocket connection established')

  expressLoader({ app: expressApp })
  console.info('✅ Express loaded')
}
