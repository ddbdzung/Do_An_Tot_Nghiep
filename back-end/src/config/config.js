const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const path = require('path');
const Joi = require('joi');
const nodeEnv = process.env.NODE_ENV || 'development';
const env = dotenv.config({
  path: path.join(__dirname, '..', '..', `.env.${nodeEnv}`),
});
dotenvExpand(env);

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid('production', 'development', 'test')
      .required(),
    HOST: Joi.string().default('localhost'),
    URL: Joi.string().default('http://localhost'),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    ADMIN_PASSWORD: Joi.string().required(),
    // MONGODB_AUTH_USER: Joi.string()
    //   .required()
    //   .description('Mongo DB auth user'),
    // MONGODB_AUTH_PASS: Joi.string()
    //   .required()
    //   .description('Mongo DB auth pass'),
    JWT_SECRET_AT: Joi.string().required().description('JWT secret key'),
    JWT_SECRET_RT: Joi.string().required().description('JWT secret key'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number()
      .default(30)
      .description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(30)
      .description('days after which refresh tokens expire'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description(
      'the from field in the emails sent by the app',
    ),
    MULTIMEDIA_CLOUD_NAME: Joi.string()
      .required()
      .trim()
      .description('Cloudinary name'),
    MULTIMEDIA_API_KEY: Joi.string()
      .required()
      .trim()
      .description('Cloudinary api key'),
    MULTIMEDIA_API_SECRET: Joi.string()
      .required()
      .trim()
      .description('Cloudinary api secret'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: 'key' } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  host: envVars.HOST,
  url: envVars.URL,
  admin: {
    password: envVars.ADMIN_PASSWORD,
  },
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // user: envVars.MONGODB_AUTH_USER,
      // pass: envVars.MONGODB_AUTH_PASS,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
    accessTokenLife: envVars.JWT_ACCESS_EXPIRATION_MINUTES, // In minute
    refreshTokenLife: envVars.JWT_REFRESH_EXPIRATION_DAYS, // In day
    accessTokenKey: envVars.JWT_SECRET_AT,
    refreshTokenKey: envVars.JWT_SECRET_RT,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  multimedia: {
    cloudName: envVars.MULTIMEDIA_CLOUD_NAME,
    apiKey: envVars.MULTIMEDIA_API_KEY,
    apiSecret: envVars.MULTIMEDIA_API_SECRET,
  },
};
