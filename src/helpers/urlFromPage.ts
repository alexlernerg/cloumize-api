// TODO: Esto es para limitar el uso de is.deletable en el resto de los helpers
import { appConfig } from '../config'
const data = { dashboard: 0, 'savings-finder': 1, 'compute-finder': 2, 'existing-plans': 3, 'savings-plans': 5, account: 6 }

export default (page: string): string => {
  console.log('FOUNT THIS URL:', appConfig.API.URLS[`${data[page]}`])
  return appConfig.API.URLS[`${data[page]}`]
}
