import { Service } from 'typedi'
import nodemailer from 'nodemailer'
import { appConfig } from '../../config'
import { newEmployeeEmail, recoverPassword } from '../../resources/email-templates'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

/**
 * @group Email Service
 * This Services is responsible for sending emails.
 */
@Service()
export default class EmailService {
  private transporter = nodemailer.createTransport(appConfig.MAIL)

  /**
   * It sends an email to the user with a link to reset their password.
   * @param {string} email - The email address of the user who is requesting a password reset.
   * @param {string} token - The token that was generated in the previous step.
   * @returns The email is being returned.
   */
  async SEND_RECOVER_PASSWORD (email: string, token: string): Promise<SMTPTransport.SentMessageInfo> {
    return await this.transporter.sendMail({
      from: 'Cloumize cloumize.noreply@gmail.com', // TODO: CREAR EMAIL
      to: email,
      subject: 'Cloumize - recover password',
      html: recoverPassword(token)
    })
  }

  /**
   * This function sends an email to the user with their login credentials
   * @param {string} name - string, surname: string, password: string, email: string
   * @param {string} surname - string, password: string, email: string
   * @param {string} password - string - the password that the user will use to login
   * @param {string} email - the email address of the user
   */
  async SEND_NEW_USER_INFO (name: string, surname: string, password: string, email: string): Promise<any> {
    await this.transporter.sendMail({
      from: 'Cloumize cloumize.noreply@gmail.com', // TODO: CREAR EMAIL
      to: email,
      subject: 'Cloumize - User info',
      html: newEmployeeEmail(name, surname, password, email)
    })
  }
}
