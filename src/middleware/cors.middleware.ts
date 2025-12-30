import cors from 'cors';
import { apiConfig } from '../config';

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    /**
     * Allow requests with no origin (like mobile apps, curl, Postman)
     */
    if (!origin) {
      return callback(null, true);
    }

    if (
      apiConfig.cors.allowedOrigins.length === 0 ||
      apiConfig.cors.allowedOrigins.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [...apiConfig.cors.allowedHeaders],
});
