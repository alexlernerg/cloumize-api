import dotenv from 'dotenv'

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

if (process.env.NODE_ENV === 'development') {
  const envFound = dotenv.config()

  if (envFound.error) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️")
  }
}

export default {
  /**
   * PORT DEFAULT
   */
  PORT: process.env.PORT || 8080,
  /**
   * JWT CONFIG
   */
  JWT_SECRECT: process.env.JWT_SECRET || 'JWT_SECRECT',
  JWT_ALGORITHM: process.env.JWT_ALGORITHM || 'HS256',
  /**
   * DATABASE CONFIG
   */
  // DATABASE: {
  //   host: process.env.HOST_DB,
  //   post: process.env.POST_DB,
  //   user: process.env.USER_DB,
  //   password: process.env.PASSWORD_DB,
  //   database: process.env.DATABASE
  // },

  /**
   * API CONFIG
   */
  API: {
    PREFIX: '/api'
  },

  /**
   * API KEY
   */

  API_KEY: '9b8c61ec-1818-4647-b038-bd2676c522b7',
}
