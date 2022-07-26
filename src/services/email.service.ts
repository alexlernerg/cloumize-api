import { Service } from 'typedi'
import nodemailer from 'nodemailer'

@Service()
export default class EmailService {
  /**
   * To send a email
   * @param email
   * @param token
   */
  async SEND_CONTACT_EMAIL (email: string, token: string): Promise<any> {
    const TRANSPORTER = nodemailer.createTransport({
      host: process.env.NM_USER,
      service: 'Gmail',
      auth: {
        user: process.env.NM_USER || 'goobig.noreply@gmail.com',
        pass: process.env.NM_PASSWORD || 'Goobig2021.'
      }
    })

    await TRANSPORTER.sendMail({
      from: 'Ibanfield goobig.noreply@gmail.com',
      to: email,
      subject: 'Ibanfield',
      html: `Reset password to: ${email}. Click on this url: ${
        process.env.CORS_ORIGIN || `http://localhost:${process.env.PORT || 3000}`
      }/recovery_pass/${token}`
    })
  };
}
