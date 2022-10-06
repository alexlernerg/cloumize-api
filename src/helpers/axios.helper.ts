import { IRouter } from 'express'
import { IAxiosService } from './../types/interfaces'
import axios, { AxiosRequestConfig } from 'axios'
import { appConfig } from '../config'

/**
 * It takes in an object with a page, method, headers, and data, and returns a promise with the
 * response data
 * @param {IAxiosService}  - IAxiosService
 * @returns An object with the following properties:
 *   - data: The data that was returned from the server
 *   - status: The HTTP status code
 *   - statusText: The HTTP status text
 *   - headers: The HTTP headers
 *   - config: The config that was used to generate the request
 */
export async function AxiosHelper({ page, _method, headers, data }: IAxiosService): Promise<IRouter> {
  console.log('METHOD: ', _method)
  console.log('PAGE: ', page)
  console.log('HEADERS: ', headers)
  console.log('DATA: ', data)

  const config: AxiosRequestConfig<any> = {
    method: _method,
    url: appConfig.API.URLS[page],
    headers: {
      authorizationToken: headers.authToken,
      user_id_cm: headers.id,
      user_uuid: headers.uuid
    }
  }

  if (data) config['data'] = data

  return await axios(config)
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      return error
    })
}
