export default {
  /**
   * PORT DEFAULT
   */
  PORT: process.env.PORT || 8080,
  HOST: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',

  /**
   * JWT CONFIG
   */
  JWT_USER_SECRECT: 'JWT_SECRECT_MANDANGA@_USER',
  JWT_ALGORITHM: 'HS256',

  /**
   * DATABASE CONFIG
   */
  DATABASE: {
    host: 'nuepp3ddzwtnggom.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
    post: '3306',
    user: 'vhzhacoj0wxg14f8',
    password: 'lwl74iy29vejxqw5',
    database: 'l7d4v386yqib5u70'
  },

  /**
   * API CONFIG
   */
  API: {
    PREFIX: '/api',
    URLS: ['https://aw2xmogbpb.execute-api.eu-west-3.amazonaws.com/insert-arn/ec2-instance-auth-get']
  },

  /**
   * API KEY
   */

  API_KEY: '9b8c61ec-1818-4647-b038-bd2676c522b7',

  /**
   * MAIL
   */
  MAIL: {
    host: 'smtp.gmail.com',
    service: 'gmail',
    auth: {
      user: 'changetheblock@gmail.com',
      pass: 'pzaittepyjkyxryt'
    }
  },

  /**
   * Document path
   */

  DOCUMENT_PATH: './src/uploads/documents',

  FRONT_URL: process.env.CORS_ORIGIN || 'http://localhost:3000',

  DEV_URL: process.env.NODE_ENV !== 'production' ? 'http://192.168.0.14:4200' : '',

  CLOUD_FOLDERS: {
    EMPLOYEE: 'employees'
  },

  CLOUDINARY: {
    cloud_name: 'ddk8adwxa',
    api_key: '958478495788836',
    api_secret: 'blnLSStAGbbqUqHdh2EK3Nv9muE'
  }
}
