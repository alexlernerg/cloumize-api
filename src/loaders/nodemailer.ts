
import nodemailer from 'nodemailer'
import { appConfig } from './../config'

export default async (): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const transporter = nodemailer.createTransport(appConfig.MAIL)
      resolve(transporter.sendMail({
        from: 'Test', // TODO: CREAR EMAIL
        to: 'email@email.com',
        subject: 'Test',
        html: 'Spam'
      }))
    } catch (error) {
      reject(error)
    }
  })
}
