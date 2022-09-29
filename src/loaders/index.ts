import express from 'express'
import expressLoader from './express.loader'
import mysqlLoader from './mysql.loader'

interface IExpressLoader {
  expressApp: express.Router;
}

/**
 * @category LOADERS
 */
export default async ({ expressApp }: IExpressLoader): Promise<any> => {
  await mysqlLoader() ? console.info('✅ Connected to database') : console.info('🚫 Database error connection')

  expressLoader({ app: expressApp })
  console.info('✅ Express loaded')
}
