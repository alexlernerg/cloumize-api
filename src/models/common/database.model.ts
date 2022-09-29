import mysql from 'mysql'
import { Database } from '../../types/interfaces/models'
import { Service } from 'typedi'

/**
 * @remarks DATABASE MODEL
 * Connects to the DB given and sends a query using a internal method executeQuery.
 */
@Service()
export default class _DatabaseModel {
  private connection: any

  /**
   * The constructor function is a special function that is called when an object is created from a
   * class.
   * @param {any} _connection - This is the connection object that is passed to the constructor.
   */
  constructor(_connection: Database) {
    this.connection = _connection
  }

  /**
   * It creates a new connection to the database, executes the query, and then closes the connection.
   * @param {string} query - string - The query to execute
   * @param {object} [data] - is an object that contains the data to be inserted into the database.
   * @returns The results of the query.
   */
  public executeQuery(query: string, data?: object): Promise<any> {
    return new Promise((resolve, reject) => {
      const session = mysql.createConnection(this.connection)

      session.query(query, data, function (error, results, fields) {
        if (error) {
          console.error(`queryDB ==> ${error}`)
          reject(error)
        } else {
          resolve(results)
        }
      })

      session.end()
    })
  }
}
