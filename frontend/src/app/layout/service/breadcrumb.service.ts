import { Injectable, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class BreadcrumbService {
    private _items = signal<MenuItem[]>([]);
    readonly items = this._items;

    setItems(items: MenuItem[]) {
        this._items.set(items);
    }
}
