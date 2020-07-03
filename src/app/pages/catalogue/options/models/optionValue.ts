import { Description } from '../../../shared/models/description';

export class OptionValue {
  id?: number;
  code: string;
  order: number;
  defaultValue: boolean;
  description?: Description;
  descriptions?: Description[];
  image?: string;
  price: string;
  sortOrder?: number;
}
