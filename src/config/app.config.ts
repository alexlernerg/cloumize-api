export default {
  PORT: process.env.PORT || 8080,
  HOST: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',

  JWT_USER_SECRECT: '00bbac6bf85b2c0132180d23ee237bcf74a492f71087ac57e5f4326b321b1480',
  JWT_ALGORITHM: 'HS256',

  // TODO: CAMBIAR A SU NUEVA BASE DE DATOS.
  DATABASE: {
    host: 'database-sandbox.cccmjxkosivs.eu-west-3.rds.amazonaws.com',
    post: '3306',
    user: 'ctb_team',
    password: 'ctb@Cloumize1',
    database: 'cloumize_dev_lambda'
  },

  API: {
    PREFIX: '/api',
    URLS: {
      'insert-arn': 'https://aw2xmogbpb.execute-api.eu-west-3.amazonaws.com/dev/insert-arn',
      'aprove-saving-finder': 'https://aw2xmogbpb.execute-api.eu-west-3.amazonaws.com/dev/sendsesemail',
      'status-onboarding': 'https://aw2xmogbpb.execute-api.eu-west-3.amazonaws.com/dev/ec2-sync-instance-status',
      dashboard: 'https://aw2xmogbpb.execute-api.eu-west-3.amazonaws.com/dev/dashboard-auth-get',
      'savings-finder': 'https://aw2xmogbpb.execute-api.eu-west-3.amazonaws.com/dev/savings-finder-auth-get',
      'compute-finder': 'https://aw2xmogbpb.execute-api.eu-west-3.amazonaws.com/insert-arn/ec2-instance-auth-get',
      'reserved-instances': 'https://aw2xmogbpb.execute-api.eu-west-3.amazonaws.com/dev/reserved-instance-auth-get',
      'savings-plans': 'https://aw2xmogbpb.execute-api.eu-west-3.amazonaws.com/dev/savings-plan-auth-get'
    }
  },

  API_KEY: '9b8c61ec-1818-4647-b038-bd2676c522b7',

  MAIL: {
    host: 'smtp.gmail.com',
    service: 'gmail',
    auth: {
      user: 'changetheblock@gmail.com',
      pass: 'pzaittepyjkyxryt'
    }
  },

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
