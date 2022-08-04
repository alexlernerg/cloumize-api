import isAuth from './isAuth'

const isAdminAuth = isAuth('ADMIN')
const isCompanyAuth = isAuth('COMPANY')
const isUserAuth = isAuth('USER')

export { isAdminAuth, isUserAuth, isCompanyAuth }
