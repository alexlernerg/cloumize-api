import { celebrate, Joi } from 'celebrate'

const ValidateUser = celebrate({
  body: Joi.object({
    idUser: Joi.number().optional(),
    email: Joi.string().required(),
    password: Joi.string().required()
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
    password: Joi.string().optional()
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
  ValidateChangeRecoveredPassword
}
