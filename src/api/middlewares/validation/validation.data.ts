import { NextFunction } from 'express'
import { appConfig } from '../../../config'
import { celebrate, Joi } from 'celebrate'

export const ValidateData = celebrate({
  body: Joi.object({
    idUser: Joi.number().optional(),
    email: Joi.string().optional(),
    password: Joi.string().optional(),
    awsKey: Joi.string().optional(),
    hasMarketPlaceId: Joi.boolean().optional()
  })
})

/**
 * It takes a string as an argument and returns a boolean
 * @param {string} page - The page you want to check
 * @returns An array of strings.
 */
export function isValidPage(req:any, res:any, next:NextFunction):any {
  console.log('THE URL IS', req.params.page, Object.keys(appConfig.API.URLS).includes(req.params.page))
  if (!Object.keys(appConfig.API.URLS).includes(req.params.page)) {
    return res.status(422).send('Unprocessable Entity')
  } else {
    return next()
  }
}
