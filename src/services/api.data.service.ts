import { Service } from 'typedi'
import axiosHelper from '../helpers/axios.helper'

@Service()
export class ApiDataService {
  // private instance: Axios
  /**
   * Constructor
   * @param eventModel Event model
   */
  constructor() {
    // axios.defaults.headers.common['x-cloumize-api-key'] = appConfig.API_KEY
  }

  /**
   * It creates a new data in the table and returns a pointer to the data.
   * @param {string} table - The name of the table you want to create data in.
   * @param {any} id - The id of the data you want to create.
   * @returns A pointer to the data that was created.
   */
  async CreateData(page: string, headers: { authToken: string, id: string, uuid: string }, data: { any }): Promise<any> {
    console.log('CALLING POST DATA :', page, headers, data)
    return await axiosHelper(page, 'POST', headers, data)
    // try {
    //   const pointer: Pointer = await axios.post(`https://cloumize-api.com/api/${table}/${id}`, data)
    //   return pointer
    // } catch (error) {
    //   throw new Error(error)
    // }
  }

  /**
   * It takes a table name, an id, and a data object, and returns a pointer.
   * @param {string} table - The name of the table you want to read from.
   * @param {any} id - The id of the data you want to read.
   * @returns The pointer is being returned.
   */
  async ReadData(page: string, headers:{ authToken: string, id: string, uuid: string }): Promise<any> {
    console.log('CALLING GET DATA :', page, headers)

    // async ReadData(table: string, id: any): Promise<any> {
    // try {
    //   const pointer: Pointer = await axios.get(`https://cloumize-api.com/api/${table}/${id}`)
    //   return pointer
    // } catch (error) {
    //   throw new Error(error)
    // }
    return await axiosHelper(page, 'GET', headers)
  }

  /**
   * It takes a table name, an id, and data as arguments, and returns a pointer to the updated data.
   * @param {string} table - The name of the table you want to update.
   * @param {any} id - The id of the data you want to update.
   * @param {any} data - The data you want to update.
   * @returns The pointer is being returned.
   */
  async UpdateData(page: string, headers: { authToken: string, id: string, uuid: string }, data: { any }): Promise<any> {
    console.log('CALLING PUT DATA :', page, headers, data)
    return await axiosHelper(page, 'PUT', headers, data)
    // try {
    //   const pointer: Pointer = await axios.put(`https://cloumize-api.com/api/${table}/${id}`, data)
    //   return pointer
    // } catch (error) {
    //   throw new Error(error)
    // }
  }

  /**
   * It takes a table name, an id, and data as arguments, and returns a pointer to the updated data.
   * @param {string} table - The name of the table you want to update.
   * @param {any} id - The id of the data you want to update.
   * @param {any} data - The data you want to update.
   * @returns The pointer is being returned.
   */
  async DeleteData(page: string, headers: { authToken: string, id: string, uuid: string }, data: { any }): Promise<any> {
    console.log('CALLING DELETE DATA :', page, headers, data)
    await axiosHelper(page, 'DELETE', headers, data)
    // try {
    //   const pointer: Pointer = await axios.delete(`https://cloumize-api.com/api/${table}/${id}`)
    //   return pointer
    // } catch (error) {
    //   throw new Error(error)
    // }
  }

  // /**
  //  * It must return a Pointer to query the database at the correct DB, table, and id.
  //  * Th
  //  * @param id identifier
  //  * // returns a pointer like this:
  //     "Pointer": {
  //       "table": "string", // table name
  //       "id": "number", // primary key
  //     }
  //  */
  // async GetPointer(id: any): Promise<Pointer> {
  //   try {
  //     const pointer: Pointer = await axios.get(`https://cloumize-api.com/api/pointers/${id}`)
  //     return pointer
  //   } catch (error) {
  //     throw new Error(error)
  //   }
  // }
}
