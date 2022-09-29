import jwt from 'jsonwebtoken'
import { appConfig } from '../../config'
import { IUser, IUserLoginOutput } from '../../types/interfaces/services'
import argon2 from 'argon2'
import { Service } from 'typedi'
import { UserModel } from '../../models'
import { UserHelper } from '../../helpers/user.helper'
import { randomBytes } from 'crypto'
import { v4 as uuidv4 } from 'uuid'

/**
 * @category Auth User Service
 * This Services is responsible for the user auth routes logic.
 */
@Service()
export default class AuthService {
  /**
   * Instance in constructor
   * @param employeeModel Employee model instance
   * @param userModel IUser model instance
   */
  constructor(private userModel: UserModel, private userHelper: UserHelper) { }

  /**
   * Sign in user
   * @param email IUser email
   * @param password IUser password
   * @returns Promise with user and token
   */
  async Login(email: string, password: string): Promise<IUserLoginOutput> {
    const response = await this.userModel.GetByField({ key: 'email', value: email })
    const user: any = response[0]

    if (!user) {
      throw new Error('Usuario no registrado')
    }

    /**
     * We use verify from argon2 to prevent 'timing based' attacks
     */
    console.info('Checking password')

    const validPassword = await argon2.verify(user.password, password)

    if (validPassword) {
      console.info('Password is valid!')
      console.info('Generating JWT')

      delete user.password
      delete user.salt
      delete user.deleted

      const token = this.generateToken(user)

      /**
       * Easy as pie, you don't need passport.js anymore :)
       */
      return { user, token }
    } else {
      throw new Error('Contraseña errónea')
    }
  }

  /**
   * It creates a new user in the database
   * @param user - {email: string, password: string}
   * @returns The id of the user created
   */
  async SignUp(user: { email: string; password: string; awsAccountName: string; companyName: string; userName: string }): Promise<boolean> {
    const { email } = user
    const response = await this.userModel.GetByField({ key: 'email', value: email })
    const _user = response[0]

    if (_user) {
      throw new Error('Usuario registrado')
    }

    const salt = randomBytes(32)
    const password = user.password || this.userHelper.createPassword()
    const hashedPassword = await argon2.hash(password, { salt })

    const newUser: IUser = {
      email: user.email,
      user_name: user.userName,
      company_name: user.companyName,
      aws_account_name: user.awsAccountName,
      password: hashedPassword,
      salt: salt.toString('hex'),
      created_at: new Date(),
      external_id: uuidv4(),
      user_uuid: uuidv4()
    }

    const { insertId } = await this.userModel.Create(newUser)

    if (!insertId) {
      throw new Error('El usuario no se ha creado correctamente')
    }

    const { affectedRows } = await this.userModel.Put(insertId, { user_id_cm: insertId })

    if (affectedRows === 0) {
      throw new Error('El user_cm_id no se ha insertado correctamente')
    }

    return true
  }

  /**
   * Generate token
   * @param user IUser data
   * @returns Jwt token string
   */
  private generateToken(user: IUser): string {
    const today = new Date()
    const exp = new Date(today)

    exp.setDate(today.getDate() + 1)

    const sign = {
      id: user.external_id,
      email: user.email
      // exp: exp.getTime() / 1000
    }

    /**
     * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
     * The cool thing is that you can add custom properties a.k.a metadata
     * Here we are adding the userId, role and name
     * Beware that the metadata is public and can be decoded without _the secret_
     * but the client cannot craft a JWT to fake a userId
     * because it doesn't have _the secret_ to sign it
     * more information here: https://softwareontheroad.com/you-dont-need-passport
     */

    return jwt.sign(sign, appConfig.JWT_USER_SECRECT)
  }
}
