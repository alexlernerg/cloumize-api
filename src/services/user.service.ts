import { appConfig } from './../config'
import { randomBytes } from 'crypto'
import { Service } from 'typedi'
import { UserHelper } from './../helpers'
import { IUserInput, IUser, IPasswordChange } from '../types/interfaces'
import argon2 from 'argon2'
import { EmailService } from '../services'
import jwt from 'jsonwebtoken'
import { UserModel } from './../models'

/**
 * @group Data Service
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
  constructor(private userModel: UserModel, private userHelper: UserHelper) { }

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
      throw new Error('User already registered')
    }

    const newUser: IUser = {
      email: user.email,
      password: hashedPassword,
      salt: salt.toString('hex')
    }

    const { insertId } = await this.userModel.Create(newUser)

    if (!insertId) {
      throw new Error('User not created')
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
   * @param {number} idUser - number
   * @param {any} data - any
   * @returns a promise with an object that contains a boolean value.
   */
  async Update(idUser: string, data: any): Promise<{ isUpdated: boolean }> {
    const response: IUser[] = await this.userModel.GetByField({ key: 'external_id', value: idUser })
    const user = response[0]

    if (!user) {
      throw new Error('User not registered')
    }

    const validPassword = await argon2.verify(user.password, data.lastPassword)

    if (!validPassword) {
      throw new Error('Invalid password')
    }

    // data.updated_at = new Date()
    const { changedRows } = await this.userModel.Put<IUser>(Number(user.id), data)

    if (!changedRows) {
      throw new Error('Password not updated')
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
      throw new Error('User not registered')
    }

    const { changedRows } = await this.userModel.Delete(idUser)

    if (!changedRows) {
      throw new Error('Password not updated')
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
  async ChangePassword(idUser: string, data: IPasswordChange): Promise<{ isPasswordChanged: boolean }> {
    const response: IUser[] = await this.userModel.GetByField({ key: 'external_id', value: idUser })
    const user = response[0]

    if (!user) {
      throw new Error('User not registered')
    }

    const validPassword = await argon2.verify(user.password, data.lastPassword)

    if (!validPassword) {
      throw new Error('Invalid password')
    }

    const salt = randomBytes(32)
    const { newPassword } = data
    const hashedPassword = await argon2.hash(newPassword, { salt })

    const changeData: IUser = {
      password: hashedPassword,
      salt: salt.toString('hex')
    }

    changeData.updated_at = new Date()
    const { isUpdated } = await this.Update(idUser, changeData)

    if (!isUpdated) {
      throw new Error('Password not updated')
    }

    return { isPasswordChanged: isUpdated }
  }

  /**
   * It gets the user by email, generates a token and sends an email with the token
   * @param {string} emailInput - string: The email address of the user who wants to recover their
   * password.
   * @returns { emailSended: boolean }
   */
  async RecoverPassword(email: string): Promise<{ emailSended: boolean }> {
    try {
      const user: IUser[] = await this.userModel.GetByField({ key: 'email', value: email })
      // eslint-disable-next-line camelcase
      // const { external_id } = user[0]

      if (!user) {
        throw new Error('Error. Try again')
      }
      const emailService = new EmailService()
      // console.log('id', external_id)
      const token = this.generateRecoverToken(email)
      console.log('result', token, email)
      console.log('transporter', emailService)
      const result = await emailService.SEND_RECOVER_PASSWORD(email, token)
      const emailSended = result.messageId.length > 0

      return { emailSended }
    } catch (error) {
      throw new Error('Password recovery failed')
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
      jwt.verify(token, appConfig.JWT_RECOVER_EMAIL_SECRET)
      const { email } = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())

      const response: IUser[] = await this.userModel.GetByField({ key: 'email', value: email })
      const user = response[0]

      if (!user) {
        throw new Error('Error. Try again')
      }
      const idUser = user['id']

      const newSalt = randomBytes(32)
      const hashedPassword = await argon2.hash(password, { salt: newSalt })
      const saltToSave = newSalt.toString('hex')
      console.log('USER', idUser, saltToSave, hashedPassword)

      const { changedRows } = await this.userModel.Put(Number(idUser), { salt: saltToSave, password: hashedPassword })

      return { passwordChanged: changedRows > 0 }
    } catch (error) {
      throw new Error('Password change failed')
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
  private generateRecoverToken(email: string): string {
    console.log('id + email', email)
    return jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + (60 * 15), // EXPIRES IN 15 MINUTES
        email
      },
      appConfig.JWT_RECOVER_EMAIL_SECRET
    )
  }
}
