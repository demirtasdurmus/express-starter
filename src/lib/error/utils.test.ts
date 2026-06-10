import { BadRequestError, InternalServerError } from '@/lib/error/baseError';
import { serializeError } from '@/lib/error/utils';

describe('serializeError', () => {
  it('maps body-parser JSON errors to BadRequestError', () => {
    const parseError = Object.assign(new SyntaxError('Unexpected token }'), {
      type: 'entity.parse.failed',
      status: 400,
      statusCode: 400,
      expose: true,
      body: '{\n  "name": \n}',
    });

    const error = serializeError(parseError);

    expect(error).toBeInstanceOf(BadRequestError);
    expect(error.status).toBe(400);
    expect(error.message).toBe('common.invalidJson');
    expect(error.cause).toBe(parseError);
  });

  it('maps unknown errors to InternalServerError', () => {
    const error = serializeError(new Error('boom'));

    expect(error).toBeInstanceOf(InternalServerError);
    expect(error.status).toBe(500);
    expect(error.message).toBe('boom');
  });
});
