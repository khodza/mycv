import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System ', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Handles a signup request', () => {
    const email = 'prostahksaa@gmail.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: '2003qwerty' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('signs up and get current user', async () => {
    const email = 'work@gmail.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'lofece' })
      .expect(201);
    const cookie = res.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
