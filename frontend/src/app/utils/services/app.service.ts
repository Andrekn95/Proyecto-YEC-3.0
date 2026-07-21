import { Injectable, signal } from '@angular/core';
import { PaginationInterface } from '@utils/interfaces';

@Injectable({
    providedIn: 'root'
})
export class AppService {
    private readonly encryptionKey: string = 'rQg47X9@RkK9Vky#2U2xZ@hSB71zleXt';

    private _isLoading = signal(false);
    readonly loading = this._isLoading.asReadonly();

    private _isProcessing = signal(false);
    readonly processing = this._isProcessing.asReadonly();

    private _higherSort: number = 1;
    private _sidebarVisible: boolean = false;

    constructor() {}

    updateSystem() {
        this.version = this.newVersion;
        // this.cataloguesHttpService.findCache().subscribe(() => {
        //   // location.reload();
        // });
        //
        // this.locationsHttpService.findCache().subscribe(() => {
        //   // location.reload();
        // });
    }

    showLoading(): void {
        this._isLoading.set(true);
    }

    hideLoading() {
        this._isLoading.set(false);
    }

    showProcessing(): void {
        this._isProcessing.set(true);
    }

    hideProcessing() {
        this._isProcessing.set(false);
    }

    get serviceUnavailable() {
        return JSON.parse(String(sessionStorage.getItem('serviceUnavailable')));
    }

    set serviceUnavailable(value: any) {
        sessionStorage.setItem('serviceUnavailable', JSON.stringify(value));
    }

    get version() {
        return JSON.parse(String(localStorage.getItem('version')));
        // return JSON.parse(String(sessionStorage.getItem('version')));
    }

    set version(value: any) {
        localStorage.setItem('version', JSON.stringify(value));
        // sessionStorage.setItem('version', JSON.stringify(value));
    }

    get newVersion() {
        return JSON.parse(String(localStorage.getItem('newVersion')));
        // return JSON.parse(String(sessionStorage.getItem('newVersion')));
    }

    set newVersion(value: any) {
        localStorage.setItem('newVersion', JSON.stringify(value));
        // sessionStorage.setItem('newVersion', JSON.stringify(value));
    }

    get higherSort() {
        return this._higherSort;
    }

    set higherSort(value: number) {
        this._higherSort = value;
    }

    get sidebarVisible() {
        return this._sidebarVisible;
    }

    set sidebarVisible(value: boolean) {
        this._sidebarVisible = value;
    }

    private async generateCryptoKey(): Promise<CryptoKey> {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(this.encryptionKey);
        return await crypto.subtle.importKey(
            'raw', // Tipo de clave
            keyData, // Datos de la clave
            { name: 'AES-GCM' }, // Algoritmo
            false, // No se puede exportar la clave generada
            ['encrypt', 'decrypt'] // Permitir encriptar y desencriptar
        );
    }

    async setEncryptedValue(key: string, newValue: any): Promise<void> {
        const cryptoKey = await this.generateCryptoKey();
        const encoder = new TextEncoder();
        const iv = crypto.getRandomValues(new Uint8Array(12));

        const oldValue = await this.getEncryptedValue(key);
        const value = { ...oldValue, ...newValue };

        const encryptedData = await crypto.subtle.encrypt(
            {
                name: 'AES-GCM',
                iv
            },
            cryptoKey,
            encoder.encode(JSON.stringify(value))
        );

        const dataToStore = {
            iv: this.arrayBufferToBase64(iv.buffer),
            value: this.arrayBufferToBase64(new Uint8Array(encryptedData).buffer)
        };

        sessionStorage.setItem(key, JSON.stringify(dataToStore));
    }

    async getEncryptedValue(key: string | null): Promise<any> {
        if (!key) {
            return null;
        }

        const item = sessionStorage.getItem(key);

        if (!item) return null; // Si no hay datos, retornar null

        const { iv, value } = JSON.parse(item);
        const ivBytes = this.base64ToArrayBuffer(iv);
        const encryptedDataBytes = this.base64ToArrayBuffer(value);

        const cryptoKey = await this.generateCryptoKey();

        const decryptedData = await crypto.subtle.decrypt(
            {
                name: 'AES-GCM',
                iv: ivBytes
            },
            cryptoKey,
            encryptedDataBytes
        );

        const decoder = new TextDecoder();

        return JSON.parse(decoder.decode(decryptedData));
    }

    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
        return window.btoa(binary);
    }

    private base64ToArrayBuffer(base64: string): ArrayBuffer {
        const binary = window.atob(base64);
        const buffer = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            buffer[i] = binary.charCodeAt(i);
        }
        return buffer.buffer;
    }
}
