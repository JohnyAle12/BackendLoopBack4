import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {Category} from '../models';
import {CategoryRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class CategoryService {
  constructor(
    @repository(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
  ) { }

  create(category: Omit<Category, 'id'>) {
    return this.categoryRepository.create(category);
  }

  find(filter?: Filter<Category>) {
    return this.categoryRepository.find(filter);
  }

  findById(id: string, filter?: FilterExcludingWhere<Category>) {
    return this.categoryRepository.findById(id, filter);
  }

  async updateById(id: string, category: Category) {
    await this.categoryRepository.updateById(id, category);
  }

  async deleteById(id: string) {
    await this.categoryRepository.deleteById(id);
  }
}
