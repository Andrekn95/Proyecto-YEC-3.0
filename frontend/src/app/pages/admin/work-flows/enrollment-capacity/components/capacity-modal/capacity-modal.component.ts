import {Component, computed, effect, inject, input, OnDestroy, OnInit, untracked} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {FieldTree, form} from '@angular/forms/signals';
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
} from '../../enrollment-capacity.state';
import {validateModalForm} from './capacity-modal.validation';

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

    protected readonly formData: FieldTree<ModalFormInterface> = this.buildForm();

    constructor() {
        this.watchClassroomChanges();
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Formulario de Capacidad',
            FORM_STATE_KEY,
            this.formData,
            this.store.modalForm()
        );
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    protected onSaveClick(): void {
        if (!this.editMode() && this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        this.store.confirmSave();
    }

    private watchClassroomChanges(): void {
        effect(() => {
            const classroomId = this.formData.classroomId().value();
            if (classroomId) {
                const classroom = this.classrooms().find(c => c.id === classroomId);
                if (classroom && classroom.capacity !== this.formData.capacity().value()) {
                    untracked(() => {
                        this.store.modalForm.update(current => ({...current, capacity: classroom.capacity}));
                    });
                }
            }
        });
    }

    private buildForm(): FieldTree<ModalFormInterface> {
        return form<ModalFormInterface>(this.store.modalForm, (schema) => {
            validateModalForm(schema);
        });
    }
}
