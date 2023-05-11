import {inject, service} from '@loopback/core';
import {
  Request,
  Response,
  RestBindings,
  param,
  post,
  requestBody
} from '@loopback/rest';
import {UploadFilesService} from '../services';


export class ProductImageController {
  constructor(
    @service(UploadFilesService) private readonly filesService: UploadFilesService,
  ) { }

  @post('/product/files/{productId}', {
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
            },
          },
        },
        description: 'Upload images for product',
      },
    },
  })
  async uploadProductImage(
    @inject(RestBindings.Http.RESPONSE) response: Response,
    @requestBody.file() request: Request,
    @param.path.string('productId') productId: string,
  ): Promise<object | false> {
    const {filename} = await this.filesService.uploadProductImage(request, response)
    return this.filesService.create({
      image: filename,
      productId
    })
  }

}
