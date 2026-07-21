import {computed, Injectable, Signal, signal} from "@angular/core";
import {SignUpState, INITIAL_STATE, UserI, SecurityQuestionI} from "./sign-up.state";
import {isArray} from "chart.js/helpers";

const FORM_STATE_KEY = 'formState';

@Injectable({providedIn: 'root'})
export class SignUpStore {
    readonly formState = signal<SignUpState>(this.loadFromStorage());
    readonly formErrors = signal<Record<string, string[]>>({});

    readonly user: Signal<UserI> = computed(() => this.formState().user);
    readonly securityQuestions: Signal<SecurityQuestionI[]> = computed(() => this.formState().securityQuestions);


    updateSection<K extends keyof SignUpState>(
        section: K,
        data: Partial<SignUpState[K]>
    ) {
        if (isArray(data)) {
            this.formState.update(state => ({
                ...state,
                [section]: data
            }));
        } else {
            this.formState.update(state => ({
                ...state,
                [section]: {
                    ...state[section],
                    ...data
                }
            }));
        }
    }

    setSection<K extends keyof SignUpState>(
        section: K,
        data: SignUpState[K]
    ) {
        this.formState.update(state => ({
            ...state,
            [section]: data
        }));
    }

    private loadFromStorage(): SignUpState {
        const stored = sessionStorage.getItem(FORM_STATE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_STATE;
    }
}
