export interface Category {
  id: number;
  name: string;
  createdAt?: string;
  isEdit?: boolean;
}

export const CategoryColumns = [
  {
    key: 'id',
    type: 'number',
    label: 'Identificador',
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
  },
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];
