import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { PaginationInterface } from '@utils/interfaces';
import { Fluid } from 'primeng/fluid';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputText } from 'primeng/inputtext';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { AppService } from '@utils/services';
import { ColInterface } from '@utils/interfaces/col.interface';
import { DatePipe } from '@angular/common';
import { debounceTime } from 'rxjs';
import { Tag } from 'primeng/tag';
import {CustomIcons} from "@utils/icons/custom-icons";
import {format} from "date-fns";

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    imports: [Button, Fluid, IconField, InputIcon, ReactiveFormsModule, TableModule, InputText, Paginator, DatePipe, Tag],
    standalone: true
})
export class ListComponent implements OnInit {
    items = input.required<any[]>();
    cols = input.required<ColInterface[]>();
    buttonActions = input.required<MenuItem[]>();
    title = input.required<string>();
    isButtonActionsEnabled = signal(false);
    pagination = input.required<PaginationInterface>();

    onCreate = output<any>();
    onEdit = output<any>();
    onDelete = output<any>();
    onSelect = output<any>();
    onSearch = output<any>();
    onPagination = output<any>();
    openButtonActions = output<any>();

    protected readonly coreService = inject(AppService);
    protected searchControl: FormControl = new FormControl(null);
    protected currentYear: string;
    protected readonly CustomIcons = CustomIcons;

    constructor() {
        this.currentYear = format(new Date(), 'yyyy');

        this.checkValueChanges();
    }

    ngOnInit() {}

    checkValueChanges() {
        this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
            this.onSearch.emit(value);
        });
    }

    selectItem(item: any, index: number) {
        this.isButtonActionsEnabled.set(true);
        this.onSelect.emit({ item, index });
    }

    create() {
        this.onCreate.emit(null);
    }

    onPageChange(event: PaginatorState) {
        if (event?.page || event.page === 0) this.onPagination.emit(event.page + 1);
    }
}
