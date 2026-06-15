import request from 'supertest';

import { app } from '@/app';

import { V1_BASE_URL } from './v1/constants';

const HTTP_REQUESTS_TOTAL_LABELS =
  /http_requests_total\{[^}]*method="GET"[^}]*route="\/api\/v1\/samples"[^}]*status_code="200"[^}]*\}/;

const HTTP_REQUEST_DURATION_LABELS =
  /http_request_duration_seconds_(bucket|sum|count)\{[^}]*method="GET"[^}]*route="\/api\/v1\/samples"[^}]*status_code="200"[^}]*\}/;

const UNMATCHED_ROUTE_LABELS =
  /http_requests_total\{[^}]*method="GET"[^}]*route="__unmatched__"[^}]*status_code="404"[^}]*\}/;

describe('Metrics Routes', () => {
  describe('GET /metrics', () => {
    it('should return 200 with Prometheus-compatible content type', async () => {
      const response = await request(app).get('/metrics');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toMatch(/text\/plain/);
    });

    it('should include default process metrics', async () => {
      const response = await request(app).get('/metrics');

      expect(response.text).toMatch(/process_cpu_user_seconds_total/);
    });

    it('should not record metrics for itself', async () => {
      const response = await request(app).get('/metrics');

      expect(response.text).not.toMatch(/route="\/metrics"/);
    });
  });

  describe('HTTP request metrics', () => {
    it('should record http_requests_total after an API request', async () => {
      await request(app).get(`${V1_BASE_URL}/samples`);

      const response = await request(app).get('/metrics');

      expect(response.text).toMatch(HTTP_REQUESTS_TOTAL_LABELS);
    });

    it('should record http_request_duration_seconds after an API request', async () => {
      await request(app).get(`${V1_BASE_URL}/samples`);

      const response = await request(app).get('/metrics');

      expect(response.text).toMatch(HTTP_REQUEST_DURATION_LABELS);
    });

    it('should label unmatched routes as __unmatched__', async () => {
      await request(app).get(`${V1_BASE_URL}/this-route-does-not-exist`);

      const response = await request(app).get('/metrics');

      expect(response.text).toMatch(UNMATCHED_ROUTE_LABELS);
    });
  });
});
