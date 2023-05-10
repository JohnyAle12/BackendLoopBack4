import {service} from '@loopback/core';
import {
  Filter,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
} from '@loopback/rest';
import {
  Product,
} from '../models';
import {CategoryService} from '../services';

export class CategoryProductController {
  constructor(
    @service(CategoryService) private readonly categoryService: CategoryService,
  ) { }

  @get('/categories/{id}/products', {
    responses: {
      '200': {
        description: 'Array of Category has many Product',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Product)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Product>,
  ): Promise<Product[]> {
    return this.categoryService.findProductsByCategory(id, filter);
  }
}
