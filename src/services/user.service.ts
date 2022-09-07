import { appConfig } from './../config'
import { randomBytes } from 'crypto'
import { Service } from 'typedi'
import { UserHelper } from './../helpers/user.helper'
import { UserInput, User, PasswordChange } from '../types/interfaces/user.interface'
import argon2 from 'argon2'
import EmailService from './auth/email.service'
import jwt from 'jsonwebtoken'
import { UserModel } from './../models'

@Service()
export default class UserService {
  /**
   * Constructor
   */
  constructor(private userModel: UserModel, private userHelper: UserHelper, private emailService: EmailService) {}

  /**
   * It creates a new user
   * @param {UserInput} user - UserInput: This is the input object that we defined in the schema.
   * @returns The id of the user created
   */
  async Create(user: UserInput): Promise<number> {
    const salt = randomBytes(32)
    const password = user.password || this.userHelper.createPassword()
    const hashedPassword = await argon2.hash(password, { salt })
    const isUserResitered = await this.isUserRegistered(user.email)

    if (isUserResitered) {
      throw new Error('El empleado ya está registrado')
    }

    const newUser: User = {
      email: user.email,
      password: hashedPassword,
      salt: salt.toString('hex')
    }

    const { insertId } = await this.userModel.Create(newUser)

    if (!insertId) {
      throw new Error('El usuario no se ha creado')
    }

    return insertId
  }

  /**
   * It takes in a data object, and returns a promise that resolves to the result of the GetByField
   * function in the dataModel
   * @param {any} data - {
   * @returns The dataModel.GetByField() method is being returned.
   */
  async ReadByField(data: any): Promise<any> {
    console.log('-------->', data)
    const _data = await this.userModel.GetByField(data)

    if (!_data) {
      throw new Error('Data not found for key-value')
    }

    return _data
  }

  /**
   * It receives an idUser and a data object with the lastPassword and newPassword properties, it
   * checks if the lastPassword matches the one stored in the database, if it does, it generates a new
   * salt and a new hashed password, and then it updates the user's password and salt in the database
   * @param {number} idUser - number, data: PasswordChange
   * @param {PasswordChange} data - PasswordChange
   * @returns a promise that resolves to an object with a boolean property.
   */
  async Update(idUser: number, data: any): Promise<{ isUpdated: boolean }> {
    const response = await this.userModel.Get<User>(idUser)
    const user = response[0]

    if (!user) {
      throw new Error('Usuario no registrado')
    }

    const validPassword = await argon2.verify(user.password, data.lastPassword)

    if (!validPassword) {
      throw new Error('La contraseña anterior no coincide con la guardada')
    }

    const { changedRows } = await this.userModel.Put<User>(idUser, data)

    if (!changedRows) {
      throw new Error('No se ha actualizado la contraseña')
    }

    return { isUpdated: changedRows > 0 }
  }

  /**
   * It receives an idUser and a data object with the lastPassword and newPassword properties, it
   * checks if the lastPassword matches the one stored in the database, if it does, it generates a new
   * salt and a new hashed password, and then it updates the user's password and salt in the database
   * @param {number} idUser - number, data: PasswordChange
   * @param {PasswordChange} data - PasswordChange
   * @returns a promise that resolves to an object with a boolean property.
   */
  async ChangePassword(idUser: number, data: PasswordChange): Promise<{ isPasswordChanged: boolean }> {
    const response = await this.userModel.Get<User>(idUser)
    const user = response[0]

    if (!user) {
      throw new Error('Usuario no registrado')
    }

    const validPassword = await argon2.verify(user.password, data.lastPassword)

    if (!validPassword) {
      throw new Error('La contraseña anterior no coincide con la guardada')
    }

    const salt = randomBytes(32)
    const { newPassword } = data
    const hashedPassword = await argon2.hash(newPassword, { salt })

    const changeData: User = {
      password: hashedPassword,
      salt: salt.toString('hex')
    }

    const { changedRows } = await this.userModel.Put<User>(idUser, changeData)

    if (!changedRows) {
      throw new Error('No se ha actualizado la contraseña')
    }

    return { isPasswordChanged: changedRows > 0 }
  }

  /**
   * It gets the user by email, then it gets the email and salt from the user, then it checks if the
   * email exists, then it sends the email with the salt, then it returns the result
   * @param {string} emailInput - string
   * @returns { emailSended: boolean }
   */
  async RecoverPassword(emailInput: string): Promise<{ emailSended: boolean }> {
    try {
      const user: User[] = await this.userModel.GetByField({ key: 'email', value: emailInput })
      const { email, salt } = user[0]

      if (!email) {
        throw new Error('Ha habido un error. Inténtelo de nuevo')
      }

      const token = this.generateRecoverToken(email, salt)
      const result = await this.emailService.SEND_RECOVER_PASSWORD(email, token)
      const emailSended = result.messageId.length > 0

      return { emailSended }
    } catch (error) {
      throw new Error('Se ha producido un error al recuperar su contraseña.')
    }
  }

  /**
   * It takes a token and a password, and returns a boolean indicating whether the password was changed
   * or not
   * @param {string} token - The token that was sent to the user's email.
   * @param {string} password - The new password
   * @returns an object with a boolean property called passwordChanged.
   */
  async ChangeRecoveredPassword(token: string, password: string): Promise<{ passwordChanged: boolean }> {
    try {
      const { salt, email } = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
      const response = await this.userModel.GetByField({ value: 'email', key: email })

      if (!response) {
        throw new Error('Ha habido un error. Inténtelo de nuevo')
      }
      const user = response[0]
      const idUser = user['idUser']

      const newSalt = randomBytes(32)
      const hashedPassword = await argon2.hash(password, { salt: newSalt })
      const saltToSave = newSalt.toString('hex')

      const newUser = { saltToSave, hashedPassword, salt }

      const { changedRows } = await this.userModel.Put(idUser, newUser)

      return { passwordChanged: changedRows > 0 }
    } catch (error) {
      throw new Error('No se ha podido cambiar la contraseña')
    }
  }

  /**
   * It checks if a user is registered by checking if the user's email exists in the database
   * @param {string} email - string - The email address of the user
   * @returns A boolean value
   */
  private async isUserRegistered(email: string): Promise<boolean> {
    const result = await this.userModel.GetByField({ key: 'email', value: email })

    return result.length > 0
  }

  /**
   * It takes an email and a salt, and returns a JWT token
   * @param {string} email - The email of the user
   * @param {string} salt - A random string that is used to generate the token.
   * @returns A JWT token
   */
  private generateRecoverToken(email: string, salt: string): string {
    return jwt.sign(
      {
        email,
        salt
      },
      appConfig.JWT_USER_SECRECT
    )
  }
}
