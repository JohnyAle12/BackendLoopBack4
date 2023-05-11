import {Client, expect} from '@loopback/testlab';
import {UberflugApplication} from '../..';
import {defaultCategory, defaultProduct, defaultUser} from './helpers/data-fake.helper';
import {setupApplication} from './test-helper';

describe('ProductController', () => {
  let app: UberflugApplication;
  let client: Client;
  let token: string;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  before(async () => {
    await client.post('/signup').send(defaultUser);
    const {email, password} = defaultUser;
    const res = await client.post('/login').send({email, password});
    token = res.body.token;
  })

  after(async () => {
    await app.stop();
  });

  it('invokes POST /products', async () => {
    const {body} = await client.post('/categories')
      .auth(token, {type: 'bearer'})
      .send(defaultCategory)
      .expect(200);

    const data = {
      ...defaultProduct,
      categoryId: body.id
    }

    const res = await client.post('/products')
      .auth(token, {type: 'bearer'})
      .send(data)
      .expect(200);

    expect(res.body).to.have.properties(['id', 'name', 'description', 'price', 'categoryId']);
    expect(res.body.name).to.be.equal(data.name);
  });
});
