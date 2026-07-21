import { Component, EventEmitter, inject, input, OnInit, output, signal, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { Fluid } from 'primeng/fluid';
import { ReactiveFormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { Tooltip } from 'primeng/tooltip';
import { AppService } from '@utils/services';
import { ColInterface } from '@utils/interfaces';
import { DatePipe } from '@angular/common';
import {CustomIcons} from "@utils/icons/custom-icons";


@Component({
    selector: 'app-list-basic',
    templateUrl: './list-basic.component.html',
    styleUrls: ['./list-basic.component.scss'],
    imports: [Button, Fluid, ReactiveFormsModule, TableModule, Tooltip, DatePipe],
    standalone: true
})
export class ListBasicComponent implements OnInit {
    @ViewChild('dt') dt!: Table;

    items = input.required<any[]>();
    cols = input.required<ColInterface[]>();
    buttonActions = input.required<MenuItem[]>();
    title = input.required<string>();
    isButtonActionsEnabled = signal(false);
    buttonCreated = input<boolean>(true);

    onCreate = output<any>();
    onEdit = output<any>();
    onDelete = output<any>();
    onSelect = output<any>();

    protected readonly coreService = inject(AppService);
    protected selectedItem = new EventEmitter<any>();
    protected globalFilterFields: string[] = [];

    constructor() {}

    ngOnInit(): void {
        this.globalFilterFields = this.cols().map((col) => col.field);
    }

    selectItem(item: any, index: number) {
        this.isButtonActionsEnabled.set(true);
        this.selectedItem = item;
        this.onSelect.emit({ index });
    }

    create() {
        this.onCreate.emit(null);
    }

    onGlobalFilter(event: Event) {
        const value = (event.target as HTMLInputElement).value.trim();
        this.dt.filterGlobal(value, 'contains');
    }

    protected readonly CustomIcons = CustomIcons;
}
