import { add } from 'date-fns';
import { ValidationOptions } from 'class-validator/types/decorator/ValidationOptions';

export function getDateFormat(date: Date) {
  if (date.toString().includes('T05')) return date;

  return add(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0), {
    months: 0,
    days: 1,
  });
}
