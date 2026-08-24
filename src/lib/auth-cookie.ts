import { cookies } from 'next/headers';

export const AUTH_COOKIE_NAME = 'auth_token';

/**
 * Gets the JWT auth token from server-side httpOnly cookie.
 */
export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

/**
 * Sets the httpOnly session cookie containing the JWT.
 */
export async function setAuthToken(token: string, maxAgeInSeconds = 60 * 60 * 24 * 7): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeInSeconds,
  });
}

/**
 * Clears the httpOnly session cookie.
 */
export async function clearAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}
