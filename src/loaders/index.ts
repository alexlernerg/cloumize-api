import express from 'express'
import expressLoader from './express.loader'

interface IExpressLoader {
  expressApp: express.Router;
}

/**
 * Load resources
 */
export default async ({ expressApp }: IExpressLoader): Promise<any> => {
  expressLoader({ app: expressApp })
  console.info('✊ Express loaded')
}
