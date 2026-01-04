import { register, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';

/**
 * Prometheus metrics registry and utilities
 * Provides HTTP metrics, Node.js metrics, and custom business metrics
 */

// Enable default Node.js metrics collection (memory, CPU, event loop, etc.)
collectDefaultMetrics({
  register,
  prefix: 'nodejs_',
});

/**
 * HTTP Request Metrics
 */

// Total HTTP requests counter
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

// HTTP request duration histogram
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5, 10], // Response time buckets in seconds
  registers: [register],
});

// Active HTTP connections gauge
export const httpActiveConnections = new Gauge({
  name: 'http_active_connections',
  help: 'Number of active HTTP connections',
  registers: [register],
});

/**
 * Application Metrics
 */

// Application uptime
export const appUptime = new Gauge({
  name: 'app_uptime_seconds',
  help: 'Application uptime in seconds',
  registers: [register],
});

// Update uptime metric (called periodically)
setInterval(() => {
  appUptime.set(process.uptime());
}, 10000); // Update every 10 seconds

/**
 * Custom Business Metrics
 * These can be used by controllers/services for business-specific metrics
 */

// Sample business metric - can be used by sample service
export const samplesCreated = new Counter({
  name: 'samples_created_total',
  help: 'Total number of samples created',
  registers: [register],
});

// Sample business metric - active samples
export const activeSamples = new Gauge({
  name: 'samples_active',
  help: 'Number of active samples',
  registers: [register],
});

// Export grouped metrics
export const httpMetrics = {
  httpRequestsTotal,
  httpRequestDuration,
  httpActiveConnections,
};

export const businessMetrics = {
  samplesCreated,
  activeSamples,
};

/**
 * Utility Functions
 */

// Get all metrics in Prometheus format
export function getMetrics(): Promise<string> {
  return register.metrics();
}

// Clear all metrics (useful for testing)
export function clearMetrics(): void {
  register.clear();
}

// Get metrics registry
export function getMetricsRegistry() {
  return register;
}

// Helper to increment HTTP request metrics
export function recordHttpRequest(
  method: string,
  route: string,
  statusCode: number,
  duration: number,
): void {
  const labels = { method, route, status_code: statusCode.toString() };

  httpRequestsTotal.inc(labels);
  httpRequestDuration.observe(labels, duration);
}

// Helper to track active connections
export function trackActiveConnection(delta: number): void {
  httpActiveConnections.inc(delta);
}

/**
 * Health check for metrics system
 */
export async function getMetricsHealth() {
  const metricsData = await register.getMetricsAsJSON();
  return {
    status: 'healthy',
    registeredMetrics: metricsData.length,
    defaultMetricsEnabled: true,
    uptime: process.uptime(),
  };
}
