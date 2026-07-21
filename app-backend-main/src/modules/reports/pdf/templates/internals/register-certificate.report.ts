import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { customLayout } from '@modules/reports/pdf/templates/layouts/layout_1';
import { title } from 'process';
import { format } from 'date-fns';

export const registerCertificateReport = (data: any): TDocumentDefinitions => {
  const qr = 'http://localhost:4200';

  return {
    pageOrientation: 'portrait',
    pageMargins: [30, 140, 30, 40],
    pageSize: 'A4',

    content: [
      // Sección principal con logo y QR centrados horizontalmente
      {
        columns: [
          {
            width: '*', // Ocupa el espacio disponible a la izquierda
            text: '',
          },
          {
            width: 160, // Ancho para el logo
            stack: [
              {
                image: `./storage/resources/reports/images/${data.classification.code}.png`,
                alignment: 'center',
              },
            ],
          },
          {
            width: 60, // Separación entre logo y QR
            text: '',
          },
          {
            width: 180, // Ancho para el QR y textos
            stack: [
              {
                text: data.classification.name,
                style: 'title',
              },
              {
                text: data.category.name,
                style: 'title', // Reducido a 16 para mejor jerarquía
                bold: false, // Sin negrita para diferenciarlo
                margin: [0, 5, 0, 10], // Más espacio superior e inferior
              },
              {
                qr,
                fit: 80, // Ajuste automático del QR
                alignment: 'center', // Centrado del QR
                margin: [0, 0, 0, 0], // Sin margen inferior para mejor alineación
              },
            ],
          },
          {
            width: '*', // Ocupa el espacio disponible a la derecha
            text: '',
          },
        ],
        margin: [0, 40, 0, 30],
      },

      // Nombre del establecimiento centrado y destacado
      {
        text: data.establishment.tradeName,
        style: 'title',
        margin: [0, 0, 0, 30], // Más espacio inferior
      },

      {
        columns: [
          {
            width: '33%',
            text: 'Registro de Turismo:',
            style: 'small',
          },
          {
            width: '33%',
            text: data.cadastre.registerNumber,
            style: 'label',
          },
          {
            width: '34%',
            text: '',
          },
        ],
        margin: [0, 0, 0, 8],
      },

      // FILA 2: Valores de Registro y RUC
      {
        columns: [
          {
            width: '33%',
            text: 'RUC:',
            style: 'small',
          },
          {
            width: '33%',
            text: data.ruc.number,
            style: 'label',
          },
          {
            width: '34%',
            text: '',
            alignment: 'center',
          },
        ],
        margin: [0, 0, 0, 15],
      },

      // FILA 3: Etiquetas geográficas
      {
        columns: [
          {
            width: '33%',
            text: 'Provincia:',
            style: 'small',
          },
          {
            width: '33%',
            text: 'Cantón:',
            style: 'small',
          },
          {
            width: '34%',
            text: 'Parroquia:',
            style: 'small',
          },
        ],
        margin: [0, 0, 0, 8],
      },

      // FILA 4: Valores geográficos
      {
        columns: [
          {
            width: '33%',
            text: data.province.name,
            style: 'label',
          },
          {
            width: '33%',
            text: data.canton.name,
            style: 'label',
          },
          {
            width: '34%',
            text: data.parish.name,
            style: 'label',
          },
        ],
      },
      {
        image: `./storage/resources/reports/signatures/${data.zone.code}.png`,
        alignment: 'center',
        marginTop: 10,
      },
      {
        stack: [
          {
            text: `DIRECTORA ZONAL - ${data.zone.acronym}`,
            style: 'firm',
          },
          {
            text: data.zone.director,
            style: 'firm',
          },
        ],
        marginBottom: 10,
      },

      {
        stack: [
          // Ubicación con código abreviado
          {
            text: `Fecha de emisión del certificaod de registro ${format(data.registeredAt, 'yyyy-MM-dd')}`,
            style: 'firm',
            bold: false,
            alignment: 'left',
            margin: [0, 0, 0, 5],
          },
          // Tabla de trámite
          {
            table: {
              widths: [60, 60],
              body: [
                // Encabezado
                [
                  {
                    text: 'Trámite',
                    style: 'tableTitle',
                  },
                  {
                    text: 'Fecha',
                    style: 'tableTitle',
                  },
                ],
                // Filas de datos
                ...[
                  {
                    tipo: data.tipoTramite || 'Actualización',
                    fecha: data.fechaTramite || '2022-11-21',
                  },
                  {
                    tipo: data.tipoTramite2 || 'Renovación',
                    fecha: data.fechaTramite2 || '2023-03-15',
                  },
                ].map((item) => [
                  {
                    text: item.tipo,
                    style: 'tableText',
                  },
                  {
                    text: item.fecha,
                    style: 'tableText',
                  },
                ]),
              ],
            },
            layout: customLayout,
          },
        ],
      },
      //-----------------------------------------------------------------------------------------------------
      //segunda pagina

      {
        text: '',
        pageBreak: 'before',
      },

      {
        stack: [
          {
            text: 'IMPORTANTE:',
            bold: true,
            margin: [6, 0, 6, 4],
          },
          {
            text: 'LAS PERSONAS NATURALES O JURÍDICAS QUE REALICEN ACTIVIDADES TURÍSTICAS, PODRÁN UTILIZAR LA DENOMINACIÓN, CLASIFICACIÓN Y CATEGORÍA OTORGADAS POR EL MINISTERIO DE TURISMO EN ESTE CERTIFICADO DE REGISTRO O EN SU RECLASIFICACIÓN.',
            margin: [6, 3, 6, 4],
          },
          {
            text: 'CUALQUIER CAMBIO DE DIRECCIÓN, PROPIETARIO O CIERRE DEL ESTABLECIMIENTO, DEBE SER COMUNICADO OBLIGATORIAMENTE AL MINISTERIO DE TURISMO, DE CONFORMIDAD AL ART. 47 DEL REGLAMENTO GENERAL DE APLICACIÓN A LA LEY DE TURISMO.',
            margin: [6, 3, 6, 4],
          },
          {
            text: [
              { text: 'ADVERTENCIA: ', bold: true },
              {
                text: 'CUALQUIER ALTERACIÓN AL TEXTO DEL PRESENTE DOCUMENTO, COMO SUPRESIONES, AÑADIDURAS, ABREVIATURAS, BORRONES, ENMIENDADURAS, ENTRE OTROS, LO INVALIDAN EN SU TOTALIDAD.',
              },
            ],
            margin: [6, 5, 0, 5],
          },
          {
            text: [
              { text: 'NOTA: ', bold: true },
              {
                text: 'El Ministerio de Turismo, es el organismo rector de la actividad turística, conforme lo establecido en la Ley de Turismo. Entre sus atribuciones y facultades se encuentran:',
              },
            ],
            margin: [6, 4, 0, 5],
          },
          {
            text: [
              { text: 'Art. 16.- ', bold: true },
              {
                text: '“Será de competencia privativa del Ministerio de Turismo, en coordinación con los organismos seccionales, la regulación a nivel nacional, la planificación, promoción internacional, facilitación, información estadística y control del turismo, así como el control de las actividades turísticas, en los términos de esta Ley”.',
              },
            ],
            margin: [6, 7, 0, 5],
          },
          {
            text: [
              { text: 'Art. 52.- ', bold: true },
              {
                text: '“Para efectos de esta Ley, se establecen los siguientes instrumentos de carácter general, para el efectivo control de la actividad turística:',
              },
            ],
            margin: [6, 7, 0, 5],
          },
          {
            ol: [
              {
                text: 'Amonestación escrita, en caso de faltas leves;',
                margin: [15, 5, 0, 0],
              },
              {
                text: 'Ubicación en la lista de empresarios incumplidos, en caso de faltas comprobadas, graves y repetidas; y,',
                margin: [15, 0, 0, 0],
              },
              {
                text: 'MULTAS, El Ministerio de Turismo impondrá las siguientes multas de manera gradual y proporcional de acuerdo a la falta cometida. Multa de USD $ 100 a USD $ 200 a quienes no proporcionen la información solicitada por el Ministerio de Turismo',
                margin: [15, 0, 0, 0],
              },
              {
                text: 'CLAUSURA, es un acto administrativo mediante el cual el Ministro de Turismo por sí o mediante delegación dispone el cierre de los establecimientos turísticos. Dictará esta medida en forma inmediata cuando se compruebe que se está ejerciendo actividades turísticas sin haber obtenido las autorizaciones a las que se refiere esta Ley. Igualmente dispondrá la clausura cuando se reincida en las causales señaladas en las letras a),b) y c) de este artículo',
                margin: [15, 0, 0, 0],
              },
            ],
            type: 'lower-alpha',
            fontSize: 7,
          },

          {
            text: 'Reglamento General de aplicación de la Ley de Turismo:',
            bold: true,
            margin: [6, 8, 0, 4],
          },
          {
            text: [
              { text: 'Art. 8.- ', bold: true },
              {
                text: '“Del control.- A través de los mecanismos determinados en este reglamento y de más normativa aplicable, el Ministerio ejercerá el control sobre el cumplimiento de las obligaciones que tienen los prestadores de servicios turísticos, como resultado de la aplicación de la Ley de Turismo y sus correspondientes reglamentos. El control será de carácter preventivo y sancionador de conformidad con lo dispuesto en el artículo 52 de la Ley de Turismo”.',
              },
            ],
            margin: [6, 5, 0, 5],
          },
          {
            text: [
              { text: 'Art. 47.- “Obligación del Registro Único de Turismo.-', bold: true },
              {
                text: '(Sustituido por el Art. 13, Cap. I, Título II del D.E. 333, R.O. 600-3S, 15-VII-2024).- Toda persona natural o jurídica, previo al inicio de cualquiera de las actividades turísticas determinadas en el artículo 5 de la Ley de Turismo, deberá obtener el registro de turismo, que consiste en la inscripción del prestador de servicios turísticos en el catastro de establecimientos turísticos, ante la Autoridad Nacional de Turismo o ante el Gobierno Autónomo Descentralizado al que se le haya conferido dicha atribución.',
              },
            ],
            margin: [6, 5, 0, 5],
          },
          {
            text: 'El registro de turismo se efectuará por una sola vez; y, el prestador de servicios turísticos tendrá. la obligación de actualizar cualquier cambio que se produzca en la declaración de la información consignada al momento de obtener el registro. De no cumplirse con la respectiva actualización de la información que corresponda dentro de los 15 días, verificada a través de la gestión de control en el establecimiento o por cualquier otro medio, se aplicarán las multas dispuestas en la Ley de Turismo.',
            margin: [6, 4, 0, 4],
          },
          {
            text: 'En el caso de reincidencia, la multa podrá duplicarse si no se ha actualizado la información en el término de tres días, contados a partir de la notificación realizada en la gestión de control. En el caso de que se realicen cualquiera de las actividades turísticas sin contar con el registro de turismo, se aplicará la multa de acuerdo a lo dispuesto en la Ley de Turismo, y se procederá a la clausura del establecimiento hasta que se obtenga el registro y licencia única anual de funcionamiento.',
            margin: [6, 4, 0, 4],
          },
          {
            text: 'La Autoridad Nacional de Turismo consolidará y administrará el catastro turístico nacional, aun cuando los trámites de acreditación como el registro de turismo pueda ser desconcentrado o descentralizado.',
            margin: [6, 4, 0, 4],
          },
          {
            text: 'El registro de turismo al ser una autorización conferida a una persona natural o jurídica previo al inicio de sus actividades turísticas no constituye ni podrá ser considerado para ningún fin como un título transferible”.',
            margin: [6, 4, 0, 4],
          },
        ],
        alignment: 'justify',
        fontSize: 9,
      },

      //-----------------------------------------------------------------------------------------------------
      // Tercera página - Portada trasera
      {
        text: '',
        pageBreak: 'before',
        pageOrientation: 'landscape',
      },
      {
        columns: [
          {
            width: '100%',
            stack: [
              {
                text: `${data.classification.name}`,
                style: 'imageTitle',
                margin: [0, 0, 0, 5],
              },
              {
                canvas: [
                  {
                    type: 'line',
                    x1: 100,
                    y1: 0,
                    x2: 700,
                    y2: 0,
                    lineWidth: 1,
                    lineColor: '#666666',
                  },
                ],
                margin: [0, 0, 0, 10],
              },
              {
                text: data.establishment.tradeName,
                style: 'imageSubtitle',
              },
              {
                columns: [
                  {
                    width: '100%',
                    columns: [
                      {
                        image: `./storage/resources/reports/images/${data.classification.code}.png`,
                        width: 150,
                        height: 150,
                      },
                      {
                        stack: [
                          {
                            qr,
                            alignment: 'center',
                            fit: 125,
                            marginBottom: 10,
                          },
                          {
                            text: 'Categoría',
                            style: 'value',
                            marginBottom: 10,
                          },
                          {
                            canvas: [
                              {
                                type: 'line',
                                x1: 40,
                                y1: 0,
                                x2: 400,
                                y2: 0,
                                lineWidth: 1,
                                lineColor: '#666666',
                              },
                            ],
                            margin: [0, 0, 0, 10],
                          },
                          {
                            text: data.category.name,
                            style: 'imageTitle',
                            marginBottom: 10,
                          },
                        ],
                        margin: [0, 0, 0, 0],
                      },
                    ],
                  },
                ],
                margin: [180, 20, 0, 0],
              },
            ],
          },
        ],
        margin: [0, 0, 0, 0],
      },
    ],

    background: (currentPage: number) => {
      if (currentPage === 1) {
        return {
          image: './storage/resources/reports/layouts/background_certificate.png',
          width: 580,
          height: 810,
        };
      } else if (currentPage === 2) {
        return [
          {
            image: './storage/resources/reports/layouts/header.png', // Imagen superior
            width: 555,
            alignment: 'center',
            margin: [0, 15, 0, 0],
          },
          {
            image: './storage/resources/reports/layouts/footer.png', // Imagen inferior
            width: 555,
            alignment: 'center',
            margin: [0, 650, 0, 0],
          },
        ];
      } else if (currentPage === 3) {
        return {
          image: './storage/resources/reports/layouts/background_certificate_2.png',
          width: 800,
          alignment: 'center',
          margin: [0, 0, 0, 0],
          //height: 842
        };
      }
      return null;
    },

    styles: {
      title: {
        fontSize: 19,
        bold: true,
        color: '#718096',
        alignment: 'center',
      },
      small: {
        fontSize: 8,
        bold: true,
        color: '#718096',
      },
      label: {
        fontSize: 10,
        color: '#718096',
      },
      firm: {
        fontSize: 9,
        bold: true,
        color: '#718096',
        alignment: 'center',
      },
      tableTitle: {
        fontSize: 8,
        bold: true,
        color: '#718096',
      },
      tableText: {
        fontSize: 8,
        color: '#718096',
      },
      imageTitle: {
        fontSize: 25,
        bold: true,
        alignment: 'center',
        color: '#0071BC',
      },
      imageSubtitle: {
        alignment: 'center',
        fontSize: 20,
      },
      value: {
        fontSize: 20,
        alignment: 'center',
      },
    },
  };
};
