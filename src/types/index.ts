// Shared TypeScript types matching backend response shapes

export * from './auth';
export * from './catalog';
export * from './booking';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errorDetails?: unknown;
}
