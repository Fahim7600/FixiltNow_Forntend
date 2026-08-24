import { getAuthToken } from './auth-cookie';

export class BackendError extends Error {
  public statusCode: number;
  public success: boolean;
  public errorDetails?: unknown;

  constructor(message: string, statusCode = 500, errorDetails?: unknown) {
    super(message);
    this.name = 'BackendError';
    this.statusCode = statusCode;
    this.success = false;
    this.errorDetails = errorDetails;
  }
}

function getBackendApiUrl(): string {
  const url = process.env.BACKEND_API_URL;
  if (!url) {
    throw new BackendError('BACKEND_API_URL is not configured in environment variables.', 500);
  }
  return url.replace(/\/+$/, '');
}

/**
 * Core server-to-server fetch wrapper for Backend-for-Frontend (BFF) proxy pattern.
 * Used exclusively inside Next.js Route Handlers.
 */
export async function backendFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBackendApiUrl();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const fullUrl = `${baseUrl}${normalizedPath}`;

  const headers = new Headers(options.headers || {});

  // Attach Content-Type if body present and not already set
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  // Automatically attach JWT token from httpOnly cookie if not already set
  if (!headers.has('Authorization')) {
    try {
      const token = await getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    } catch {
      // If called outside request context, proceed without cookie token
    }
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  let responseData: any;
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.includes('application/json')) {
    try {
      responseData = await response.json();
    } catch {
      responseData = null;
    }
  } else {
    responseData = await response.text();
  }

  if (!response.ok) {
    const message =
      typeof responseData === 'object' && responseData?.message
        ? responseData.message
        : `Backend request failed with status ${response.status}`;
    const errorDetails =
      typeof responseData === 'object' ? responseData.errorDetails || responseData.error : responseData;

    throw new BackendError(message, response.status, errorDetails);
  }

  // Handle case where HTTP is 200 OK but backend returned success: false payload
  if (typeof responseData === 'object' && responseData !== null && responseData.success === false) {
    throw new BackendError(
      responseData.message || 'Backend operation unsuccessful',
      response.status,
      responseData.errorDetails
    );
  }

  return responseData as T;
}

export async function backendGet<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  return backendFetch<T>(path, { ...options, method: 'GET' });
}

export async function backendPost<T = unknown>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
  return backendFetch<T>(path, {
    ...options,
    method: 'POST',
    body: body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
}

export async function backendPatch<T = unknown>(path: string, body?: unknown, options?: RequestInit): Promise<T> {
  return backendFetch<T>(path, {
    ...options,
    method: 'PATCH',
    body: body !== undefined ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
}

export async function backendDelete<T = unknown>(path: string, options?: RequestInit): Promise<T> {
  return backendFetch<T>(path, { ...options, method: 'DELETE' });
}
