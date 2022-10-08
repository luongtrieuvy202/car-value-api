import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authenticate System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'sasdf1luodvy5asd@gmail.com', password: 'luongtrieuvy5' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(email).toEqual('sasdf1luodvy5asd@gmail.com');
        expect(id).toBeDefined();
      });
  });
});
