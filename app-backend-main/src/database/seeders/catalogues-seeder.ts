import { Injectable } from '@nestjs/common';
import { CreateCatalogueDto } from '@modules/common/catalogue/dto';
import { CataloguesService } from '@modules/common/catalogue/catalogue.service';
import {
  CatalogueEthnicOriginEnum,
  CatalogueMaritalStatusEnum,
  CatalogueStateEnum,
  CatalogueTypeEnum,
} from '@utils/enums';

@Injectable()
export class CataloguesSeeder {
  constructor(private catalogueService: CataloguesService) {}

  async run() {
    await this.createBloodTypeCatalogues();
    await this.createEthnicOriginCatalogues();
    await this.createIdentificationTypeCatalogues();
    await this.createSexCatalogues();
    await this.createGenderCatalogues();
    await this.createMaritalStatusCatalogues();
    await this.createNationalityCatalogues();
    await this.createSecurityQuestionCatalogues();
  }

  private async createBloodTypeCatalogues(): Promise<void> {
    const catalogues: CreateCatalogueDto[] = [];

    catalogues.push(
      {
        code: 'a+',
        description: 'tipo de sangre',
        name: 'A+',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_blood_type,
      },
      {
        code: 'a-',
        description: 'tipo de sangre',
        name: 'A-',
        sort: 2,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_blood_type,
      },
      {
        code: 'b+',
        description: 'tipo de sangre',
        name: 'B+',
        sort: 3,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_blood_type,
      },
      {
        code: 'b-',
        description: 'tipo de sangre',
        name: 'B-',
        sort: 4,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_blood_type,
      },
      {
        code: 'ab+',
        description: 'tipo de sangre',
        name: 'AB+',
        sort: 5,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_blood_type,
      },
      {
        code: 'ab-',
        description: 'tipo de sangre',
        name: 'AB-',
        sort: 6,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_blood_type,
      },
      {
        code: 'o+',
        description: 'tipo de sangre',
        name: 'O+',
        sort: 7,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_blood_type,
      },
      {
        code: 'o-',
        description: 'tipo de sangre',
        name: 'O-',
        sort: 8,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_blood_type,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createEthnicOriginCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];
    catalogues.push(
      {
        code: CatalogueEthnicOriginEnum.indigenous,
        description: 'etnia',
        name: 'Indígena',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_ethnic_origin,
      },
      {
        code: CatalogueEthnicOriginEnum.afro_ecuadorian,
        description: 'etnia',
        name: 'Afroecuatoriano',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_ethnic_origin,
      },
      {
        code: CatalogueEthnicOriginEnum.montubio,
        description: 'etnia',
        name: 'Montubio',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_ethnic_origin,
      },
      {
        code: CatalogueEthnicOriginEnum.half_blood,
        description: 'etnia',
        name: 'Mestizo',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_ethnic_origin,
      },
      {
        code: CatalogueEthnicOriginEnum.white,
        description: 'etnia',
        name: 'Blanco',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_ethnic_origin,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createIdentificationTypeCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];
    catalogues.push(
      {
        code: '1',
        description: 'tipo de identificacion',
        name: 'Cédula',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_identification_type,
      },
      {
        code: '2',
        description: 'tipo de identificacion',
        name: 'Pasaporte',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_identification_type,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createGenderCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];
    catalogues.push(
      {
        code: 'male',
        description: 'genero',
        name: 'Masculino',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_gender,
      },
      {
        code: 'female',
        description: 'tipo de identificacion',
        name: 'Femenino',
        sort: 2,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_gender,
      },
      {
        code: 'other',
        description: '',
        name: 'Otro',
        sort: 3,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_gender,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createMaritalStatusCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];
    catalogues.push(
      {
        code: CatalogueMaritalStatusEnum.single,
        description: 'estado civil',
        name: 'Soltero/a',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_marital_status,
      },
      {
        code: CatalogueMaritalStatusEnum.married,
        description: 'estado civil',
        name: 'Casado/a',
        sort: 2,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_marital_status,
      },
      {
        code: CatalogueMaritalStatusEnum.divorced,
        description: 'estado civil',
        name: 'Divorciado/a',
        sort: 3,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_marital_status,
      },
      {
        code: CatalogueMaritalStatusEnum.free_union,
        description: 'estado civil',
        name: 'Unión libre',
        sort: 4,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_marital_status,
      },
      {
        code: CatalogueMaritalStatusEnum.widower,
        description: 'estado civil',
        name: 'Viudo/a',
        sort: 5,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_marital_status,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createSexCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];
    catalogues.push(
      {
        code: '1',
        description: 'sexo',
        name: 'Hombre',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_sex,
      },
      {
        code: '2',
        description: 'sexo',
        name: 'Mujer',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_sex,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createNationalityCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];

    catalogues.push(
      {
        code: 'af',
        description: 'Nacionalidad',
        name: 'Afgana',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'al',
        description: 'Nacionalidad',
        name: 'Albanesa',
        sort: 2,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'dz',
        description: 'Nacionalidad',
        name: 'Argelina',
        sort: 3,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'ad',
        description: 'Nacionalidad',
        name: 'Andorrana',
        sort: 4,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'ao',
        description: 'Nacionalidad',
        name: 'Angoleña',
        sort: 5,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'ar',
        description: 'Nacionalidad',
        name: 'Argentina',
        sort: 6,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'am',
        description: 'Nacionalidad',
        name: 'Armenia',
        sort: 7,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'au',
        description: 'Nacionalidad',
        name: 'Australiana',
        sort: 8,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'at',
        description: 'Nacionalidad',
        name: 'Austriaca',
        sort: 9,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'az',
        description: 'Nacionalidad',
        name: 'Azerbaiyana',
        sort: 10,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },

      {
        code: 'bd',
        description: 'Nacionalidad',
        name: 'Bangladesí',
        sort: 11,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'be',
        description: 'Nacionalidad',
        name: 'Belga',
        sort: 12,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'bo',
        description: 'Nacionalidad',
        name: 'Boliviana',
        sort: 13,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'br',
        description: 'Nacionalidad',
        name: 'Brasileña',
        sort: 14,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'bg',
        description: 'Nacionalidad',
        name: 'Búlgara',
        sort: 15,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },

      {
        code: 'ca',
        description: 'Nacionalidad',
        name: 'Canadiense',
        sort: 16,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'cl',
        description: 'Nacionalidad',
        name: 'Chilena',
        sort: 17,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'cn',
        description: 'Nacionalidad',
        name: 'China',
        sort: 18,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'co',
        description: 'Nacionalidad',
        name: 'Colombiana',
        sort: 19,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'cr',
        description: 'Nacionalidad',
        name: 'Costarricense',
        sort: 20,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },

      {
        code: 'cu',
        description: 'Nacionalidad',
        name: 'Cubana',
        sort: 21,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'dk',
        description: 'Nacionalidad',
        name: 'Danesa',
        sort: 22,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'do',
        description: 'Nacionalidad',
        name: 'Dominicana',
        sort: 23,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'ec',
        description: 'Nacionalidad',
        name: 'Ecuatoriana',
        sort: 24,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'eg',
        description: 'Nacionalidad',
        name: 'Egipcia',
        sort: 25,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },

      {
        code: 'sv',
        description: 'Nacionalidad',
        name: 'Salvadoreña',
        sort: 26,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'es',
        description: 'Nacionalidad',
        name: 'Española',
        sort: 27,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'us',
        description: 'Nacionalidad',
        name: 'Estadounidense',
        sort: 28,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'fr',
        description: 'Nacionalidad',
        name: 'Francesa',
        sort: 29,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'de',
        description: 'Nacionalidad',
        name: 'Alemana',
        sort: 30,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },

      {
        code: 'gt',
        description: 'Nacionalidad',
        name: 'Guatemalteca',
        sort: 31,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'hn',
        description: 'Nacionalidad',
        name: 'Hondureña',
        sort: 32,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'in',
        description: 'Nacionalidad',
        name: 'India',
        sort: 33,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'id',
        description: 'Nacionalidad',
        name: 'Indonesia',
        sort: 34,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'it',
        description: 'Nacionalidad',
        name: 'Italiana',
        sort: 35,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },

      {
        code: 'jp',
        description: 'Nacionalidad',
        name: 'Japonesa',
        sort: 36,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'mx',
        description: 'Nacionalidad',
        name: 'Mexicana',
        sort: 37,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'ni',
        description: 'Nacionalidad',
        name: 'Nicaragüense',
        sort: 38,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'no',
        description: 'Nacionalidad',
        name: 'Noruega',
        sort: 39,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'pa',
        description: 'Nacionalidad',
        name: 'Panameña',
        sort: 40,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },

      {
        code: 'py',
        description: 'Nacionalidad',
        name: 'Paraguaya',
        sort: 41,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'pe',
        description: 'Nacionalidad',
        name: 'Peruana',
        sort: 42,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'pt',
        description: 'Nacionalidad',
        name: 'Portuguesa',
        sort: 43,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'gb',
        description: 'Nacionalidad',
        name: 'Británica',
        sort: 44,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'ru',
        description: 'Nacionalidad',
        name: 'Rusa',
        sort: 45,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },

      {
        code: 'se',
        description: 'Nacionalidad',
        name: 'Sueca',
        sort: 46,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'ch',
        description: 'Nacionalidad',
        name: 'Suiza',
        sort: 47,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'tr',
        description: 'Nacionalidad',
        name: 'Turca',
        sort: 48,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'ua',
        description: 'Nacionalidad',
        name: 'Ucraniana',
        sort: 49,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
      {
        code: 'uy',
        description: 'Nacionalidad',
        name: 'Uruguaya',
        sort: 50,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },

      {
        code: 've',
        description: 'Nacionalidad',
        name: 'Venezolana',
        sort: 51,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_nationality,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }

  private async createSecurityQuestionCatalogues() {
    const catalogues: CreateCatalogueDto[] = [];

    catalogues.push(
      {
        code: '1',
        description: '',
        name: '¿Cuál es el primer nombre de tu padre?',
        sort: 1,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_security_question,
      },
      {
        code: '2',
        description: '',
        name: '¿Cómo se llamaba tu mascota favorita?',
        sort: 2,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_security_question,
      },
      {
        code: '3',
        description: '',
        name: '¿Cuál es el segundo nombre de tu padre?',
        sort: 3,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_security_question,
      },
      {
        code: '4',
        description: '',
        name: '¿Cuál fue el nombre de tu mejor amigo o amiga de la infancia?',
        sort: 4,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_security_question,
      },
      {
        code: '5',
        description: '',
        name: '¿Cuál era el nombre de tu escuela primaria?',
        sort: 5,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_security_question,
      },
      {
        code: '6',
        description: '',
        name: '¿Cuál es el nombre de tu primo o prima favorita?',
        sort: 6,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_security_question,
      },
      {
        code: '7',
        description: '',
        name: '¿Cuál es el primer nombre de tu madre?',
        sort: 7,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_security_question,
      },
      {
        code: '8',
        description: '',
        name: '¿Cuál es el nombre de tu profesor favorito del colegio?',
        sort: 8,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_security_question,
      },
      {
        code: '9',
        description: '',
        name: '¿Cuál es tu número favorito?',
        sort: 9,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_security_question,
      },
      {
        code: '10',
        description: '',
        name: '¿Cuál es el segundo nombre de tu madre?',
        sort: 10,
        state: CatalogueStateEnum.enabled,
        type: CatalogueTypeEnum.users_security_question,
      },
    );

    for (const catalogue of catalogues) {
      await this.catalogueService.create(catalogue);
    }
  }
}
