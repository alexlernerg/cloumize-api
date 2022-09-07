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
