import { apiConfig } from '@/config';
import { isStaticFile } from '@/utils/is-static-file';

export function shouldSkipPath(url: string): boolean {
  // Skip explicitly configured paths
  if (apiConfig.internalSkipPaths.some((path) => url.includes(path))) {
    return true;
  }

  // Skip static files (common static file extensions)
  return isStaticFile(url);
}
