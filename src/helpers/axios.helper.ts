import axios from 'axios'
import urlFromPage from './urlFromPage'

export default async(page:string): Promise<void> => {
  console.log('THE PAGE IS', page)
  return axios({
    method: 'get',
    url: urlFromPage(page),
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
