import { appConfig } from '../config'
import { Service } from 'typedi'
import BaseModel from './common/base.model'

@Service()
export class UserModel extends BaseModel {
  /**
   * It's a constructor function that extends the base class and passes in the table name, primary key,
   * and database name.
   */
  constructor() {
    // DATABASE: cloumize_dev, TABLE: cm_customer, PRIMARY_KEY: id
    super('cm_customer', 'id', appConfig.DATABASE)
  }
}

@Service()
export class TypesModel extends BaseModel {
  /**
   * A constructor for the class.
   * @param {any} pointer - any
   */
  constructor() {
    super('type', 'idType', appConfig.DATABASE)
  }
}

@Service()
export class DataModel extends BaseModel {
  /**
   * A constructor for the class.
   * @param {any} pointer - any
   */
  constructor(pointer: any) {
    super(pointer.table, pointer.id, pointer.connection)
  }
}
