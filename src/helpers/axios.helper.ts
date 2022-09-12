import axios, { Method } from 'axios'
import { appConfig } from '../config'

export default async (page: string, _method: Method, data?: { any }): Promise<void> => {
  console.log('THE REQUEST IS', _method, page, data)
  return axios({
    method: _method,
    url: appConfig.API.URLS[page],
    headers: {
      authorizationToken: 'abc123',
      user_id_cm: '1',
      user_uuid: 'qwer'
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
