import { z } from 'zod';

/**
 * Parse an object with a Zod schema
 * @param object - The object to parse
 * @param schema - The Zod schema to use
 * @param onError - The function to call if the object fails to parse
 * @param onSuccess - The function to call if the object parses successfully
 */
export function parseWithZod<T>({
  object,
  schema,
  onError,
  onSuccess,
}: {
  object: Record<string, string> | NodeJS.ProcessEnv;
  schema: z.ZodSchema<T>;
  onError: (error: z.ZodError<T>) => void;
  onSuccess: (data: T) => void;
}) {
  const result = schema.safeParse(object);
  if (result.error) {
    onError(result.error);
  } else {
    onSuccess(result.data);
  }
}
