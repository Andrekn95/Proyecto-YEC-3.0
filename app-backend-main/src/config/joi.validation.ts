import Joi from 'joi';

export const JoiValidationSchema = Joi.object({
  FRONTEND_URL: Joi.string().required(),

  APP_PORT: Joi.number().required(),
  APP_NAME: Joi.string().required(),
  APP_SHORT_NAME: Joi.string().required(),
  APP_VERSION: Joi.string().required(),
  APP_ENV: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_EXPIRES: Joi.string().required(),
  JWT_REFRESH_EXPIRES: Joi.string().required(),

  MAX_ATTEMPTS: Joi.number().required(),
  SECURITY_CODE_EXPIRES_IN: Joi.number().required(),

  THROTTLER_TTL: Joi.string().required(),
  THROTTLER_LIMIT: Joi.number().required(),

  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),

  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASSWORD: Joi.string().required(),

  MAIL_HOST: Joi.string().required(),
  MAIL_PORT: Joi.string().required(),
  MAIL_SECURE: Joi.boolean().required(),
  MAIL_USERNAME: Joi.string().required(),
  MAIL_PASSWORD: Joi.string().required(),
  MAIL_FROM_ADDRESS: Joi.string().required(),
  MAIL_FROM_NAME: Joi.string().required(),

  BUCKET_ENDPOINT: Joi.string().required(),
  BUCKET_PORT: Joi.number().required(),
  BUCKET_ACCESS_KEY: Joi.string().required(),
  BUCKET_SECRET_KEY: Joi.string().required(),
  BUCKET_NAME: Joi.string().required(),
  BUCKET_PRESIGNED_EXPIRY: Joi.number().required(),
  BUCKET_REGION: Joi.string().required(),

  URL_LDAP: Joi.string().required(),
});
