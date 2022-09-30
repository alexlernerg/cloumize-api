import mysql from 'mysql'
import { Database } from '../../types/interfaces'
import { Service } from 'typedi'

/**
 * @group DATABASE MODEL
 * Connects to the DB given and sends a query using a internal method executeQuery.
 */
@Service()
export default class _DatabaseModel {
  /**
   * It creates a constructor function that takes in a parameter of type Database.
   * @param {Database} connection - Database
   */
  constructor(private connection: Database) {}

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
