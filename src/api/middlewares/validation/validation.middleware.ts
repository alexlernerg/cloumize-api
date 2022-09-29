import { celebrate, Joi } from 'celebrate'

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

export {
  ValidateUser,
  ValidateLogin,
  ValidateSignUp,
  ValidatePasswordChange,
  ValidateRecoverPassword,
  ValidateChangeRecoveredPassword,
  ValidateData
}
