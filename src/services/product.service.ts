import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Product} from '../models';
import {ProductRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class ProductService {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) { }

  create(product: Omit<Product, 'id'>) {
    return this.productRepository.create(product);
  }

  async updateById(id: string, product: Product) {
    await this.productRepository.updateById(id, product);
  }

  async deleteById(id: string) {
    await this.productRepository.deleteById(id);
  }
}
