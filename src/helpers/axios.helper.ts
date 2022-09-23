import { IAxiosService } from './../types/interfaces/services'
import axios, { AxiosRequestConfig } from 'axios'
import { appConfig } from '../config'

/**
 * It's a function that receives an object with the following properties: page, _method, headers, data.
 * It returns a promise that resolves to a void
 * @param {IAxiosService}  - page: The page you want to access.
 * @returns The response.data or the error.
 */
async function AxiosHelper ({ page, _method, headers, data }: IAxiosService): Promise<void> {
  const config: AxiosRequestConfig<any> = {
    method: _method,
    url: appConfig.API.URLS[page],
    headers: {
      authorizationToken: headers.authToken,
      user_id_cm: '1',
      user_uuid: 'qwer'
      // user_id_cm: headers.id, TODO: CAMBIAR POR id: headers.id
      // user_uuid: headers.uuid TODO: CAMBIAR POR salt: headers.salt
    }
  }

  if (data) config['data'] = data

  try {
    await axios(config)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        return error
      })
  } catch (error) {
    return (error)
  }
}

export { AxiosHelper }
