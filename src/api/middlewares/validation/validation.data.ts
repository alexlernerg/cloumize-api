import { appConfig } from '../../../config'
import { celebrate, Joi } from 'celebrate'

/* A function that takes a string as an argument and returns a boolean. */
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
export function isValidPage(page: string): boolean {
  console.log('VALIDACION PAGINA: ', page)
  console.log('VALIDACION PAGINA: ', Object.keys(appConfig.API.URLS))
  console.log('VALIDACION PAGINA: ', Object.keys(appConfig.API.URLS).includes(page))

  return Object.keys(appConfig.API.URLS).includes(page)
}
