import { Content } from 'pdfmake/interfaces';
import { format } from 'date-fns';

export const defaultHeader = (qrText: string): Content => {
  return {
    columns: [
      {
        image: './storage/resources/reports/layouts/header.png',
        alignment: 'left',
        width: 340,
        height: 40,
        margin: [5, 20, 0, 0],
      },
      {
        qr: qrText,
        fit: 70,
        alignment: 'right',
        margin: [0, 5, 5, 0],
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
        image: './storage/resources/reports/layouts/footer.png',
        width: 550,
        marginLeft: 20,
        alignment: 'center',
      },
      {
        text: `Generados por el sistema SITURIN ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`,
        alignment: 'right',
        fontSize: 7,
        marginRight: 25,
      },
    ],
  };
};
