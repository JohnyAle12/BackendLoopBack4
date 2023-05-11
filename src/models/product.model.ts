import {Entity, hasMany, model, property} from '@loopback/repository';
import {Category} from './category.model';
import {Productimage} from './productimage.model';

@model()
export class Product extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'string',
  })
  categoryId?: string;

  @hasMany(() => Productimage)
  productimages: Productimage[];

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
  category: Category
}

export type ProductWithRelations = Product & ProductRelations;
