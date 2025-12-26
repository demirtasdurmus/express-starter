import { z } from 'zod';
import { parseWithZod } from './parse-with-zod';

describe('parseWithZod', () => {
  it('should call onSuccess with parsed data when validation passes', () => {
    const schema = z.object({
      name: z.string(),
      age: z.string().transform(Number),
    });

    const object = { name: 'John', age: '25' };
    const onSuccess = jest.fn();
    const onError = jest.fn();

    parseWithZod({
      object,
      schema,
      onError,
      onSuccess,
    });

    expect(onSuccess).toHaveBeenCalledWith({ name: 'John', age: 25 });
    expect(onError).not.toHaveBeenCalled();
  });

  it('should call onError with ZodError when validation fails', () => {
    const schema = z.object({
      name: z.string(),
      age: z.string(),
    });

    const object = { name: 'John' }; // missing age
    const onSuccess = jest.fn();
    const onError = jest.fn();

    parseWithZod({
      object,
      schema,
      onError,
      onSuccess,
    });

    expect(onError).toHaveBeenCalled();
    expect(onError.mock.calls[0][0]).toBeInstanceOf(z.ZodError);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should handle empty objects correctly', () => {
    const schema = z.object({
      name: z.string(),
    });

    const object = {};
    const onSuccess = jest.fn();
    const onError = jest.fn();

    parseWithZod({
      object,
      schema,
      onError,
      onSuccess,
    });

    expect(onError).toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
