import { NextResponse } from 'next/server';
import { backendPost, BackendError } from '@/lib/backend-client';
import { setSessionCookie } from '@/lib/auth-cookie';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, role } = body;

    // 1. Call backend register
    const regResult: any = await backendPost('/api/auth/register', {
      name,
      email,
      password,
      phone: phone || undefined,
      role: role || 'CUSTOMER',
    });

    let user = regResult?.data || regResult?.user;

    // 2. Auto-login after registration to retrieve JWT token and set session cookie
    try {
      const loginResult: any = await backendPost('/api/auth/login', { email, password });
      const token = loginResult?.data?.token || loginResult?.token;
      const loggedInUser = loginResult?.data?.user || loginResult?.user;

      if (token) {
        await setSessionCookie(token);
      }
      if (loggedInUser) {
        user = loggedInUser;
      }
    } catch {
      // Proceed with register user object if auto-login fails
    }

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      user,
    });
  } catch (error: any) {
    if (error instanceof BackendError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
          errorDetails: error.errorDetails,
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || 'An unexpected error occurred during registration.',
      },
      { status: 500 }
    );
  }
}
