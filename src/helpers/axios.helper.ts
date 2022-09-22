import axios, { Method } from 'axios'
import { appConfig } from '../config'

export default async (page: string, _method: Method, headers?: { authToken: string, id: string, uuid: string }, data?: { any }): Promise<void> => {
  console.log('THE REQUEST IS', _method, page, data)
  return axios({
    method: _method,
    url: appConfig.API.URLS[page],
    headers: {
      authorizationToken: headers.authToken,
      user_id_cm: headers.id,
      user_uuid: headers.uuid
    }
  })
    .then(function (response) {
      return response.data
    })
    .catch(function (error) {
      console.log('LA CAGUE!', error)
      return error
    })
}
