import { OkPacket } from 'mysql'
import { Service } from 'typedi'
import _DatabaseModel from './database.model'
import { Database } from '../../types/interfaces'

/** {@inheritDoc _DatabaseModel}
 * @group BASE MODEL
 * Implements all the basic CRUD MySQL operations.
 */
@Service()
export default class BaseModel extends _DatabaseModel {
  private table: string
  private id: string

  /**
   * The constructor function is a special function that is called when an object is created from a class
   * @param {string} _table - The name of the table you want to query.
   * @param {string} _id - The id of the record you want to delete.
   * @param {any} _connection - This is the connection object that you created in the previous step.
   */
  constructor(_table: string, _id: string, _connection: Database) {
    super(_connection)
    this.table = _table
    this.id = _id
  }

  /**
   * Create Function
   * It takes in a generic type, and returns a promise of an OkPacket
   * @param {Type} data - Type - The data you want to insert into the database.
   * @returns The result of the query.
   */
  public async Create<Type>(data: Type): Promise<OkPacket> {
    return await this.executeQuery(`INSERT INTO ${this.table} SET ?`, [data])
  }

  /**
   * Get Function
   * It returns a promise of an array of objects of type Type, where Type is the type of the object that
   * the function is called on
   * @param {number} id - number - The id of the row you want to get.
   * @returns An array of objects of type Type.
   */
  public async Get<Type>(id: number): Promise<Type[]> {
    return await this.executeQuery(`SELECT * FROM ${this.table} WHERE ${this.id} = ? ORDER BY ${this.id} DESC`, [id])
  }

  /**
   * GetAll Function
   * It returns a promise that resolves to an array of objects of type Type
   * @returns An array of objects of type Type.
   */
  public async GetAll<Type>(): Promise<Type[]> {
    return await this.executeQuery(`SELECT * FROM ${this.table}`)
  }

  /**
   * GetByField Function
   * It returns an array of objects of type Type, where Type is the type of the object you want to return
   * @param {any} field - The field you want to search by.
   * @param {any} value - The value you want to search for.
   * @returns An array of objects
   */
  public async GetByField<Type>(data: any): Promise<Type[]> {
    const { key, value } = data
    return await this.executeQuery(`SELECT * FROM ${this.table} WHERE ${key} = ? `, [value])
  }

  /**
   * Put Function
   * We're taking the data object, getting the keys, creating a string with the keys and question marks,
   * and then pushing the values into an array
   * @param {number} id - number - The id of the row you want to update
   * @param {Type} data - Type - This is the data that you want to update.
   * @returns The result of the query.
   */
  public async Put<Type>(id: number, data: Type): Promise<OkPacket> {
    const dataKeys = Object.keys(data)
    let setData = ''
    const dataArr = []

    for (let i = 0; i < dataKeys.length; i++) {
      const key = dataKeys[i]
      i < dataKeys.length - 1 ? (setData += `${key} = ?, `) : (setData += `${key} = ?`)
      typeof data[key] === 'string' ? dataArr.push(`${data[key]}`) : dataArr.push(data[key])
    }
    return await this.executeQuery(`UPDATE ${this.table} SET ${setData} WHERE ${this.id} = ?`, [...dataArr, id])
  }

  /**
   * Delete a row from the database table
   * @param {number} id - number - The id of the row you want to delete
   * @returns The result of the query.
   */
  public async Delete(id: number): Promise<OkPacket> {
    return await this.executeQuery(`DELETE FROM ${this.table} WHERE ${this.id} = ?`, [id])
  }
}
