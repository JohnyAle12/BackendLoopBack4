import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {MongoDataSource} from '../datasources';
import {Productimage, ProductimageRelations, Product} from '../models';
import {ProductRepository} from './product.repository';

export class ProductimageRepository extends DefaultCrudRepository<
  Productimage,
  typeof Productimage.prototype.id,
  ProductimageRelations
> {

  public readonly product: BelongsToAccessor<Product, typeof Productimage.prototype.id>;

  constructor(
    @inject('datasources.mongo') dataSource: MongoDataSource, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Productimage, dataSource);
    this.product = this.createBelongsToAccessorFor('product', productRepositoryGetter,);
    this.registerInclusionResolver('product', this.product.inclusionResolver);
  }
}
