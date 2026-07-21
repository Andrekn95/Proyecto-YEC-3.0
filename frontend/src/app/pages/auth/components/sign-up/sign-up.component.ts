import {Component, inject, OnInit, resource, signal, WritableSignal} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import {PasswordModule} from 'primeng/password';
import {RippleModule} from 'primeng/ripple';
import {CustomMessageService} from '@utils/services/custom-message.service';
import {AuthHttpService} from '../../auth-http.service';
import {environment} from '@env/environment';
import {DatePickerModule} from 'primeng/datepicker';
import {LabelDirective} from '@utils/directives/label.directive';
import {ErrorMessageDirective} from '@utils/directives/error-message.directive';
import {KeyFilter} from 'primeng/keyfilter';
import {MY_ROUTES} from '@routes';
import {CatalogueService} from '@utils/services/catalogue.service';
import {CatalogueTypeEnum, CoreEnum} from '@utils/enums';
import {Tooltip} from 'primeng/tooltip';
import {CustomIcons} from "@utils/icons/custom-icons";
import {AppService, CatalogueHttpService, FormRegistryService} from '@utils/services';
import {TransactionalCodeComponent} from '@utils/components/transactional-code/transactional-code.component';
import {CatalogueInterface} from '@utils/interfaces';
import {Message} from 'primeng/message';
import {AutoFocus} from 'primeng/autofocus';
import {FieldTree, form, FormField, required, SchemaPathTree, validate} from "@angular/forms/signals";
import {SignUpStore} from "@modules/auth/components/sign-up/sign-up.store";
import {signUpValidation} from "@modules/auth/components/sign-up/sign-up.validation";
import {SecurityQuestionI, UserI} from "@modules/auth/components/sign-up/sign-up.state";
import {InputGroup} from "primeng/inputgroup";
import {firstValueFrom} from "rxjs";
import {JsonPipe} from "@angular/common";

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    standalone: true,
    imports: [
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        RippleModule,
        ReactiveFormsModule,
        DatePickerModule,
        LabelDirective,
        ErrorMessageDirective,
        KeyFilter,
        Tooltip,
        TransactionalCodeComponent,
        Message,
        AutoFocus,
        FormField,
        InputGroup,
        JsonPipe
    ]
})
export default class SignUpComponent implements OnInit {
    private readonly FORM_STATE_KEY = 'user';

    private readonly formRegistryService = inject(FormRegistryService);
    private readonly formStore = inject(SignUpStore);
    protected readonly formData$: WritableSignal<UserI> = signal<UserI>(this.formStore.user());
    protected readonly formData: FieldTree<UserI> = this.buildForm;
    protected readonly securityQuestions$: WritableSignal<SecurityQuestionI[]> = signal<SecurityQuestionI[]>(this.formStore.securityQuestions());
    protected securityQuestionForms: FieldTree<SecurityQuestionI>[] = [];

    protected transactionalCodeControl = form(signal(''));

    private readonly authHttpService = inject(AuthHttpService);

    protected readonly showPasswordConfirm = signal(false);
    protected readonly showPassword = signal(false);
    protected allSecurityQuestions = signal<CatalogueInterface[]>([]);

    async ngOnInit() {
        await this.loadSecurityQuestions();
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(this.FORM_STATE_KEY);
    }

    get buildForm() {
        return form<UserI>(this.formData$, (schema) => {
            signUpValidation(schema)
        });
    }

    protected readonly environment = environment;
    protected readonly MY_ROUTES = MY_ROUTES;
    protected readonly CustomIcons = CustomIcons;

    private readonly customMessageService = inject(CustomMessageService);
    protected readonly appService = inject(AppService);
    private readonly catalogueHttpService = inject(CatalogueHttpService);
    private readonly catalogueService = inject(CatalogueService);
    private readonly router = inject(Router);

    constructor() {

    }

    protected async loadSecurityQuestions() {
        this.allSecurityQuestions.set(this.catalogueService.findByType(CatalogueTypeEnum.users_security_question));

        this.allSecurityQuestions.set([
            {id: '1', code: '1', name: 'Pregunta 1'},
            {id: '2', code: '2', name: 'Pregunta 2'},
            {id: '3', code: '3', name: 'Pregunta 3'},
            {id: '4', code: '4', name: 'Pregunta 4'},
            {id: '5', code: '5', name: 'Pregunta 5'},
            {id: '6', code: '6', name: 'Pregunta 6'},
            {id: '7', code: '7', name: 'Pregunta 7'},
            {id: '8', code: '8', name: 'Pregunta 8'},
            {id: '9', code: '9', name: 'Pregunta 9'},
            {id: '10', code: '10', name: 'Pregunta 10'},
        ]);

        this.generateSecurityQuestions();
    }

    protected generateSecurityQuestions() {
        const selectedSecurityQuestions = this.allSecurityQuestions().sort(() => Math.random() - 0.5).slice(0, 3);

        this.addQuestions(selectedSecurityQuestions)
    }

    protected addQuestions(questions: CatalogueInterface[]): void {
        const securityQuestions = questions.map(question => ({
            code: question.code!,
            question: question,
            answer: ''
        }))

        if (questions.length > 0) {
            this.formStore.updateSection('securityQuestions', securityQuestions);
            this.securityQuestions$.set(securityQuestions);
            this.securityQuestionForms = securityQuestions.map(question => {
                const questionSignal = signal(question);

                return form(questionSignal, schema => {
                    required(schema.answer, {
                        message: 'Campo obligatorio'
                    });
                });
            });

            console.log(this.securityQuestionForms);
        }
    }

    protected openTerms() {
        window.open(`${environment.APP_PATH_ASSETS}/auth/files/legal.pdf`, '_blank');
    }

    // protected watchFormChanges() {
    //     this.identificationField.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
    //         this.emailField.disable();
    //         this.rucField.reset();
    //
    //         if (this.identificationField.valid) this.findRUC(value);
    //     });
    //
    //     this.emailField.valueChanges.subscribe((value) => {
    //         this.transactionalCodeControl.reset();
    //         this.transactionalCodeControl.disable();
    //         this.passwordField.reset();
    //         this.passwordField.disable();
    //     });
    //
    //     this.transactionalCodeControl.statusChanges.subscribe((status) => {
    //         if (status === 'VALID') {
    //             this.nameField.enable();
    //             this.passwordField.enable();
    //         }
    //     });
    // }

    protected requestTransactionalCode() {
        // this.nameField.disable();
        // // this.nameField.reset();
        // this.passwordField.disable();
        // this.passwordField.reset();

        // this.transactionalCodeControl.reset();
        // this.transactionalCodeControl.disable();

        this.generateSecurityQuestions();

        this.authHttpService.requestTransactionalSignupCode(this.formData.email().value()!).subscribe({
            next: (_) => {
                // this.transactionalCodeControl.enable();
            }
        });
    }

    protected onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        const payload = this.formStore.formState();

        this.authHttpService.signUpExternal(payload).subscribe({
            next: (_) => {
                this.router.navigate([MY_ROUTES.authPages.signIn.absolute]);
            }
        });
    }

    protected togglePassword() {
        this.showPassword.update(value => !value);
    }

    protected togglePasswordConfirm() {
        this.showPasswordConfirm.update(value => !value);
    }

    protected findEmailExists(email: string): void {
        this.authHttpService.verifyEmailExist(email).subscribe(
            {
                next: (response) => {
                    console.log(response);
                }
            }
        )
    }

    // private validateForm() {
    //     const errors: string[] = [];
    //
    //     if (this.nameField.invalid) errors.push('Nombres');
    //     if (this.emailField.invalid) errors.push('Correo Electrónico');
    //     if (this.passwordField.invalid) errors.push('Contraseña');
    //     if (this.identificationField.invalid) errors.push('Identificación');
    //     if (this.termsAcceptedAtField.invalid) errors.push('Términos y Condiciones');
    //
    //     const invalidSecurityQuestions = this.securityQuestionsField.controls.some((ctrl) => ctrl.get('answer')?.invalid);
    //     if (invalidSecurityQuestions || this.securityQuestionsField.invalid) errors.push('Preguntas de seguridad');
    //
    //     if (errors.length > 0) {
    //         this.form.markAllAsTouched();
    //         this.customMessageService.showFormErrors(errors);
    //         return false;
    //     }
    //
    //     return true;
    // }
}
