import { appConfig } from './../config'
import { randomBytes } from 'crypto'
import { Service } from 'typedi'
import { UserHelper } from './../helpers/user.helper'
import { IUserInput, IUser, IPasswordChange } from '../types/interfaces/services'
import argon2 from 'argon2'
import EmailService from './auth/email.service'
import jwt from 'jsonwebtoken'
import { UserModel } from './../models'

/**
 * @remarks Data Service
 * This Services is responsible of handling the user route logic.
 */
@Service()
export default class UserService {
  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   * @param {UserModel} userModel - This is the model that we created earlier.
   * @param {UserHelper} userHelper - This is the helper class that we created earlier.
   * @param {EmailService} emailService - This is the service that will be injected into the
   * constructor.
   */
  constructor(private userModel: UserModel, private userHelper: UserHelper, private emailService: EmailService) {}

  /**
  * It creates a new user in the database
  * @param {IUserInput} user - IUserInput
  * @returns A boolean value that indicates if the user was created or not.
  */
  async Create(user: IUserInput): Promise<{ isCreated: boolean }> {
    const salt = randomBytes(32)
    const password = user.password || this.userHelper.createPassword()
    const hashedPassword = await argon2.hash(password, { salt })
    const isUserResitered = await this.isUserRegistered(user.email)

    if (isUserResitered) {
      throw new Error('El empleado ya está registrado')
    }

    const newUser: IUser = {
      email: user.email,
      password: hashedPassword,
      salt: salt.toString('hex')
    }

    const { insertId } = await this.userModel.Create(newUser)

    if (!insertId) {
      throw new Error('El usuario no se ha creado')
    }

    return { isCreated: !!insertId }
  }

  /**
   * It takes in a key-value pair, and returns the data that matches the key-value pair
   * @param {any} data - any
   * @returns The data that was found in the database.
   */
  async ReadByField(data: any): Promise<any> {
    const _data = await this.userModel.GetByField(data)
    console.log('data', _data[0])

    if (!_data[0]) {
      throw new Error('Data not found for key-value')
    }

    return _data[0]
  }

  /**
   * It updates the password of a user
   * @param {number} idUser - number, data: any
   * @param {any} data - any
   * @returns a promise with an object that contains a boolean value.
   */
  async Update(idUser: number, data: any): Promise<{ isUpdated: boolean }> {
    const response = await this.userModel.Get<IUser>(idUser)
    const user = response[0]

    if (!user) {
      throw new Error('Usuario no registrado')
    }

    const validPassword = await argon2.verify(user.password, data.lastPassword)

    if (!validPassword) {
      throw new Error('La contraseña anterior no coincide con la guardada')
    }

    data.updated_at = new Date()
    const { changedRows } = await this.userModel.Put<IUser>(idUser, data)

    if (!changedRows) {
      throw new Error('No se ha actualizado la contraseña')
    }

    return { isUpdated: changedRows > 0 }
  }

  /**
   * It deletes a user from the database
   * @param {number} idUser - number
   * @returns { isDeleted: changedRows > 0 }
   */
  async Delete(idUser: number): Promise<{ isDeleted: boolean }> {
    const response = await this.userModel.Get<IUser>(idUser)
    const user = response[0]

    if (!user) {
      throw new Error('Usuario no registrado')
    }

    const { changedRows } = await this.userModel.Delete(idUser)

    if (!changedRows) {
      throw new Error('No se ha actualizado la contraseña')
    }

    return { isDeleted: changedRows > 0 }
  }

  /**
   * It receives an idUser and a data object with the lastPassword and newPassword properties, it then
   * checks if the user exists, if the lastPassword matches the one stored in the database, and if so,
   * it updates the password with the new one
   * @param {number} idUser - number, data: IPasswordChange
   * @param {IPasswordChange} data - IPasswordChange
   * @returns a promise that resolves to an object with a boolean property.
   */
  async ChangePassword(idUser: number, data: IPasswordChange): Promise<{ isPasswordChanged: boolean }> {
    const response = await this.userModel.Get<IUser>(idUser)
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

    const changeData: IUser = {
      password: hashedPassword,
      salt: salt.toString('hex')
    }

    changeData.updated_at = new Date()
    const { changedRows } = await this.userModel.Put<IUser>(idUser, changeData)

    if (!changedRows) {
      throw new Error('No se ha actualizado la contraseña')
    }

    return { isPasswordChanged: changedRows > 0 }
  }

  /**
   * It gets the user by email, generates a token and sends an email with the token
   * @param {string} emailInput - string: The email address of the user who wants to recover their
   * password.
   * @returns { emailSended: boolean }
   */
  async RecoverPassword(emailInput: string): Promise<{ emailSended: boolean }> {
    try {
      const user: IUser[] = await this.userModel.GetByField({ key: 'email', value: emailInput })
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
   * It takes a token and a password, it decodes the token, it gets the user from the database, it
   * hashes the password with the new salt, it updates the user in the database and it returns a
   * boolean indicating if the password was changed
   * @param {string} token - The token that was sent to the user's email.
   * @param {string} password - The new password that the user wants to set.
   * @returns a boolean value that indicates if the password has been changed or not.
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
   * "This function returns a boolean value that indicates whether or not a user with the specified
   * email address is registered in the database."
   *
   * The function is declared as private because it's only used internally by the UserService class
   * @param {string} email - string - The email address of the user
   * @returns A boolean value
   */
  private async isUserRegistered(email: string): Promise<boolean> {
    const result = await this.userModel.GetByField({ key: 'email', value: email })

    return result.length > 0
  }

  /**
   * It generates a JWT token with the email and salt as the payload
   * @param {string} email - The email address of the user.
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
