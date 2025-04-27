import { Category, ColumnSchema } from './category.model';

export interface Device {
  id: number;
  partNumber: string;
  color: string;
  category?: Category;
  isEdit?: boolean;
}

export const DeviceColumns: ColumnSchema[] = [
  {
    key: 'id',
    type: 'number',
    label: 'Identificador',
    required: false,
  },
  {
    key: 'partNumber',
    type: 'text',
    label: 'Número peça',
    required: true,
  },
  {
    key: 'color',
    type: 'text',
    label: 'Cor',
    required: true,
  },
  {
    key: 'category',
    type: 'select',
    label: 'Categoria',
    required: true,
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
    required: false,
  },
];
