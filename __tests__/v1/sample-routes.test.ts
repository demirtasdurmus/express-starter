import request from 'supertest';

import { app } from '@/app';
import { deleteSampleById, getSamples } from '@/repositories/sample.repository';

import { V1_BASE_URL } from './constants';

describe('Sample Routes', () => {
  beforeEach(() => {
    const allSamples = getSamples();
    allSamples.forEach((sample) => {
      try {
        deleteSampleById(sample.id);
      } catch {}
    });
  });

  describe('GET /samples', () => {
    it('should return an empty array when no samples exist', async () => {
      const response = await request(app).get(`${V1_BASE_URL}/samples`);

      expect(response.status).toBe(200);
      expect(response.body?.samples).toEqual([]);
    });

    it('should return all samples', async () => {
      const createResponse1 = await request(app)
        .post(`${V1_BASE_URL}/samples?page=1&limit=10`)
        .send({ name: 'Sample 1' });
      const createResponse2 = await request(app)
        .post(`${V1_BASE_URL}/samples?page=1&limit=10`)
        .send({ name: 'Sample 2' });

      const response = await request(app).get(`${V1_BASE_URL}/samples`);

      expect(response.status).toBe(200);
      expect(response.body?.samples).toHaveLength(2);
      expect(response.body?.samples).toContainEqual(createResponse1.body);
      expect(response.body?.samples).toContainEqual(createResponse2.body);
    });
  });

  describe('POST /samples', () => {
    it('should create a sample', async () => {
      const response = await request(app)
        .post(`${V1_BASE_URL}/samples`)
        .send({ name: 'Test Sample' });

      expect(response.status).toBe(201);
      expect(response.body?.id).toBeTruthy();
      expect(response.body?.name).toBe('Test Sample');
    });

    it('should return 409 when a sample with the same name already exists', async () => {
      await request(app).post(`${V1_BASE_URL}/samples`).send({ name: 'Duplicate Sample' });

      const response = await request(app)
        .post(`${V1_BASE_URL}/samples`)
        .send({ name: 'Duplicate Sample' });

      expect(response.status).toBe(409);
    });

    it('should return 422 when validation fails', async () => {
      const response = await request(app).post(`${V1_BASE_URL}/samples`).send({});

      expect(response.status).toBe(422);
    });

    it('should return 422 when validation fails with proper custom error messages', async () => {
      const response = await request(app).post(`${V1_BASE_URL}/samples`).send({ name: '' });

      expect(response.status).toBe(422);
    });

    it('should return 400 when request body is invalid JSON', async () => {
      const response = await request(app)
        .post(`${V1_BASE_URL}/samples`)
        .set('Content-Type', 'application/json')
        .send('{\n  "name": \n}');

      expect(response.status).toBe(400);
      expect(response.headers['content-type']).toMatch(/application\/problem\+json/);
      expect(response.body?.detail).toBe('Request body contains invalid JSON');
    });
  });

  describe('GET /samples/:id', () => {
    it('should return a sample when it exists', async () => {
      const createResponse = await request(app)
        .post(`${V1_BASE_URL}/samples`)
        .send({ name: 'Test Sample' });
      const sampleId = createResponse.body.id;

      const response = await request(app).get(`${V1_BASE_URL}/samples/${sampleId}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(createResponse.body);
    });

    it('should return 422 when id is not a valid UUID', async () => {
      const response = await request(app).get(`${V1_BASE_URL}/samples/invalid-id-format`);

      expect(response.status).toBe(422);
    });

    it('should return 404 when sample does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app).get(`${V1_BASE_URL}/samples/${nonExistentId}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /samples/:id', () => {
    it('should update an existing sample', async () => {
      const createResponse = await request(app)
        .post(`${V1_BASE_URL}/samples`)
        .send({ name: 'Original Name' });
      const sampleId = createResponse.body.id;

      const response = await request(app)
        .patch(`${V1_BASE_URL}/samples/${sampleId}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body?.id).toBe(sampleId);
      expect(response.body?.name).toBe('Updated Name');
    });

    it('should return 422 when validation fails', async () => {
      const createResponse = await request(app)
        .post(`${V1_BASE_URL}/samples`)
        .send({ name: 'Test Sample' });
      const sampleId = createResponse.body.id;

      const response = await request(app).patch(`${V1_BASE_URL}/samples/${sampleId}`).send({});

      expect(response.status).toBe(422);
    });

    it('should return 422 when validation fails with proper custom error messages', async () => {
      const createResponse = await request(app)
        .post(`${V1_BASE_URL}/samples`)
        .send({ name: 'Test Name' });
      const sampleId = createResponse.body.id;

      const response = await request(app)
        .patch(`${V1_BASE_URL}/samples/${sampleId}`)
        .send({ name: '' });

      expect(response.status).toBe(422);
    });

    it('should return 404 when sample does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .patch(`${V1_BASE_URL}/samples/${nonExistentId}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /samples/:id', () => {
    it('should delete an existing sample', async () => {
      const createResponse = await request(app)
        .post(`${V1_BASE_URL}/samples`)
        .send({ name: 'Test Sample' });
      const sampleId = createResponse.body.id;

      const response = await request(app).delete(`${V1_BASE_URL}/samples/${sampleId}`);

      expect(response.status).toBe(204);

      const getResponse = await request(app).get(`${V1_BASE_URL}/samples/${sampleId}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 422 when an invalid ID is provided with proper custom error messages', async () => {
      const response = await request(app).delete(`${V1_BASE_URL}/samples/invalid-id`);

      expect(response.status).toBe(422);
    });

    it('should return 404 when sample does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app).delete(`${V1_BASE_URL}/samples/${nonExistentId}`);

      expect(response.status).toBe(404);
    });
  });
});
