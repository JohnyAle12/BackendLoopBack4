import {BindingScope, injectable} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {Category, Product} from '../models';
import {CategoryRepository, ProductRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class CategoryService {
  constructor(
    @repository(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
    @repository(ProductRepository)
    private readonly productRepository: ProductRepository,
  ) { }

  create(category: Omit<Category, 'id'>) {
    return this.categoryRepository.create(category);
  }

  find(filter?: Filter<Category>) {
    return this.categoryRepository.find(filter);
  }

  async findProductsByCategory(id: string, filter?: Filter<Product>) {
    return this.categoryRepository.products(id).find(filter);
  }

  async updateById(id: string, category: Category) {
    await this.categoryRepository.updateById(id, category);
    return category;
  }

  async deleteById(id: string) {
    await this.categoryRepository.deleteById(id);
  }
}
