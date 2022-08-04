import { DataModel } from '../models'
import { Service } from 'typedi'

@Service()
export class GetDataService {
  private dataModel: any

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   * @param {ProvinceModel} provinceModel - This is the model that we created earlier.
   */
  constructor(pointer: any) {
    this.dataModel = new DataModel(pointer)
  }

  /**
   * It takes in a data object, and returns a promise that resolves to the result of the GetByField
   * function in the dataModel
   * @param {any} data - {
   * @returns The dataModel.GetByField() method is being returned.
   */
  async ReadByField(data: any): Promise<any> {
    console.log('-------->', data)
    const _data = await this.dataModel.GetByField(data)

    if (!_data) {
      throw new Error('No se ha creado el documento')
    }

    return _data
  }

  /**
   * It creates a new user if the user doesn't exist
   * @param {any} data - any: The data that will be used to create the user.
   * @returns The id of the user that was created.
   */
  async Create(data: any): Promise<any> {
    console.log('-------->', data)
    const _data = await this.ReadByField(data)

    if (_data) {
      return _data
    }

    const { insertId } = await this.dataModel.Create(data)

    if (!insertId) {
      throw new Error('El usuario no se ha creado')
    }

    return insertId
  }

  /**
   * It updates a document in the database
   * @param {any} data - any
   * @returns The data that was updated
   */
  async Update(data: any): Promise<any> {
    console.log('-------->', data)
    const _data = await this.ReadByField(data)

    if (!_data) {
      throw new Error('No se ha creado el documento')
    }

    const id = _data[0][this.dataModel.id]
    const { affectedRows } = await this.dataModel.Put(id, data)

    if (!affectedRows) {
      throw new Error('No se ha actulizado el registro')
    }

    return data
  }

  /**
   * It deletes a record from the database.
   * @param {number} id - number
   * @returns The data that was deleted
   */
  async Delete(id: number): Promise<any> {
    console.log('-------->', id)
    const _data = await this.ReadByField({ key: 'id', value: id })

    if (!_data) {
      throw new Error('No se ha encontrado el registro')
    }

    const { affectedRows } = await this.dataModel.Delete(id)

    if (!affectedRows) {
      throw new Error('No se ha borrado el registro')
    }

    return affectedRows > 0
  }
}
