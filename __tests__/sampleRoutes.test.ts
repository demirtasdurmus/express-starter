import request from 'supertest';
import { app } from '../src/app';

describe('Sample Test File: GET /', () => {
  it('should return Hello world', async () => {
    const expectedResult = 'Hello, World!';

    const response = await request(app).get('/api/samples');

    expect(response.status).toEqual(200);
    expect(response.body.success).toEqual(true);
    expect(response.body.payload.message).toEqual(expectedResult);
  });
});
