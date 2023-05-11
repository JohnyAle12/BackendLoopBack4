import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, Request, Response} from '@loopback/rest';
import multer from 'multer';
import path from 'path';
import {v4 as uuid} from 'uuid';
import {ProductimageRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class UploadFilesService {
  constructor(
    @repository(ProductimageRepository)
    public productImageRepository: ProductimageRepository,
  ) { }

  create(productImage: {image: string, productId: string}) {
    return this.productImageRepository.create(productImage);
  }

  async uploadProductImage(request: Request, response: Response) {
    const storePath = path.join(__dirname, '../../uploads');
    const res = await this.storeFile(storePath, 'file', request, response, ['.png', '.jpg', '.jpeg', '.svg']);

    if (res) {
      const filename = response.req?.file?.filename;
      if (filename) {
        return {filename};
      }
    }

    return {
      filename: ''
    };
  }

  private storeFile(
    storePath: string,
    fieldname: string,
    request: Request,
    response: Response,
    acceptedExt: string[]
  ): Promise<object> {
    return new Promise<object>((resolve, reject) => {
      const storage = this.getStorageConfig(storePath);
      const upload = multer({
        storage: storage,
        fileFilter: this.getFileFilterConfig(acceptedExt),
        limits: {
          fileSize: 1024 * 1024
        }
      }).single(fieldname);

      upload(request, response, (err: any) => {
        if (err) {
          reject(err);
        }
        resolve(response);
      });
    });
  }

  private getStorageConfig(storePath: string) {
    return multer.diskStorage({
      destination: function (req: any, file: any, cb: any) {
        cb(null, storePath)
      },
      filename: function (req: any, file: any, cb: any) {
        const ext = path.extname(file.originalname)
        const filename = `${uuid()}${ext}`
        cb(null, filename);
      }
    });
  }

  private getFileFilterConfig(acceptedExt: string[]) {
    return (req: any, file: any, callback: any) => {
      const ext = path.extname(file.originalname);
      if (acceptedExt.includes(ext)) {
        return callback(null, true);
      }
      return callback(new HttpErrors[400]('El formato del archivo no es permitido.'));
    }
  }
}
