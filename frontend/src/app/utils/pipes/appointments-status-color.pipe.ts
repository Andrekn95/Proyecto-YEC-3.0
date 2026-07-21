import { Pipe, PipeTransform } from '@angular/core';

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

@Pipe({
    name: 'appointmentStatusColor',
    standalone: true
})
export class AppointmentStatusColorPipe implements PipeTransform {
    transform(status: AppointmentStatus | null | undefined): string {
        switch (status) {
            case 'pending':
                return 'warn';
            case 'confirmed':
                return 'info';
            case 'cancelled':
                return 'danger';
            default:
                return 'secondary';
        }
    }
}
