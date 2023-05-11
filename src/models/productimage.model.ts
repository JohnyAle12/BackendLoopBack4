import {Entity, belongsTo, model, property} from '@loopback/repository';
import {Product} from './product.model';

@model()
export class Productimage extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  image: string;

  @belongsTo(() => Product)
  productId: string;

  constructor(data?: Partial<Productimage>) {
    super(data);
  }
}

export interface ProductimageRelations {
  // describe navigational properties here
}

export type ProductimageWithRelations = Productimage & ProductimageRelations;
