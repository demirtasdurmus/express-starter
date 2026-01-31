import z from 'zod';
import 'dotenv/config';
import { parseWithZod } from '../utils/parse-with-zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  HOST: z.string().default('localhost'),
  PORT: z.coerce.number().default(8080),
  CORS_ORIGIN: z.string().optional(),
  TRUST_PROXY_HOPS: z
    .string()
    .optional()
    .default('1')
    .transform((val) => {
      if (val.toLowerCase() === 'true') return true;
      const parsed = Number.parseInt(val, 10);
      return Number.isNaN(parsed) ? 1 : parsed;
    }),
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
