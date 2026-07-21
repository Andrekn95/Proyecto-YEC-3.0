import {inject, Injectable, signal} from '@angular/core';
import {MessageService} from 'primeng/api';
import {CustomIcons} from "@utils/icons/custom-icons";


type Severity =
    'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'help'
    | 'primary'
    | 'secondary'
    | 'contrast'
    | null
    | undefined;

export interface FormError {
    label: string;
    form: string;
    field: string;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class CustomMessageService {
    private readonly _messageService = inject(MessageService);
    private _isModalVisible = signal(false);
    readonly modalVisible = this._isModalVisible.asReadonly();
    private errorMessages = new Map<string, string>([
        ['INVALID_USER', 'Credenciales no válidas'],
        ['INVALID_PASSWORD', 'Credenciales no válidas'],
        ['INSUFFICIENT_PERMISSIONS', 'Permisos Insuficientes'],
        ['ACCOUNT_SUSPENDED', 'Cuenta Suspendida'],
        ['ACCOUNT_LOCKED', 'Cuenta Bloqueada'],
        ['REMAINING_TOKEN', 'Ya has generado un código recientemente.']
    ]);

    private _modalConfirmVisible: boolean = false;

    get modalConfirmVisible(): boolean {
        return this._modalConfirmVisible;
    }

    set modalConfirmVisible(value: boolean) {
        this._modalConfirmVisible = value;
    }

    private _modalAcceptSeverity: Severity = null;

    get modalAcceptSeverity(): Severity {
        return this._modalAcceptSeverity;
    }

    private _modalRejectSeverity: Severity = 'danger';

    get modalRejectSeverity(): Severity {
        return this._modalRejectSeverity;
    }

    private _modalIcon: string = '';

    get modalIcon(): string {
        return this._modalIcon;
    }

    private _modalTitleIcon: string = '';

    get modalTitleIcon(): string {
        return this._modalTitleIcon;
    }

    private _modalIconColor: string = '';

    get modalIconColor(): string {
        return this._modalIconColor;
    }

    private _modalTitle: string = '';

    get modalTitle(): string {
        return this._modalTitle;
    }

    private _modalMessage: string | FormError[] = '';

    get modalMessage(): string | FormError[] {
        return this._modalMessage;
    }

    private _modalLife: number = 5000;

    get modalLife(): number {
        return this._modalLife;
    }

    showSuccess({summary, detail}: { summary: string; detail: string }) {
        this._messageService.add({severity: 'success', summary, detail});
    }

    showError({summary, detail}: { summary: string; detail: string }) {
        this._modalLife = detail.length * 150;
        this._messageService.add({severity: 'error', summary, detail});
    }

    showInfo({summary, detail}: { summary: string; detail: string }) {
        this._messageService.add({severity: 'info', summary, detail});
    }

    showWarning({summary, detail}: { summary: string; detail: string }) {
        this._messageService.add({severity: 'warn', summary, detail});
    }

    showHttpSuccess(response: string | string[] | any) {
        this._messageService.add({severity: 'success', summary: response.title, detail: response.message});
    }

    showHttpError(error: string | string[] | any) {
        if (error) {
            this._modalLife = error.message.length * 150;
            let detail = error.message;

            if (Array.isArray(error.message)) {
                this._modalLife = error.message.length * 5000;
                error.message.sort();

                detail = error.message.join('\n');
            }

            // if (error.error === 'REMAINING_TOKEN') {
            //     this._modalLife = error.data.remainingSeconds * 1000;
            // }

            this._messageService.add({
                severity: 'error',
                summary: this.errorMessages.get(error.error) ?? error.error,
                detail
            });
        }
    }

    showFormErrors(message: string | FormError[]): void {
        if (Array.isArray(message)) message.sort();

        this._isModalVisible.set(true);
        this._modalAcceptSeverity = 'info';
        this._modalIcon = CustomIcons.CIRCLE_XMARK_REGULAR;
        this._modalIconColor = 'red';
        this._modalTitle = 'Falta completar o existen errores en los siguientes campos';
        this._modalMessage = message;
    }

    showModalInfo({summary, detail}: { summary: string; detail: string }): void {
        this._isModalVisible.set(true);
        this._modalAcceptSeverity = 'info';
        this._modalTitleIcon = CustomIcons.CIRCLE_INFO_SOLID;
        this._modalIconColor = 'var(--primary-color)';
        this._modalTitle = summary;
        this._modalMessage = detail;
    }

    showModalError({summary, detail}: { summary: string; detail: string }): void {
        this._isModalVisible.set(true);
        this._modalAcceptSeverity = 'danger';
        this._modalTitleIcon = CustomIcons.CIRCLE_XMARK_REGULAR;
        this._modalIconColor = 'var(--p-red-500)';
        this._modalTitle = summary;
        this._modalMessage = detail;
    }

    showModalWarn({summary, detail}: { summary: string; detail: string }): void {
        this._isModalVisible.set(true);
        this._modalAcceptSeverity = 'warn';
        this._modalTitleIcon = CustomIcons.CIRCLE_XMARK_REGULAR;
        this._modalIconColor = 'var(--primary-color)';
        this._modalTitle = summary;
        this._modalMessage = detail;
    }

    setModalVisible(value: boolean) {
        this._isModalVisible.set(value);
    }
}
