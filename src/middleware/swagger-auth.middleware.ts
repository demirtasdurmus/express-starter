import { timingSafeEqual } from 'node:crypto';
import type { RequestHandler } from 'express';

import { env } from '@/env';

const WWW_AUTHENTICATE = 'Basic realm="API Docs"';

export const swaggerAuth: RequestHandler = (req, res, next) => {
  if (
    verifySwaggerBasicAuth(req.headers.authorization, env.API_DOCS_USERNAME, env.API_DOCS_PASSWORD)
  ) {
    return next();
  }

  res.setHeader('WWW-Authenticate', WWW_AUTHENTICATE);
  res.status(401).end();
};

export function verifySwaggerBasicAuth(
  authorizationHeader: string | undefined,
  expectedUsername: string,
  expectedPassword: string,
): boolean {
  const credentials = parseBasicAuth(authorizationHeader);

  if (!credentials) {
    return false;
  }

  return (
    safeEqual(credentials.username, expectedUsername) &&
    safeEqual(credentials.password, expectedPassword)
  );
}

function parseBasicAuth(
  authorizationHeader: string | undefined,
): { username: string; password: string } | null {
  if (!authorizationHeader?.startsWith('Basic ')) {
    return null;
  }

  try {
    const decoded = Buffer.from(authorizationHeader.slice(6), 'base64').toString('utf8');
    const colonIndex = decoded.indexOf(':');

    if (colonIndex === -1) {
      return null;
    }

    return {
      username: decoded.slice(0, colonIndex),
      password: decoded.slice(colonIndex + 1),
    };
  } catch {
    return null;
  }
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);

  if (bufA.length !== bufB.length) {
    return false;
  }

  return timingSafeEqual(bufA, bufB);
}
