import request from 'supertest';
import { app } from '../src/app';

describe('Health Routes', () => {
  describe('GET /health', () => {
    it('should return health status with timestamp and version', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.payload).toHaveProperty('timestamp');
      expect(response.body.payload).toHaveProperty('version');
      expect(typeof response.body.payload.timestamp).toBe('string');
      expect(typeof response.body.payload.version).toBe('string');
    });

    it('should return a valid ISO timestamp', async () => {
      const response = await request(app).get('/health');
      const timestamp = response.body.payload.timestamp;

      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(() => new Date(timestamp)).not.toThrow();
      expect(new Date(timestamp).toISOString()).toBe(timestamp);
    });
  });
});
