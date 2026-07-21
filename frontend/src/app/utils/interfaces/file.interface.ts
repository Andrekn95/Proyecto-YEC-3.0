import { CatalogueInterface } from '@utils/interfaces';

export interface FileInterface {
    id?: string;
    type?: CatalogueInterface;
    code?: string;
    name?: string;
    description?: string;
    extension?: string;
    fileName?: string;
    originalName?: string;
    path?: string;
    size?: number;
}
