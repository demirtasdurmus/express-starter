import { Router } from 'express';
import { getPrometheusMetrics, getMetricsHealthCheck } from '../controllers/metrics.controller';

/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: Get Prometheus metrics
 *     description: Returns application metrics in Prometheus exposition format
 *     tags: [Metrics]
 *     responses:
 *       200:
 *         description: Metrics in Prometheus format
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: |
 *                 # HELP http_requests_total Total number of HTTP requests
 *                 # TYPE http_requests_total counter
 *                 http_requests_total{method="GET",route="/api/samples",status_code="200"} 42
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /metrics/health:
 *   get:
 *     summary: Get metrics system health
 *     description: Returns the health status of the metrics collection system
 *     tags: [Metrics]
 *     responses:
 *       200:
 *         description: Metrics system health status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 payload:
 *                   type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "healthy"
 *                     registeredMetrics:
 *                       type: number
 *                       example: 15
 *                     defaultMetricsEnabled:
 *                       type: boolean
 *                       example: true
 *                     uptime:
 *                       type: number
 *                       example: 3600.5
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

const router = Router();

// Prometheus metrics endpoint
router.get('/', getPrometheusMetrics);

// Metrics health endpoint
router.get('/health', getMetricsHealthCheck);

export { router as metricsRouter };
