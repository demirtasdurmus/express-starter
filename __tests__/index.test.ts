import request from 'supertest';
import { app } from '../src/app';

describe('Sample Test File: GET /', () => {
    it('should return Hello world', async () => {
        const result = 'Hello World';

        const response = await request(app).get('/api');

        expect(response.status).toEqual(200);
        expect(response.text).toEqual(result);
    });
});
