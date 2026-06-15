import type { RequestHandler } from 'express';

import {
  getMetricsRouteLabel,
  httpRequestDurationSeconds,
  httpRequestsTotal,
  shouldSkipMetricsPath,
} from '@/lib/metrics';

export const metrics: RequestHandler = (req, res, next) => {
  if (shouldSkipMetricsPath(req.path)) {
    next();
    return;
  }

  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;
    const labels = {
      method: req.method,
      route: getMetricsRouteLabel(req),
      status_code: String(res.statusCode),
    };

    httpRequestsTotal.inc(labels);
    httpRequestDurationSeconds.observe(labels, durationSeconds);
  });

  next();
};
