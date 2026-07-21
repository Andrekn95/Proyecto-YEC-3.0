import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {Button} from "primeng/button";
import {CareerService} from "../../career.service";
import {CustomIcons} from "@utils/icons/custom-icons";
import {TableModule} from "primeng/table";
import {CareerInterface} from "@modules/admin/work-flows/career/career.state";
import {InputText} from "primeng/inputtext";
import {InputGroup} from "primeng/inputgroup";
import {Paginator, PaginatorState} from "primeng/paginator";
import {INITIAL_PAGINATION, PaginationInterface} from "@utils/interfaces";
import {ButtonActionComponent} from "@utils/components/button-action/button-action.component";
import {ConfirmationService, MenuItem} from "primeng/api";
import {Tooltip} from "primeng/tooltip";
import {
    activateButtonAction,
    deleteButtonAction,
    editButtonAction,
    inactivationButtonAction,
    viewButtonAction
} from "@utils/components/button-action/consts";
import {Router} from "@angular/router";
import {MY_ROUTES} from "@routes";
import {debouncedSignal} from "@utils/helpers";

@Component({
    selector: 'app-career-form-list',
    imports: [
        Button,
        TableModule,
        InputText,
        InputGroup,
        Paginator,
        ButtonActionComponent,
        Tooltip
    ],
    templateUrl: './career-list.component.html'
})
export class CareerListComponent implements OnInit {
    private readonly router = inject(Router);
    protected readonly careerService = inject(CareerService);
    private readonly confirmationService = inject(ConfirmationService);
    protected readonly CustomIcons = CustomIcons;

    protected items = signal<CareerInterface[]>([]);
    protected search = signal('');
    private debouncedSearch = debouncedSignal(this.search);

    protected pagination = signal<PaginationInterface>(INITIAL_PAGINATION);
    protected buttonActions = signal<MenuItem[]>([]);
    protected isButtonActionsEnabled: boolean = false;

    constructor() {
        //Effects
        this.searching();
    }

    ngOnInit(): void {
        this.loadItems();
    }

    protected onSearchInput(event: Event): void {
        this.search.set((event.target as HTMLInputElement).value);
    }

    private searching(): void {
        effect(() => {
            const term = this.debouncedSearch();

            if (term) this.findCareers(1, term);
            else this.findCareers();
        });
    }

    private buildButtonActions(item: CareerInterface, index: number): void {
        const actions: MenuItem[] = [];

        actions.push({
            ...viewButtonAction,
            command: () => this.goToCreate()
        });

        actions.push({
            ...editButtonAction,
            command: () => this.goToEdit(item)
        });

        actions.push({
            ...deleteButtonAction,
            command: () => this.delete(item)
        });

        if (item.isEnabled) {
            actions.push({
                ...inactivationButtonAction,
                command: () => this.goToCreate()
            });
        } else {
            actions.push({
                ...activateButtonAction,
                command: () => this.goToCreate()
            });
        }

        this.buttonActions.set(actions);
    }

    private loadItems() {
        this.findCareers();
    }

    protected goToCreate() {
        this.router.navigate([MY_ROUTES.adminPages.user.form.absolute, 'new']);
    }

    private goToEdit(item: any) {
        this.router.navigate([MY_ROUTES.adminPages.user.form.absolute, item.id]);
    }

    private delete(item: CareerInterface): void {
        this.confirmationService.confirm({
            key: 'confirmdialog',
            message: '¿Está seguro de eliminar?',
            header: 'Eliminar',
            icon: CustomIcons.TRASH_SOLID,
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                text: true
            },
            acceptButtonProps: {
                label: 'Sí, Eliminar',
            },
            accept: () => {
                this.careerService.deleteCareer(item.id).subscribe({
                    next: () => {
                        this.findCareers();
                    }
                })
            },
        });
    }

    private findCareers(page = 1, search = '') {
        this.careerService.findCareers(page, search, '126ec046-d63d-4b04-8161-3a49a4802cb9').subscribe({
            next: (response) => {
                this.items.set(response.data);
                this.pagination.set(response.pagination!);
            }
        });
    }

    protected onSelect({item, index}: { item: any; index: number }) {
        this.isButtonActionsEnabled = true;
        this.buildButtonActions(item, index);
    }

    protected onPageChange(paginatorState: PaginatorState) {
        if (paginatorState?.page || paginatorState.page === 0) this.findCareers(paginatorState.page + 1);
    }
}
