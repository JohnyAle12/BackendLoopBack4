import {Client, expect} from '@loopback/testlab';
import {UberflugApplication} from '../..';
import {setupApplication} from './test-helper';

describe('CategoryController', () => {
  let app: UberflugApplication;
  let client: Client;
  const defaultUser = {
    "name": "johny prieto",
    "email": "johny1@mail.com",
    "password": "testPassword"
  }
  const defaultCategory = {
    "name": "Algodon",
    "description": "Ropa de algodon"
  }
  let token: string;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());

  });

  before(async () => {
    await client.post('/signup').send(defaultUser);
  })

  beforeEach(async () => {
    const {email, password} = defaultUser;
    const res = await client.post('/login').send({email, password});
    token = res.body.token;
  })

  after(async () => {
    await app.stop();
  });

  it('invokes POST /categories', async () => {
    const res = await client.post('/categories')
      .auth(token, {type: 'bearer'})
      .send(defaultCategory)
      .expect(200);

    expect(res.body).to.have.properties(['id', 'name', 'description']);
  });

  it('invokes GET /categories', async () => {
    const res = await client.get('/categories')
      .expect(200);

    expect(res.body[0]).to.have.properties(['id', 'name', 'description']);
  });

  it('invokes PATCH /categories', async () => {
    const {body} = await client.get('/categories')
    const {id} = body[0];

    const res = await client.patch(`/categories/${id}`)
      .auth(token, {type: 'bearer'})
      .send({
        name: 'new category name'
      })
      .expect(200);

    expect(res.body).to.have.property('name');
    expect(res.body.name).to.be.equal('new category name');
  });

  it('invokes DELETE /categories', async () => {
    const {body} = await client.get('/categories')
    const {id} = body[0];

    await client.delete(`/categories/${id}`)
      .auth(token, {type: 'bearer'})
      .send({
        name: 'new category name'
      })
      .expect(204);
  });
});
