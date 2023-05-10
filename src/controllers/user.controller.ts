import {TokenService} from '@loopback/authentication';
import {Credentials, MyUserService, TokenServiceBindings, User, UserRepository, UserServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {SchemaObject, getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {UserRequest} from '../models/user.model';

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: UserRequest,
  ): Promise<User> {
    const password = await hash(newUserRequest.password, await genSalt());
    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, 'password'),
    );

    await this.userRepository.userCredentials(savedUser.id).create({password});

    return savedUser;
  }

  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);

    return {token};
  }
}
