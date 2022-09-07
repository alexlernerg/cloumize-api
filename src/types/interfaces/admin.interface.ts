export interface Admin {
  idAdmin?: number
  email?: string
  passwordHash: string
  salt: string
  deleted?: boolean
}

export interface AdminInput {
  email: string
  password?: string
}

export interface AdminLoginOutput {
  admin: Admin
  token: string
}

export interface AdminPasswordChange {
  lastPassword: string
  newPassword: string
}
