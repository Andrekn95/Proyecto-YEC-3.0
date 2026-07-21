import {Injectable} from '@angular/core';
import {CatalogueInterface, ModelCatalogueInterface} from '@utils/interfaces';
import {CoreEnum} from '@utils/enums';

@Injectable({
    providedIn: 'root'
})
export class CatalogueService {
    private getCatalogues(): CatalogueInterface[] {
        const catalogues = sessionStorage.getItem(CoreEnum.catalogues);

        return catalogues ? JSON.parse(catalogues) as CatalogueInterface[] : [];
    }

    private getModelCatalogues(): ModelCatalogueInterface[] {
        const modelCatalogues = sessionStorage.getItem(CoreEnum.modelCatalogues);

        return modelCatalogues ? JSON.parse(modelCatalogues) as ModelCatalogueInterface[] : [];
    }

    findByType(type: string): CatalogueInterface[] {
        const catalogues = this.getCatalogues();

        return catalogues
            .filter((c) => c.type === type)
            .map((c) => ({
                id: c.id,
                code: c.code,
                name: c.name,
                enabled: c.enabled
            }));
    }

    async findByModel(modelId: string): Promise<CatalogueInterface[]> {
        const catalogues = await this.getModelCatalogues();

        return catalogues
            .filter((c) => c.modelId === modelId)
            .map((mc) => ({
                id: mc.catalogue.id,
                code: mc.catalogue.code,
                name: mc.catalogue.name,
                enabled: mc.catalogue.enabled
            }));
    }

    async findByCode(code: string, type: string): Promise<CatalogueInterface | undefined> {
        const catalogues = await this.getCatalogues();

        return catalogues.find((c) => c.code === code && c.type === type);
    }
}
