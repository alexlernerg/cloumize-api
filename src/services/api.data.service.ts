import { UserModel } from './../models/index'
import { ICreateData, IReadData, IUpdateData, IDeleteData, IUser } from '../types/interfaces/services'
import { Service } from 'typedi'
import { AxiosHelper } from '../helpers/axios.helper'

/**
 * @category Data Service
 * This Services is the one responsible of handling the API calls to Cloumize.
 */
@Service()
export class ApiDataService {
  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   * @param {UserModel} userModel - This is the name of the parameter.
   */
  constructor(private userModel: UserModel) { }

  /**
   * It takes in a page, id, and data, and returns a promise that resolves to the response from the
   * server
   * @param {ICreateData}  - ICreateData
   * @returns The return value is the result of the AxiosHelper function.
   */
  async CreateData({ page, id, data: _data }: ICreateData): Promise<any> {
    const headers = await this.GetHeaders(id)
    const data = this.AppendData(page, id, _data)

    return await AxiosHelper({ page, _method: 'POST', headers, data })
  }

  /**
   * It returns a promise that resolves to the result of an Axios request
   * @param {IReadData}  - IReadData
   * @returns The data from the API call.
   */
  async ReadData({ page, id }: IReadData): Promise<any> {
    const headers = await this.GetHeaders(id)

    return await AxiosHelper({ page, _method: 'GET', headers })
  }

  /**
   * It updates data in the database.
   * @param {IUpdateData}  - IUpdateData
   * @returns The return value is the result of the AxiosHelper function.
   */
  async UpdateData({ page, id, data: _data }: IUpdateData): Promise<any> {
    const headers = await this.GetHeaders(id)
    const data = this.AppendData(page, id, _data)
    return await AxiosHelper({ page, _method: 'PUT', headers, data })
  }

  /**
   * It deletes data from the database.
   * @param {IDeleteData}  - page - the page you want to send the request to
   * @returns The return value is the result of the AxiosHelper function.
   */
  async DeleteData({ page, id, data }: IDeleteData): Promise<any> {
    const headers = await this.GetHeaders(id)

    return await AxiosHelper({ page, _method: 'DELETE', headers, data })
  }

  /**
   * It takes an external_id, finds the user in the database, and returns the headers needed to make a
   * request to the API
   * @param {any} id - The id of the user you want to get the headers for.
   * @returns The headers object is being returned.
   */
  private async GetHeaders(id: any): Promise<any> {
    const user = await this.userModel.GetByField<IUser>({ key: 'external_id', value: id })
    // eslint-disable-next-line camelcase
    const { user_id_cm, user_uuid } = user[0]
    const headers = {
      authToken: process.env.API_KEY || 'abc123',
      id: user_id_cm,
      uuid: user_uuid
    }

    return headers
  }

  /**
   * It takes in a page name, an id, and some data, and returns the data with a user_id_cm property
   * added to it
   * @param page - The page you want to add data to.
   * @param id - The id of the user you want to get the data from.
   * @param data - The data to be inserted into the database.
   * @returns The data that was passed in.
   */
  private async AppendData(page, id, data): Promise<any> {
    const user = await this.userModel.GetByField<IUser>({ key: 'external_id', value: id })
    if (page === 'aprove-saving-finder' || page === 'insert-arn') data.user_id_cm = user[0].user_id_cm

    return data
  }
}
