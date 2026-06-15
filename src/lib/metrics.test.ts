import type { Request } from 'express';

import { getMetricsRouteLabel, shouldSkipMetricsPath, UNMATCHED_ROUTE_LABEL } from '@/lib/metrics';

function createRequest(overrides: Partial<Request> = {}): Request {
  return {
    method: 'GET',
    path: '/',
    baseUrl: '',
    route: undefined,
    ...overrides,
  } as Request;
}

describe('shouldSkipMetricsPath', () => {
  it.each([
    '/health',
    '/metrics',
    '/api-docs',
    '/api-docs/swagger-ui.css',
    '/__webpack_hmr',
    '/favicon.ico',
    '/assets/app.js',
  ])('returns true for %s', (path) => {
    expect(shouldSkipMetricsPath(path)).toBe(true);
  });

  it('returns false for API routes', () => {
    expect(shouldSkipMetricsPath('/api/v1/samples')).toBe(false);
  });

  it('does not skip paths that only contain a skip segment as substring', () => {
    expect(shouldSkipMetricsPath('/api/v1/health-records')).toBe(false);
  });
});

describe('getMetricsRouteLabel', () => {
  it('returns normalized route for matched Express routes', () => {
    const req = createRequest({
      baseUrl: '/api/v1',
      route: { path: '/samples' },
    });

    expect(getMetricsRouteLabel(req)).toBe('/api/v1/samples');
  });

  it('returns parameterized route patterns', () => {
    const req = createRequest({
      baseUrl: '/api/v1',
      route: { path: '/samples/:id' },
    });

    expect(getMetricsRouteLabel(req)).toBe('/api/v1/samples/:id');
  });

  it('returns __unmatched__ when req.route is unset', () => {
    const req = createRequest({ path: '/api/v1/unknown' });

    expect(getMetricsRouteLabel(req)).toBe(UNMATCHED_ROUTE_LABEL);
  });

  it('returns __unmatched__ for Express catch-all routes', () => {
    const req = createRequest({
      route: { path: '/*splat' },
    });

    expect(getMetricsRouteLabel(req)).toBe(UNMATCHED_ROUTE_LABEL);
  });

  it('strips trailing slashes from normalized routes', () => {
    const req = createRequest({
      baseUrl: '/api/v1/samples',
      route: { path: '/' },
    });

    expect(getMetricsRouteLabel(req)).toBe('/api/v1/samples');
  });
});
