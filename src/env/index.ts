import { developmentLikeEnvironments, env, productionLikeEnvironments } from './env';

export const isProductionLike = productionLikeEnvironments.has(env.NODE_ENV);
export const isDevelopmentLike = developmentLikeEnvironments.has(env.NODE_ENV);
export { env };
