import { ICreateData, IReadData, IUpdateData, IDeleteData } from '../types/interfaces/services'
import { Service } from 'typedi'
import { AxiosHelper } from '../helpers/axios.helper'

@Service()
export class ApiDataService {
  private axiosHelper;

  /**
   * The constructor function is a special function that is called when an object is created from a
   * class.
   */
  constructor() {
    this.axiosHelper = AxiosHelper
  }

  /**
   * This function will call the axiosHelper function with the page, _method, headers, and data
   * parameters.
   * @param {ICreateData}  - ICreateData
   * @returns The return value is the response from the server.
   */
  async CreateData({ page, headers, data }: ICreateData): Promise<any> {
    console.log('CALLING POST DATA :', page, headers, data)
    return await this.axiosHelper({ page, _method: 'POST', headers, data })
  }

  /**
   * It's a function that takes an object with two properties, page and headers, and returns a promise
   * that resolves to the result of calling another function, axiosHelper, with the same two properties
   * @param {IReadData}  - IReadData = {
   * @returns The return value is the result of the axiosHelper function.
   */
  async ReadData({ page, headers }: IReadData): Promise<any> {
    console.log('CALLING GET DATA :', page, headers)

    return await this.axiosHelper({ page, _method: 'GET', headers })
  }

  /**
    * This function will call the axiosHelper function with the page, _method, headers, and data
    * parameters.
    * @param {IUpdateData}  - IUpdateData
    * @returns The return value is the response from the server.
    */
  async UpdateData({ page, headers, data }: IUpdateData): Promise<any> {
    console.log('CALLING PUT DATA :', page, headers, data)
    return await this.axiosHelper({ page, _method: 'PUT', headers, data })
  }

  /**
    * This function will call the axiosHelper function with the page, _method, headers, and data
    * parameters.
    * @param {IDeleteData}  - IDeleteData
    * @returns The return value is the response from the server.
    */
  async DeleteData({ page, headers, data }: IDeleteData): Promise<any> {
    console.log('CALLING DELETE DATA :', page, headers, data)
    await this.axiosHelper({ page, _method: 'DELETE', headers, data })
  }
}
