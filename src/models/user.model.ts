import {User} from '@loopback/authentication-jwt';
import {model, property} from '@loopback/repository';

@model()
export class UserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}
