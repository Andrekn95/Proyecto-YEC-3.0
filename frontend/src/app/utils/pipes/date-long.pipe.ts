import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateLong',
    standalone: true
})
export class DateLongPipe implements PipeTransform {
    private readonly datePipe = new DatePipe('es');

    transform(value: Date | string | number | null | undefined, withSeconds = false): string | null {
        if (!value) return null;

        const format = withSeconds ? "dd 'de' MMMM yyyy, HH:mm:ss" : "dd 'de' MMMM yyyy, HH:mm";

        return this.datePipe.transform(value, format);
    }
}
