import axios from 'axios'
import { Pointer } from './../interfaces/data.service.interface'
import { Service } from 'typedi'
import { TypesModel } from './../models'

@Service()
export class ApiDataService {
  /**
   * Constructor
   * @param eventModel Event model
   */
  constructor(private typesModel: TypesModel) {}

  /**
   * It must return a Pointer to query the database at the correct DB, table, and id.
   * Th
   * @param id identifier
   * // returns a pointer like this:
      "Pointer": {
        "table": "string", // table name
        "id": "number", // primary key
        "connection": { // all the database info
          "host": "string",
          "post": "string",
          "user": "string",
          "password": "string",
          "database": "string",
        }
      }
   */
  async GetPointer(id: any): Promise<Pointer> {
    try {
      const pointer: Pointer = await axios.get(`https://cloumize-api.com/api/pointers/${id}`)
      return pointer
    } catch (error) {
      throw new Error(error)
    }
  }
}
