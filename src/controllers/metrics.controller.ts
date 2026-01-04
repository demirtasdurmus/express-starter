import { RequestHandler } from 'express';
import { getMetrics, getMetricsHealth } from '../utils/metrics';

/**
 * Prometheus metrics endpoint controller
 * Returns metrics in Prometheus exposition format
 */
export const getPrometheusMetrics: RequestHandler = async (_req, res) => {
  const metrics = await getMetrics();

  // Set appropriate content type for Prometheus
  res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
  res.status(200).send(metrics);
};

/**
 * Metrics health check endpoint
 * Returns information about the metrics system status
 */
export const getMetricsHealthCheck: RequestHandler = async (_req, res) => {
  const health = await getMetricsHealth();

  res.status(200).json({
    success: true,
    payload: health,
  });
};
