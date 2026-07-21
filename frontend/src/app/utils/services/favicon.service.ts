import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class FaviconService {
    constructor(@Inject(DOCUMENT) private document: Document) {}

    setFavicon() {
        const iconUrl = environment.APP_PATH_ASSETS + '/favicon.ico';
        const head = this.document.getElementsByTagName('head')[0];
        let element: HTMLLinkElement | null = this.document.querySelector(`link[rel*='icon']`);

        if (element) {
            element.href = iconUrl;
        } else {
            // Si por alguna razón no existe, lo creamos
            element = this.document.createElement('link');
            element.rel = 'icon';
            element.type = 'image/x-icon';
            element.href = iconUrl;
            head.appendChild(element);
        }
    }
}
