import { celebrate, Joi } from 'celebrate'
import { IRequest } from './../../../types/interfaces'
import { NextFunction, Response } from 'express'
import { appConfig } from '../../../config'

/* Validating the data that is being sent to the server. */
const ValidateUser = celebrate({
  body: Joi.object({
    idUser: Joi.number().optional(),
    email: Joi.string().required(),
    password: Joi.string().required()
  })
})

const ValidateData = celebrate({
  body: Joi.object({
    idUser: Joi.number().optional(),
    email: Joi.string().optional(),
    password: Joi.string().optional(),
    awsKey: Joi.string().optional(),
    hasMarketPlaceId: Joi.boolean().optional()
  })
})

const ValidateLogin = celebrate({
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
})

const ValidateSignUp = celebrate({
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string().optional(),
    awsAccountName: Joi.string().optional(),
    companyName: Joi.string().optional(),
    userName: Joi.string().optional()
  })
})

const ValidatePasswordChange = celebrate({
  body: Joi.object({
    lastPassword: Joi.string().required(),
    newPassword: Joi.string().required()
  })
})

const ValidateRecoverPassword = celebrate({
  body: Joi.object({
    email: Joi.string().required()
  })
})

const ValidateChangeRecoveredPassword = celebrate({
  body: Joi.object({
    password: Joi.string().required()
  })
})

/**
 * It checks if the page parameter in the URL is a valid page
 * @param {IRequest} req - IRequest - this is the request object
 * @param {Response} res - Response - the response object
 * @param {NextFunction} next - NextFunction -&gt; This is a function that will be called when the
 * middleware is done.
 * @returns Either a 422 error Response or express NextFunction.
 */
function isValidPage(req: IRequest, res: Response, next: NextFunction): Response | void {
  console.log('THE URL IS', req.params.page, Object.keys(appConfig.API.URLS).includes(req.params.page))
  if (!Object.keys(appConfig.API.URLS).includes(req.params.page)) {
    return res.status(422).send('Unprocessable Entity')
  } else {
    return next()
  }
}

export {
  ValidateUser,
  ValidateLogin,
  ValidateSignUp,
  ValidatePasswordChange,
  ValidateRecoverPassword,
  ValidateChangeRecoveredPassword,
  ValidateData,
  isValidPage
}
