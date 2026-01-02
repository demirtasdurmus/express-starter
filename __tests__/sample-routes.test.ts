import request from 'supertest';
import { BaseErrorIssue } from '../src/types';
import { getSamples, deleteSampleById } from '../src/services/sample.service';
import { app } from '../src/app';

describe('Sample Routes', () => {
  beforeEach(() => {
    // Clear all samples before each test for isolation
    const allSamples = getSamples();
    allSamples.forEach((sample) => {
      try {
        deleteSampleById(sample.id);
      } catch {
        // Ignore errors if sample doesn't exist
      }
    });
  });

  describe('GET /api/samples', () => {
    it('should return an empty array when no samples exist', async () => {
      const response = await request(app).get('/api/samples');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.payload.samples).toEqual([]);
    });

    it('should return all samples', async () => {
      // Create samples via API
      const createResponse1 = await request(app).post('/api/samples').send({ name: 'Sample 1' });
      const createResponse2 = await request(app).post('/api/samples').send({ name: 'Sample 2' });

      const response = await request(app).get('/api/samples');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.payload.samples).toHaveLength(2);
      expect(response.body.payload.samples).toContainEqual(createResponse1.body.payload.sample);
      expect(response.body.payload.samples).toContainEqual(createResponse2.body.payload.sample);
    });
  });

  describe('POST /api/samples', () => {
    it('should create a sample', async () => {
      const response = await request(app).post('/api/samples').send({ name: 'Test Sample' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.payload.sample).toHaveProperty('id');
      expect(response.body.payload.sample).toHaveProperty('name', 'Test Sample');
    });

    it('should return 422 when validation fails', async () => {
      const response = await request(app).post('/api/samples').send({});

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.statusCode).toBe(422);
    });

    it('should return 422 when validation fails with proper custom error messages', async () => {
      const response = await request(app).post('/api/samples').send({ name: '' });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.statusCode).toBe(422);
      expect(response.body.error.issues.map((issue: BaseErrorIssue) => issue.detail)).toContain(
        'Name is required',
      );
    });
  });

  describe('GET /api/samples/:id', () => {
    it('should return a sample when it exists', async () => {
      const createResponse = await request(app).post('/api/samples').send({ name: 'Test Sample' });
      const sampleId = createResponse.body.payload.sample.id;

      const response = await request(app).get(`/api/samples/${sampleId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.payload.sample).toEqual(createResponse.body.payload.sample);
    });

    it('should return 422 when id is not a valid UUID', async () => {
      const response = await request(app).get('/api/samples/invalid-id-format');

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.statusCode).toBe(422);
    });

    it('should return 404 when sample does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app).get(`/api/samples/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.statusCode).toBe(404);
      expect(response.body.error.message).toBe('Sample not found');
    });
  });

  describe('PATCH /api/samples/:id', () => {
    it('should update an existing sample', async () => {
      const createResponse = await request(app)
        .post('/api/samples')
        .send({ name: 'Original Name' });
      const sampleId = createResponse.body.payload.sample.id;

      const response = await request(app)
        .patch(`/api/samples/${sampleId}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.payload.sample.id).toBe(sampleId);
      expect(response.body.payload.sample.name).toBe('Updated Name');
    });

    it('should return 422 when validation fails', async () => {
      const createResponse = await request(app).post('/api/samples').send({ name: 'Test Sample' });
      const sampleId = createResponse.body.payload.sample.id;

      const response = await request(app).patch(`/api/samples/${sampleId}`).send({});

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.statusCode).toBe(422);
    });

    it('should return 422 when validation fails with proper custom error messages', async () => {
      const createResponse = await request(app).post('/api/samples').send({ name: 'Test Name' });
      const sampleId = createResponse.body.payload.sample.id;

      const response = await request(app).patch(`/api/samples/${sampleId}`).send({ name: '' });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.statusCode).toBe(422);
      expect(response.body.error.issues.map((issue: BaseErrorIssue) => issue.detail)).toContain(
        'Name is required',
      );
    });

    it('should return 404 when sample does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app)
        .patch(`/api/samples/${nonExistentId}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.statusCode).toBe(404);
      expect(response.body.error.message).toBe('Sample not found');
    });
  });

  describe('DELETE /api/samples/:id', () => {
    it('should delete an existing sample', async () => {
      const createResponse = await request(app).post('/api/samples').send({ name: 'Test Sample' });
      const sampleId = createResponse.body.payload.sample.id;

      const response = await request(app).delete(`/api/samples/${sampleId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      // Verify sample is deleted
      const getResponse = await request(app).get(`/api/samples/${sampleId}`);
      expect(getResponse.status).toBe(404);
    });

    it('should return 422 when an invalid ID is provided with proper custom error messages', async () => {
      const response = await request(app).delete(`/api/samples/invalid-id`);

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.issues.map((issue: BaseErrorIssue) => issue.detail)).toContain(
        'Invalid sample ID',
      );
    });

    it('should return 404 when sample does not exist', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      const response = await request(app).delete(`/api/samples/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error.statusCode).toBe(404);
      expect(response.body.error.message).toBe('Sample not found');
    });
  });
});
