import z from 'zod';
import 'dotenv/config';
import { parseWithZod } from '../utils/parse-with-zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  HOST: z.string().default('localhost'),
  PORT: z.coerce.number().default(8080),
  CORS_ORIGIN: z.string().optional(),
  DEFAULT_LANGUAGE: z.string().default('en'),
  SUPPORTED_LANGUAGES: z.string().default('en,tr'),
});

export type EnvType = z.infer<typeof envSchema>;

let env: EnvType;

parseWithZod({
  object: process.env,
  schema: envSchema,
  onError: (error) => {
    console.error(
      'Do you have a .env file? If not, create one by running cp .env.example .env:\n',
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
