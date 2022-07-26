// import { Container } from 'typedi'
// import { IUser } from '../../interfaces/user.interface'
// import UserModel from './../../models/user.model'

// /**
//  * Attach user to req.currentUser
//  * @param {*} req Express req Object
//  * @param {*} res  Express res Object
//  * @param {*} next  Express next Function
//  */
// const attachCurrentUser = async (req: any, res: any, next: any): Promise<any> => {
//   const email = req.token.email
//   const userModel: UserModel = Container.get(UserModel)

//   try {
//     const response = await userModel.SignIn(email)
//     const currentUser: IUser = response[0]

//     if (!currentUser) {
//       return res.sendStatus(401)
//     }

//     delete currentUser.salt
//     delete currentUser.password
//     req.currentUser = currentUser
//     console.info('🔥 User logged: %o', currentUser.email)
//     return next()
//   } catch (e) {
//     console.error('🔥 Error attaching user to req: %o', e)
//     return next(e)
//   }
// }

// export default attachCurrentUser
