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
    super('user', 'idUser', appConfig.DATABASE)
  }
}

@Service()
export class AdminModel extends BaseModel {
  /**
   * It's a constructor function that extends the base class and passes in the table name, primary key,
   * and database name.
   */
  constructor() {
    super('admin', 'idAdmin', appConfig.DATABASE)
  }
}

@Service()
export class SubscriptionModel extends BaseModel {
  /**
   * It's a constructor function that extends the base class and passes in the table name, primary key,
   * and database name.
   */
  constructor() {
    super('subscription', 'idSubscription', appConfig.DATABASE)
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
