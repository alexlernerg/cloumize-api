import { Service } from 'typedi'
import { randomBytes } from 'crypto'
import EmailService from './email.service'
import argon2 from 'argon2'

@Service()
export default class UserService {
  /**
   * User services constructor
   * @param userModel User model
   */
  constructor (
    private userModel: any,
    private emailService: EmailService
  ) {}

  /**
   * Update user data
   * @param user User data
   * @returns Updated data
   */
  async Patch (idUser: number, user: any): Promise<any> {
    const { changedRows } = await this.userModel.Patch(idUser, user)

    if (!changedRows) {
      console.error('User cannot be save')
      throw new Error('Usuario no actualizado')
    }

    return user
  }

  /**
   * Delete user
   * @param idUser User id
   * @returns Delete data
   */
  async Delete (idUser: string): Promise<string> {
    const user = await this.userModel.GetUserByEmail(idUser)
    if (!user[0]) {
      return 'No existe un usuario en nuestra base de dato con esas credenciales'
    } else {
      const { affectedRows } = await this.userModel.Delete(idUser)
      if (affectedRows > 0) {
        return 'El usuario ha sido borrado con éxito'
      } else {
        return 'Usuario no eliminado'
      }
    }
  }

  /**
   * Send email to recovery password
   * @param email email
   * @returns Email founded
   */
  async resetPassword (emailInput: string): Promise<any> {
    const user = await this.userModel.GetUserByEmail(emailInput)
    const { email, salt } = user[0]

    if (!email) {
      throw new Error('Ha habido un error. Inténtelo de nuevo')
    }

    if (email === emailInput) {
      await this.emailService.SEND_CONTACT_EMAIL(email, salt)
    }

    return 'Revisa tu correo'
  }

  /**
   * Change password
   * @param email email
   * @returns password, salt
   */
  async changePassword (pastToken: string, password: string): Promise<any> {
    const salt = randomBytes(32)
    const hashedPassword = await argon2.hash(password, { salt })
    const saltToSave = salt.toString('hex')
    const { changedRows } = await this.userModel.updatePassword(saltToSave, hashedPassword, pastToken)

    if (changedRows > 0) {
      return 'The password has been successfully changed'
    } else {
      return 'The password could not be changed'
    }
  }

  /**
   * Get current user
   * @param idUser userId
   * @returns Current user
   */
  async currentUser (email: string): Promise<{ user: any; tokens: any[]; notifications: any[] }> {
    try {
      const response = await this.userModel.SignIn(email)
      const user: any = response[0]


      user.id = user['id_user']

      delete user['id_user']
      delete user.salt
      delete user.password

      return user

    } catch (error) {
      return error
    }
  }
}
