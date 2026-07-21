export enum MailSubjectEnum {
  PASSWORD_RESET = 'Solicitud para restablecer contraseña',
  ACCOUNT_REGISTER = 'Solicitud de creación de cuenta',
  TRANSACTIONAL_CODE = 'Tu código de verificación',
  INTERNAL_ACCOUNT_CREATED = `Bienvenido/a - Activación de cuenta`,
  EMAIL_VERIFICATION_RESEND = `Reenvío de correo de verificación`,
}

export enum MailTemplateEnum {
  TESTING = 'features/testing/testing',
  TRANSACTIONAL_CODE = 'features/auth/transactional-code',
  TRANSACTIONAL_PASSWORD_RESET_CODE = 'features/auth/transactional-password-reset-code',
  TRANSACTIONAL_SIGNUP_CODE = 'features/auth/transactional-signup-code',
  INTERNAL_ACCOUNT_CREATED = 'features/auth/internal-account-created',
  EMAIL_VERIFICATION_RESEND = 'features/auth/email-verification-resend',
}
