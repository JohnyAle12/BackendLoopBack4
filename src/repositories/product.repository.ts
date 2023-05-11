import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Product, ProductRelations, Productimage} from '../models';
import {ProductimageRepository} from './productimage.repository';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {

  public readonly productimages: HasManyRepositoryFactory<Productimage, typeof Product.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('ProductimageRepository') protected productimageRepositoryGetter: Getter<ProductimageRepository>,
  ) {
    super(Product, dataSource);
    this.productimages = this.createHasManyRepositoryFactoryFor('productimages', productimageRepositoryGetter,);
    this.registerInclusionResolver('productimages', this.productimages.inclusionResolver);
  }
}
