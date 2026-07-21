export interface CareerState {
    principalData: PrincipalData;
    secondaryData: SecondaryData;
}

export interface PrincipalData {
    code: string;
    name: string;
    degree: string;
    acronym: string;
}

export interface SecondaryData {
    code: string;
    shortName: string;
    logo: string;
    resolutionNumber: string;
    institution: InstitutionInterface | null;
}

export interface CareerInterface {
    id: string;
    code: string;
    shortName: string;
    logo: string;
    resolutionNumber: string;
    isEnabled: boolean;
}

interface InstitutionInterface {
    code: string;
    name: string;
}

export const INITIAL_STATE: CareerState = {
    principalData: {
        code: '',
        name: '',
        degree: '',
        acronym: ''
    },

    secondaryData: {
        code: '',
        shortName: '',
        logo: '',
        resolutionNumber: '',
        institution: null
    },
};

export const PRINCIPAL_DATA_KEYS = ['code', 'name', 'degree', 'acronym'] as const satisfies (keyof PrincipalData)[];
export const SECONDARY_DATA_KEYS = ['code', 'shortName', 'logo', 'resolutionNumber'] as const satisfies (keyof SecondaryData)[];

type SectionKeysMap = {
    [K in keyof CareerState]: readonly (keyof CareerState[K])[];
};

export const SECTION_KEYS: SectionKeysMap = {
    principalData: PRINCIPAL_DATA_KEYS,
    secondaryData: SECONDARY_DATA_KEYS,
};
