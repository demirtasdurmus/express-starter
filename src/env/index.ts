import z from 'zod';
import { parseWithZod } from '../utils/parse-with-zod';

/**
 * @see https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs#loading-env-files-programmatically-with-processloadenvfilepath
 */
process.loadEnvFile();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  HOST: z.string().default('localhost'),
  PORT: z.coerce.number().default(8080),
});

export type EnvType = z.infer<typeof envSchema>;

let env: EnvType;

parseWithZod({
  object: process.env,
  schema: envSchema,
  onError: (error) => {
    console.error(
      'Invalid environment variables:\n',
      error.issues.map((issue) => `-> ${issue.message}`).join('\n '),
    );
    process.exit(1);
  },
  onSuccess: (data) => {
    env = data;
  },
});

export { env };
