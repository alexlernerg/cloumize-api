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
export class WalletModel extends BaseModel {
  /**
   * A constructor for the class.
   * @param {any} pointer - any
   */
  constructor() {
    super('wallet', 'idWallet', appConfig.DATABASE)
  }
}

@Service()
export class UserPaymentModel extends BaseModel {
  /**
   * It's a constructor function that extends the base class and passes in the table name, primary key,
   * and database name.
   */
  constructor() {
    super('user_payment', 'idPayement', appConfig.DATABASE)
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
export class OrderModel extends BaseModel {
  /**
   * It's a constructor function that extends the base class and passes in the table name, primary key,
   * and database name.
   */
  constructor() {
    super('order', 'idOrder', appConfig.DATABASE)
  }
}

@Service()
export class ContractModel extends BaseModel {
  /**
   * It's a constructor function that extends the base class and passes in the table name, primary key,
   * and database name.
   */
  constructor() {
    super('contract', 'idContract', appConfig.DATABASE)
  }
}

@Service()
export class ProjectModel extends BaseModel {
  /**
   * It's a constructor function that extends the base class and passes in the table name, primary key,
   * and database name.
   */
  constructor() {
    super('project', 'idProject', appConfig.DATABASE)
  }
}

@Service()
export class CreatorModel extends BaseModel {
  /**
   * It's a constructor function that extends the base class and passes in the table name, primary key,
   * and database name.
   */
  constructor() {
    super('creator', 'idCreator', appConfig.DATABASE)
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
