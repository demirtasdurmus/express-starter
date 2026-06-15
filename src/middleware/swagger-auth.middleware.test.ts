import type { NextFunction, Request, Response } from 'express';

import { swaggerAuth, verifySwaggerBasicAuth } from '@/middleware/swagger-auth.middleware';

jest.mock('@/env', () => ({
  env: {
    API_DOCS_USERNAME: 'docs-user',
    API_DOCS_PASSWORD: 'docs-pass',
  },
}));

function basicAuthHeader(username: string, password: string): string {
  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
}

describe('verifySwaggerBasicAuth', () => {
  const username = 'docs-user';
  const password = 'docs-pass';

  it('returns true for valid credentials', () => {
    expect(verifySwaggerBasicAuth(basicAuthHeader(username, password), username, password)).toBe(
      true,
    );
  });

  it('returns false when the Authorization header is missing', () => {
    expect(verifySwaggerBasicAuth(undefined, username, password)).toBe(false);
  });

  it('returns false for an invalid auth scheme', () => {
    expect(verifySwaggerBasicAuth('Bearer token', username, password)).toBe(false);
  });

  it('returns false for malformed Basic auth payloads', () => {
    expect(verifySwaggerBasicAuth('Basic not-base64', username, password)).toBe(false);
    expect(
      verifySwaggerBasicAuth(
        `Basic ${Buffer.from('no-colon').toString('base64')}`,
        username,
        password,
      ),
    ).toBe(false);
  });

  it('returns false for incorrect credentials', () => {
    expect(verifySwaggerBasicAuth(basicAuthHeader('wrong', password), username, password)).toBe(
      false,
    );
    expect(verifySwaggerBasicAuth(basicAuthHeader(username, 'wrong'), username, password)).toBe(
      false,
    );
  });

  it('compares credentials case-sensitively', () => {
    expect(verifySwaggerBasicAuth(basicAuthHeader('Docs-User', password), username, password)).toBe(
      false,
    );
    expect(verifySwaggerBasicAuth(basicAuthHeader(username, 'Docs-Pass'), username, password)).toBe(
      false,
    );
  });
});

describe('swaggerAuth middleware', () => {
  function createMocks(authorizationHeader?: string) {
    const req = {
      headers: authorizationHeader ? { authorization: authorizationHeader } : {},
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      end: jest.fn(),
    } as unknown as Response;
    const next = jest.fn() as NextFunction;

    return { req, res, next };
  }

  it('calls next() when credentials are valid', () => {
    const { req, res, next } = createMocks(basicAuthHeader('docs-user', 'docs-pass'));

    swaggerAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('responds with 401 and WWW-Authenticate when credentials are invalid', () => {
    const { req, res, next } = createMocks();

    swaggerAuth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.setHeader).toHaveBeenCalledWith('WWW-Authenticate', 'Basic realm="API Docs"');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.end).toHaveBeenCalled();
  });
});
