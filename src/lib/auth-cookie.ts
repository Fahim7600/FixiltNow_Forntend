import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'fixitnow_session';
export const SEVEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 7;

/**
 * Reads the httpOnly session cookie server-side.
 */
export async function getSessionToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

/**
 * Alias for getSessionToken used in backend-client.ts.
 */
export const getAuthToken = getSessionToken;

/**
 * Sets the httpOnly session cookie containing the JWT.
 */
export async function setSessionCookie(token: string, maxAge = SEVEN_DAYS_IN_SECONDS): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

/**
 * Alias for setSessionCookie.
 */
export const setAuthToken = setSessionCookie;

/**
 * Clears the httpOnly session cookie.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Alias for clearSessionCookie.
 */
export const clearAuthToken = clearSessionCookie;
