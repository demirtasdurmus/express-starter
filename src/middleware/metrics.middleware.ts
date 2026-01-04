import { NextFunction, Request, RequestHandler, Response } from 'express';
import { recordHttpRequest, trackActiveConnection } from '../utils/metrics';
import { apiConfig } from '../config';

/**
 * Metrics collection middleware
 * Tracks HTTP requests, response times, and active connections
 */
export const metricsMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Skip metrics collection if disabled
  if (!apiConfig.metrics?.enabled) {
    return next();
  }

  // Skip metrics for certain paths
  const skipPaths = ['/metrics', '/health', '/api-docs'];
  if (skipPaths.some((path) => req.path.startsWith(path))) {
    return next();
  }

  const startTime = Date.now();

  // Track active connection
  trackActiveConnection(1);

  // Clean up connection tracking when request finishes
  const cleanup = () => {
    trackActiveConnection(-1);

    const duration = (Date.now() - startTime) / 1000; // Convert to seconds
    const method = req.method;
    const route = getRoutePattern(req);
    const statusCode = res.statusCode;

    // Record HTTP metrics
    recordHttpRequest(method, route, statusCode, duration);
  };

  // Handle both successful completion and errors
  res.on('finish', cleanup);
  res.on('close', cleanup);
  res.on('error', cleanup);

  next();
};

/**
 * Extract route pattern from request
 * Prefers the matched route pattern over the raw URL for better grouping
 */
function getRoutePattern(req: Request): string {
  // Try to get the route pattern from Express route matching
  if (req.route?.path) {
    return req.route.path;
  }

  // Fall back to the URL path, but normalize it to avoid high cardinality
  const path = req.path;

  // Replace UUIDs and numeric IDs with placeholders to reduce cardinality
  return (
    path
      .replace(
        /\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g,
        '/:id',
      )
      .replace(/\/\d+/g, '/:id')
      .replace(/\/$/, '') || '/'
  );
}
