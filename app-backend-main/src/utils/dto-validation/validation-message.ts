import 'reflect-metadata';

import { ValidationOptions } from 'class-validator/types/decorator/ValidationOptions';

export const FIELD_LABEL_KEY = 'custom:field_label';

export function FieldLabel(label: string) {
  return function (target: any, propertyKey: string) {
    Reflect.defineMetadata(FIELD_LABEL_KEY, label, target, propertyKey);
  };
}
export function isStringValidationOptions() {
  return {
    message: 'La propiedad $property debe ser una cadena',
  };
}

export function minLengthValidationOptions() {
  return {
    message: 'La propiedad $property debe ser mayor o igual a $constraint1 caracteres',
  };
}

export function isNotEmptyValidationOptions() {
  return {
    message: 'La propiedad $property no debe estar vacío',
  };
}

export function isEmptyValidationOptions() {
  return {
    message: 'La propiedad $property debe estar vacía',
  };
}

export function maxLengthValidationOptions() {
  return {
    message: 'La propiedad $property debe ser menor o igual a $constraint1 caracteres',
  };
}

export function isEnumValidationOptions() {
  return {
    message: 'La propiedad $property debe ser un valor de enum válido',
  };
}

export function isEmailValidationOptions() {
  return {
    message: 'La propiedad $property debe ser un correo electrónico',
  };
}

export function isBooleanValidationOptions() {
  return {
    message: 'La propiedad $property debe ser un valor booleano',
  };
}

export function isNumberValidationOptions() {
  return {
    message: 'La propiedad $property debe ser un número',
  };
}

export function isDateValidationOptions() {
  return {
    message: 'La propiedad $property debe ser una fecha válida',
  };
}

export function isUrlValidationOptions() {
  return {
    message: 'La propiedad $property debe ser una url válida',
  };
}

export function minValidationOptions() {
  return {
    message: 'La propiedad $property debe contener como valor mímino $constraint1',
  };
}

export function maxValidationOptions() {
  return {
    message: 'La propiedad $property debe contener como valor máximo $constraint1',
  };
}

export function isPositiveValidationOptions() {
  return {
    message: 'La propiedad $property debe ser un número positivo',
  };
}

export function isIntValidationOptions() {
  return {
    message: 'La propiedad $property debe ser un número entero',
  };
}

export function isInValidationOptions() {
  return {
    message: 'La propiedad $property no contiene $constraint1',
  };
}
