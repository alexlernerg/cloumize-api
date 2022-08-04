import { AdminModel } from './../../models'

import jwt from 'jsonwebtoken'
import argon2 from 'argon2'
import { Service } from 'typedi'
import { appConfig } from '../../config'
import { Admin, AdminLoginOutput } from '../../interfaces/admin.interface'

@Service()
export default class AdminAuthService {
  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   * @param {AdminModel} adminModel - AdminModel
   */
  constructor(private adminModel: AdminModel) {}

  /**
   * Sign in user
   * @param email User email
   * @param password User password
   * @returns Promise with user and token
   */
  async Login(email: string, password: string): Promise<AdminLoginOutput> {
    const response = await this.adminModel.GetByField<Admin>({ fieldName: 'email', value: email })
    const admin: Admin = response[0]

    if (!admin) {
      throw new Error('Usuario no registrado')
    }

    /**
     * We use verify from argon2 to prevent 'timing based' attacks
     */
    const { passwordHash } = admin
    console.info('Checking password', passwordHash, typeof passwordHash, password, typeof password)

    const validPassword = await argon2.verify(passwordHash, password)

    if (validPassword) {
      console.info('Password is valid!')
      console.info('Generating JWT')

      delete admin.passwordHash
      delete admin.salt
      delete admin.deleted

      const token = this.generateToken(admin)

      /**
       * Easy as pie, you don't need passport.js anymore :)
       */
      return { admin, token }
    } else {
      throw new Error('Contraseña errónea')
    }
  }

  /**
   * Generate token
   * @param user User data
   * @returns Jwt token string
   */
  private generateToken(admin: Admin): string {
    const today = new Date()
    const exp = new Date(today)

    exp.setDate(today.getDate() + 1)

    const sign = {
      id: admin.idAdmin,
      email: admin.email,
      exp: exp.getTime() / 1000
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
    console.info(`Sign JWT for userId: ${admin.idAdmin}`)

    return jwt.sign(sign, appConfig.JWT_SECRECT_ADMIN)
  }
}
