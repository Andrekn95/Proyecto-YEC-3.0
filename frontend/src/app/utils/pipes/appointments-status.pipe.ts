import { Pipe, PipeTransform } from '@angular/core';

export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled';

@Pipe({
    name: 'appointmentStatus',
    standalone: true
})
export class AppointmentStatusPipe implements PipeTransform {
    transform(status: AppointmentStatus | null | undefined): string {
        switch (status) {
            case 'pending':
                return 'Pendiente';
            case 'confirmed':
                return 'Confirmada';
            case 'cancelled':
                return 'Cancelada';
            default:
                return '—';
        }
    }
}
