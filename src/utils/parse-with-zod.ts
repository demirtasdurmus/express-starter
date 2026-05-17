import { z } from 'zod';

type TParseWithZodOptions<T> = {
  object: unknown;
  schema: z.ZodSchema<T>;
  onError: (error: z.ZodError<T>) => void;
  onSuccess: (data: T) => void;
};

/**
 * Parse an object with a Zod schema
 * @param object - The object to parse
 * @param schema - The Zod schema to use
 * @param onError - The function to call if the object fails to parse
 * @param onSuccess - The function to call if the object parses successfully
 * @returns void
 */
export function parseWithZod<T>({ object, schema, onError, onSuccess }: TParseWithZodOptions<T>) {
  const result = schema.safeParse(object);
  if (result.error) {
    onError(result.error);
  } else {
    onSuccess(result.data);
  }
}
