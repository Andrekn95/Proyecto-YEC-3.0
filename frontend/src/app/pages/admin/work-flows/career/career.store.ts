import {computed, Injectable, signal} from "@angular/core";
import {CareerState, INITIAL_STATE, SECTION_KEYS} from "./career.state";
import {pickKeys} from "@utils/helpers/pickKeys.helper";

const FORM_STATE_KEY = 'formState';

@Injectable({providedIn: 'root'})
export class CareerStore {
    readonly formState = signal<CareerState>(this.loadFromStorage());
    readonly formErrors = signal<Record<string, string[]>>({});

    readonly principalData = computed(() => this.formState().principalData);
    readonly secondaryData = computed(() => this.formState().secondaryData);


    updateSection<K extends keyof CareerState>(
        section: K,
        data: Partial<CareerState[K]>
    ) {
        const allowedKeys = SECTION_KEYS[section];
        const filtered = pickKeys(data, allowedKeys);

        this.formState.update(state => ({
            ...state,
            [section]: {
                ...state[section],
                ...filtered
            }
        }));
    }

    private loadFromStorage(): CareerState {
        const stored = sessionStorage.getItem(FORM_STATE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_STATE;
    }
}
