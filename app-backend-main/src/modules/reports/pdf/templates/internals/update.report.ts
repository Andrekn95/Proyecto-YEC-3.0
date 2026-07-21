import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { defaultFooter, defaultHeader, customLayout, defaultDate } from '../layouts/layout_6';
import { format } from 'date-fns/format';
import { es } from 'date-fns/locale';

export const registerUpdate = (data: any): TDocumentDefinitions => {
  const qrData = `http://localhost:3000/api/v1/enrollment-reports/certificate`;

  const legalName =
    data.ruc.type?.code === 'natural' ? data.ruc.legalName : data.ruc.legalRepresentativeName;

  return {
    pageSize: 'A4',
    pageMargins: [40, 75, 40, 100],
    header: defaultHeader(qrData),
    footer: defaultFooter,
    content: [
      {
        text: 'ACTA DE NOTIFICACIÓN ACTUALIZACIÓN POR CAMBIO DE DIRECCIÓN - ALOJAMIENTO',
        style: 'title',
      },
      {
        text: 'MINISTERIO DE TURISMO DEL ECUADOR',
        style: 'label',
      },
      {
        text: `${data.province.name} - ${data.canton.name}, ${format(data.registeredAt, 'yyyy-MM-dd')}`,
        style: 'date',
      },
      {
        text: 'Señor/a.',
        style: 'small',
        margin: [0, 0, 0, 10],
      },
      {
        text: legalName,
        bold: true,
        style: 'small',
        margin: [0, 0, 0, 10],
      },
      {
        text: [
          'En la ciudad de ',
          { text: data.canton.name, bold: true },
          ', a los ',
          {
            text: `${format(data.registeredAt, 'd')} días del mes ${format(data.registeredAt, 'MMMM', { locale: es })} del año ${format(data.registeredAt, 'yyyy')}`,
            bold: true,
          },
          ', la ',
          { text: `DIRECCION ZONAL  - ${data.zone.acronym}`, bold: true },
          ', representado por el funcionario ',
          { text: data.internalUser?.name, bold: true },
          ', en su calidad de Técnico Zonal; y, el señor(a) ',
          { text: data.ruc.legalName, bold: true },
          ' en su calidad de propietario o representante legal del establecimiento ',
          { text: data.establishment.tradeName, bold: true },
          ', de manera libre y voluntaria suscriben la presente ',
          { text: 'Acta de Suspensión Temporal', bold: true },
          ' del establecimiento con la siguiente información:',
        ],
        style: 'small',
        margin: [0, 0, 0, 10],
      },
      {
        text: 'INFORMACIÓN DEL ESTABLECIMIENTO',
        style: 'tableTitle',
      },
      {
        table: {
          widths: ['45%', '55%'],
          body: [
            [
              { text: 'Número de Establecimiento:', style: 'tableSubtitle' },
              { text: data.establishment.number, style: 'defaultText' },
            ],
            [
              { text: 'R.U.C.:', style: 'tableSubtitle' },
              { text: data.ruc.number, style: 'defaultText' },
            ],
            [
              { text: 'Razón Social:', style: 'tableSubtitle' },
              { text: data.ruc.legalName, style: 'defaultText' },
            ],
            [
              { text: 'Nombre Comercial:', style: 'tableSubtitle' },
              { text: data.establishment.tradeName, style: 'defaultText' },
            ],
            [
              { text: 'Actividad:', style: 'tableSubtitle' },
              { text: data.activity?.name, style: 'defaultText' },
            ],
            [
              { text: 'Clasificaión:', style: 'tableSubtitle' },
              { text: data.classification?.name, style: 'defaultText' },
            ],
            [
              { text: 'Representante Legal/Propietario:', style: 'tableSubtitle' },
              { text: data.ruc.legalName, style: 'defaultText' },
            ],
            [
              { text: 'Número de Registro:', style: 'tableSubtitle' },
              { text: data.cadastre.registerNumber, style: 'defaultText' },
            ],
            [
              { text: 'Dirección:', style: 'tableSubtitle' },
              {
                text: `${data.province.name}, ${data.canton.name}, ${data.parish.name}, ${data.establishmentAddress.mainStreet}, ${data.establishmentAddress.numberStreet}, ${data.establishmentAddress.secondaryStreet}, ${data.establishmentAddress.referenceStreet}`,
                style: 'defaultText',
              }, //
            ],
            [
              { text: 'Correo Electrónico:', style: 'tableSubtitle' },
              {
                text: data.cadastre.process.establishmentContactPerson.email,
                style: 'defaultText',
              },
            ],
          ],
        },
        layout: customLayout,

        margin: [0, 0, 0, 10],
      },
      {
        text: 'Posterior a la inspección se ha verificado lo siguiente:',
        style: 'small',
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          widths: ['30%', '35%', '35%'],
          body: [
            [
              { text: '', style: 'tableSubtitletow' },
              { text: 'Cumple', style: 'tableSubtitletow' },
              { text: 'No Cumple', style: 'tableSubtitletow' },
            ],
            [
              { text: 'Normativa', style: 'defaultText' },
              { text: '', style: 'defaultText' },
              { text: '', style: 'defaultText' },
            ],
            [
              { text: 'Dirección declarada', style: 'defaultText' },
              { text: '', style: 'defaultText' },
              { text: '', style: 'defaultText' },
            ],
          ],
        },
        layout: customLayout,

        margin: [0, 0, 0, 10],
      },
      {
        text: 'En caso de no cumplir con la normativa declarada al inicio de sus actividades turísticas, el prestador de servicios se compromete a realizar el trámite correspondiente de reclasificación y/o recategorización, de lo contrario la Autoridad Nacional de Turismo, procederá conforme lo dispuesto en la normativa vigente.',
        style: 'small',
        margin: [0, 0, 0, 10],
      },
      {
        table: {
          widths: ['50%', '50%'],
          body: [
            [{ text: 'Observaciones:', colSpan: 2, style: 'subtitle', margin: [0, 5, 0, 5] }, {}],
            [{ text: '', colSpan: 2, margin: [0, 10, 0, 10] }, {}],
            [
              { text: 'Técnico Zonal:', style: 'subtitle' },
              { text: 'Propietario/Gerente/Administrador:', style: 'subtitle' },
            ],
            [
              { text: 'Firma:', style: 'defaultText', margin: [0, 15, 0, 15] },
              { text: 'Firma:', style: 'defaultText', margin: [0, 15, 0, 15] },
            ],
            [
              { text: data.internalUser?.name, style: 'defaultText' },
              { text: 'Nombre:', style: 'defaultText' },
            ],
            [
              { text: `C.I. ${data.internalUser?.identification}`, style: 'defaultText' },
              { text: 'Documento de Identidad:', style: 'defaultText' },
            ],
            [
              { text: `DIRECCION ZONAL: ${data.zone.acronym}`, style: 'defaultText' },
              { text: 'Fecha y Hora:', style: 'defaultText' },
            ],
          ],
        },
        layout: {
          hLineColor: () => '#D1D1D1',
          vLineColor: () => '#D1D1D1', //FFFFFF
          paddingTop: () => 2,
          paddingBottom: () => 2,
        },
        margin: [0, 10, 0, 10],
      },
    ],

    styles: {
      title: {
        fontSize: 13,
        bold: true,
        alignment: 'center',
        margin: [123, 0, 123, 5],
      },
      label: {
        alignment: 'center',
        fontSize: 9,
        margin: [0, 0, 0, 5],
      },
      date: {
        fontSize: 7,
        alignment: 'right',
        margin: [0, 5, 0, 5],
      },
      small: {
        fontSize: 7,
        alignment: 'justify',
      },
      tableTitle: {
        alignment: 'center',
        fontSize: 12,
        margin: [0, 0, 0, 5],
      },
      tableSubtitle: {
        fontSize: 8,
        bold: true,
      },
      tableSubtitletow: {
        fontSize: 8,
        bold: true,
        fillColor: '#D1D1D1',
        //color: '#000000',      // texto negro
        alignment: 'center',
      },
      /* tableHeader: {
                fontSize: 20,
                alignment: 'center',
                //color: '#444',
                fillColor: '#D1D1D1',
                margin: [0, 0, 0, 4],
            }, */
      subtitle: {
        fontSize: 8,
        bold: true,
        //color: '#000000',      // texto negro
        //alignment: 'left',
      },
      defaultText: {
        fontSize: 8,
      },
    },
  };
};
