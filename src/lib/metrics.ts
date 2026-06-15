import type { Request } from 'express';
import { collectDefaultMetrics, Counter, Histogram, Registry } from 'prom-client';

import { isStaticFile } from '@/utils/is-static-file';

export const METRICS_SKIP_PATHS = ['/health', '/metrics', '/api-docs', '/__webpack_hmr'] as const;

export const UNMATCHED_ROUTE_LABEL = '__unmatched__';

const DURATION_BUCKETS = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5];

export const metricsRegistry = new Registry();

collectDefaultMetrics({ register: metricsRegistry });

export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [metricsRegistry],
});

export const httpRequestDurationSeconds = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: DURATION_BUCKETS,
  registers: [metricsRegistry],
});

export function shouldSkipMetricsPath(path: string): boolean {
  if (METRICS_SKIP_PATHS.some((skipPath) => path === skipPath || path.startsWith(`${skipPath}/`))) {
    return true;
  }

  return isStaticFile(path);
}

export function getMetricsRouteLabel(req: Request): string {
  if (!req.route?.path) {
    return UNMATCHED_ROUTE_LABEL;
  }

  const routePath = req.route.path;

  if (routePath === '/*splat') {
    return UNMATCHED_ROUTE_LABEL;
  }

  let route = `${req.baseUrl}${routePath}`;

  if (route.length > 1 && route.endsWith('/')) {
    route = route.slice(0, -1);
  }

  return route;
}
