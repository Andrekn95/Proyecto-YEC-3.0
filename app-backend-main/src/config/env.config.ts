import { registerAs } from '@nestjs/config';
import * as process from 'node:process';
import ms, { StringValue } from 'ms';

export const envConfig = registerAs('envConfig', () => {
  return {
    app: {
      port: parseInt(process.env.PORT!, 10),
      frontendUrl: process.env.FRONTEND_URL,
      name: process.env.APP_NAME,
      shortName: process.env.APP_SHORT_NAME,
      version: process.env.APP_VERSION,
      env: process.env.APP_ENV,
    },

    jwt: {
      secret: process.env.JWT_SECRET,
      expires: process.env.JWT_EXPIRES as StringValue,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      refreshExpires: ms(process.env.JWT_REFRESH_EXPIRES as StringValue),
    },

    throttler: {
      ttl: ms(process.env.THROTTLER_TTL as StringValue),
      limit: parseInt(process.env.THROTTLER_LIMIT!, 10),
    },

    database: {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT!, 10),
      username: process.env.DB_USER,
    },

    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT!, 10),
      password: process.env.REDIS_PASSWORD,
    },

    mail: {
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT!, 10),
      secure: process.env.MAIL_SECURE,
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      from: process.env.MAIL_FROM_ADDRESS,
      fromName: process.env.MAIL_FROM_NAME,
    },

    maxAttempts: parseInt(process.env.MAX_ATTEMPTS!, 10),
    securityCodeExpiresIn: parseInt(process.env.SECURITY_CODE_EXPIRES_IN!, 10),

    bucket: {
      endPoint: process.env.BUCKET_ENDPOINT,
      port: parseInt(process.env.BUCKET_PORT!, 10),
      accessKey: process.env.BUCKET_ACCESS_KEY,
      secretKey: process.env.BUCKET_SECRET_KEY,
      name: process.env.BUCKET_NAME,
      presignedExpiry: parseInt(process.env.BUCKET_PRESIGNED_EXPIRY!, 10),
      region: process.env.BUCKET_REGION,
    },

    externalApis: {
      urlLDAP: process.env.URL_LDAP,
    },
  };
});
