import { UnprocessableEntityException, ValidationPipeOptions } from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const buildValidationOptions = (): ValidationPipeOptions => ({
  errorHttpStatusCode: 422,
  stopAtFirstError: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: false,
  },
  exceptionFactory: (errors: ValidationError[]) => {
    const formatErrorMessages = (errors: ValidationError[]): string[] => {
      const messages: string[] = [];

      const extractErrors = (errorList: ValidationError[], parentPath = '') => {
        for (const error of errorList) {
          const label = error.target
            ? (Reflect.getMetadata(
                'FIELD_LABEL_KEY',
                error.target.constructor?.prototype,
                error.property,
              ) as string)
            : null;

          const propertyName = label || error.property;

          // 👉 construir path (opcional, pero útil)
          const currentPath = parentPath ? `${parentPath}.${propertyName}` : propertyName;

          // ✅ errores directos
          if (error.constraints) {
            Object.entries(error.constraints).forEach(([key, msg]) => {
              if (key === 'whitelistValidation') {
                messages.push(`La propiedad ${currentPath} no está permitida`);
              } else {
                const modifiedMsg = msg.replace(error.property, propertyName);
                messages.push(modifiedMsg);
              }
            });
          }

          // 🔥 errores anidados
          if (error.children && error.children.length > 0) {
            extractErrors(error.children, currentPath);
          }
        }
      };

      extractErrors(errors);
      return messages;
    };

    const messages = formatErrorMessages(errors);

    return new UnprocessableEntityException({
      message: messages,
      error: 'Unprocessable Entity',
    });
  },
});
