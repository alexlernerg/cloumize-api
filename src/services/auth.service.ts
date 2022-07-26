// import { IUserAddress } from './../interfaces/user.interface'
// import { v4 } from 'uuid'
import jwt from 'jsonwebtoken'
import config from '../config'
import { randomBytes } from 'crypto'
import argon2 from 'argon2'
import { Service } from 'typedi'

@Service()
export default class AuthService {
  /**
   * Instance in constructor
   * @param userModel User model instance
   */
  constructor (private userModel: any) {}

  /**
   * Register user
   * @param email User email
   * @param password User password
   * @param publicAddress User's related wallet
   * @returns Promise with user and token
   */
  async SignUp (userInputDTO: any): Promise<{ user: any; token: string }> {
    const salt = randomBytes(32)
    const hashedPassword = await argon2.hash(userInputDTO.password, { salt })

    console.info('Hashing password')

    const isUserResitered = await this.isUserRegistered(userInputDTO.email)

    if (isUserResitered) {
      throw new Error('Usuario ya registrado')
    }

    console.info('Creating user db record')

    const userRecord: any = {
      email: userInputDTO.email,
      password: hashedPassword,
      avatar: 'https://cutt.ly/7YG1KJG',
      salt: salt.toString('hex')
    }

    const { insertId } = await this.userModel.SignUp(userRecord)

    if (!insertId) {
      throw new Error('El usuario no se ha creado')
    }

    // Store id
    userRecord.id = insertId

    // Delete data
    delete userRecord.salt
    delete userRecord.password

    console.info('Generating JWT')
    const token = this.generateToken(userRecord)

    return { user: userRecord, token }
  }

  /**
   * Sign in user
   * @param email User email
   * @param password User password
   * @returns Promise with user and token
   */
  async SignIn (email: string, password: string): Promise<{ user: any; token: string }> {
    const response = await this.userModel.SignIn(email)
    const user = response[0]

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
      const token = this.generateToken(user)

      delete user.password
      delete user.salt
      /**
       * Easy as pie, you don't need passport.js anymore :)
       */
      return { user, token }
    } else {
      throw new Error('Contraseña errónea')
    }
  }

  // /**
  // * Retrive the nonce for the user with publicAddress.
  // * @param publicAddress The user wallet.
  // * @returns Promise with the nonce.
  // */
  // async getNonce (publicAddress:string) : Promise<{nonce:string}> {
  //   const nonce = await this.userModel.getNonce(publicAddress)
  //   return nonce
  // }

  /**
   * Generate token
   * @param user User data
   * @returns Jwt token string
   */
  private generateToken (user: any): string {
    const today = new Date()
    const exp = new Date(today)
    exp.setDate(today.getDate() + 60)

    /**
     * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
     * The cool thing is that you can add custom properties a.k.a metadata
     * Here we are adding the userId, role and name
     * Beware that the metadata is public and can be decoded without _the secret_
     * but the client cannot craft a JWT to fake a userId
     * because it doesn't have _the secret_ to sign it
     * more information here: https://softwareontheroad.com/you-dont-need-passport
     */
    console.info(`Sign JWT for userId: ${user.id}`)

    return jwt.sign(
      {
        id: user.id, // We are gonna use this in the middleware 'isAuth'
        email: user.email,
        exp: exp.getTime() / 1000
      },
      config.JWT_SECRECT
    )
  }

  /**
   * Check if new user is registrered
   * @param user User data
   * @returns boolean
   */
  private async isUserRegistered (email: string): Promise<boolean> {
    const result = await this.userModel.IsRegistered(email)

    return result.length > 0
  }
}
