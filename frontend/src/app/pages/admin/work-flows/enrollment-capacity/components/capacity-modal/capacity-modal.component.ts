import {Component, computed, effect, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FieldTree, form} from '@angular/forms/signals';
import {FormsModule} from '@angular/forms';
import {Dialog} from 'primeng/dialog';
import {Select} from 'primeng/select';
import {ButtonModule} from 'primeng/button';
import {InputNumber} from 'primeng/inputnumber';
import {LabelDirective} from '@utils/directives/label.directive';
import {ErrorMessageDirective} from '@utils/directives/error-message.directive';
import {FormRegistryService} from '@utils/services/form-registry.service';
import {CustomMessageService} from '@utils/services';
import {EnrollmentCapacityStore} from '../../enrollment-capacity.store';
import {
    CatalogueInterface,
    ClassroomInterface,
    ModalFormInterface,
    SubjectInterface,
    INITIAL_MODAL_FORM,
} from '../../enrollment-capacity.state';
import {validateModalForm} from './capacity-modal.validation';
import {input, InputSignal} from '@angular/core';

const FORM_STATE_KEY = 'modalForm';

@Component({
    selector: 'app-capacity-modal',
    imports: [FormsModule, Dialog, Select, ButtonModule, InputNumber, LabelDirective, ErrorMessageDirective],
    templateUrl: './capacity-modal.component.html',
})
export class CapacityModalComponent implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly customMessageService = inject(CustomMessageService);
    protected readonly store = inject(EnrollmentCapacityStore);

    readonly visible = input.required<boolean>();
    readonly editMode = input.required<boolean>();
    readonly workdays = input.required<CatalogueInterface[]>();
    readonly classrooms = input.required<ClassroomInterface[]>();
    readonly subjects = input.required<SubjectInterface[]>();

      protected readonly selectedLevelName = computed(() => {
        const id = this.store.selectedSubjectId();
        if (!id) return '';
        const subject = this.subjects().find((s) => s.id === id);
        return subject?.name ?? '';
    });

    protected readonly form$: WritableSignal<ModalFormInterface> = signal({...INITIAL_MODAL_FORM});

    protected readonly formData: FieldTree<ModalFormInterface> = this.buildForm();

    constructor() {
        this.initializeData();
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Formulario de Capacidad',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    protected onClassroomChange(classroomId: string): void {
        const classroom = this.classrooms().find((c) => c.id === classroomId);
        const capacity = classroom ? classroom.capacity : this.form$().capacity;
        this.form$.update((current) => ({...current, classroomId, capacity}));
        this.store.updateModalForm({classroomId, capacity});
    }

    protected onWorkdayChange(value: string): void {
        this.form$.update(current => ({...current, workdayId: value}));
        this.store.updateModalForm({workdayId: value});
    }

    protected onCapacityChange(value: number): void {
        this.form$.update(current => ({...current, capacity: value}));
        this.store.updateModalForm({capacity: value});
    }

    protected onSaveClick(): void {
        if (!this.editMode() && this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        this.store.confirmSave();
    }

    private initializeData(): void {
        effect(() => {
            const isVisible = this.visible();
            const data = this.store.modalForm();

            if (isVisible) {
                this.form$.set(data);
            }
        });
    }

    private buildForm(): FieldTree<ModalFormInterface> {
        return form<ModalFormInterface>(this.form$, (schema) => {
            validateModalForm(schema);
        });
    }
}