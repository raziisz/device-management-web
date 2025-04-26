export interface Category {
  id: number;
  name: string;
  createdAt?: string;
  isEdit?: boolean;
}

export interface ColumnSchema {
  key: string;
  label: string;
  type: string;
  required?: boolean;
}

export const CategoryColumns: ColumnSchema[] = [
  {
    key: 'id',
    type: 'number',
    label: 'Identificador',
    required: false,
  },
  {
    key: 'name',
    type: 'text',
    label: 'Nome',
    required: true,
  },
  {
    key: 'createdAt',
    type: 'text',
    label: 'Data de criação',
    required: false,
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
    required: false,
  },
];
