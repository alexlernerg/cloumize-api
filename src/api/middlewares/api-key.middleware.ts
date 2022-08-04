import { appConfig } from './../../config'

/**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const validateApiKey = (req, res, next): Promise<any> => {
  const API_KEY = req.header('API_KEY')

  if (API_KEY) {
    if (appConfig.API_KEY === API_KEY) {
      return next()
    } else {
      console.info('🔥 Invalid API_KEY: %o', API_KEY)
      return res.status(401).send({ error: 'Invalid API_KEY' })
    }
  } else {
    console.info('🔥 API_KEY not found in headers')
    return res.status(401).send({ error: 'API_KEY not found' })
  }
}

export default validateApiKey
