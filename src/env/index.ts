import { env } from './env';

export const isProductionLike = ['production', 'staging'].includes(env.NODE_ENV);
export const isDevelopmentLike = ['development', 'test'].includes(env.NODE_ENV);
export { env };
