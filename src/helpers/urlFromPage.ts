// TODO: Esto es para limitar el uso de is.deletable en el resto de los helpers
import { appConfig } from '../config'
const data = { page1: 0 }

export default (page: string): string => {
  console.log('FOUNT THIS URL:', appConfig.API.URLS[`${data[page]}`])
  return appConfig.API.URLS[`${data[page]}`]
}
