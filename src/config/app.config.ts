export default {
  /* The above code is setting the port and host for the server. */
  PORT: process.env.PORT || 8080,
  HOST: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',

  /* This is the secret key for the JWT token. */
  JWT_USER_SECRECT: '00bbac6bf85b2c0132180d23ee237bcf74a492f71087ac57e5f4326b321b1480',
  JWT_ALGORITHM: 'HS256',

  /* This is the database connection. */
  DATABASE: {
    host: 'database-sandbox.cccmjxkosivs.eu-west-3.rds.amazonaws.com',
    post: '3306',
    user: 'ctb_team',
    password: 'ctb@Cloumize1',
    database: 'cloumize_dev_lambda'
  },

  /* This is the API for the server. */
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

  /* This is the API key for the server. */
  API_KEY: '9b8c61ec-1818-4647-b038-bd2676c522b7',

  /* This is the email server. */
  MAIL: {
    host: 'smtp.gmail.com',
    service: 'gmail',
    auth: {
      user: 'changetheblock@gmail.com',
      pass: 'pzaittepyjkyxryt'
    }
  },

  /* This is the front end URL. */
  FRONT_URL: process.env.CORS_ORIGIN || 'https://sandbobx-front.cloumize.com/',
  DEV_URL: process.env.NODE_ENV !== 'production' ? 'http://192.168.0.14:4200' : ''
}
