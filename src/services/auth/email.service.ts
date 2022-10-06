import { Service } from 'typedi'
import nodemailer from 'nodemailer'
import { appConfig } from '../../config'
import { recoverPassword } from '../../resources/email-templates'
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
      from: 'Cloumize devcloumize@gmail.com', // TODO: CREAR EMAIL
      to: email,
      subject: 'Cloumize - recover password',
      html: recoverPassword(token)
    })
  }
}
