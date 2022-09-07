export interface Database {
  host: string
  post: string
  user: string
  password: string
  database: string
}

export interface Pointer {
  table: string
  id: number
  connection: Database
}
