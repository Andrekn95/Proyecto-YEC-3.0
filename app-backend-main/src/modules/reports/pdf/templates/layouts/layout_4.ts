import { Content } from 'pdfmake/interfaces';
import { format } from 'date-fns';

export const defaultHeader = (qrText: string): Content => {
  return {
    columns: [
      {
        image: './storage/resources/reports/layouts/header.png',
        alignment: 'left',
        width: 400,
        height: 50,
        margin: [5, 20, 0, 0],
      },
      {
        qr: qrText,
        fit: 70,
        alignment: 'right',
        margin: [0, 10, 5, 0],
      },
    ],
  };
};

export const defaultDate = (): string => {
  return ` ${format(new Date(), 'yyyy-MM-dd')}`;
};

export const customLayout = {
  hLineWidth: () => 0.5,
  vLineWidth: () => 0.5,
  hLineColor: (i: number, node: any) =>
    i === 0 || i === node.table.body.length ? 'black' : '#D9D9D9',
  vLineColor: (i: number, node: any) =>
    i === 0 || i === node.table.widths?.length ? 'black' : '#D9D9D9',
};

export const defaultFooter = (): Content => {
  return {
    stack: [
      {
        text: `Generado por el sistema SITURIN ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`,
        alignment: 'right',
        fontSize: 7,
        marginRight: 25,
      },
    ],
  };
};
