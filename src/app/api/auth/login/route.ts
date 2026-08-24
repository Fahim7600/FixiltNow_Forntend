import { NextResponse } from 'next/server';
import { backendPost, BackendError } from '@/lib/backend-client';
import { setSessionCookie } from '@/lib/auth-cookie';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const loginResult: any = await backendPost('/api/auth/login', { email, password });
    const token = loginResult?.data?.token || loginResult?.token;
    const user = loginResult?.data?.user || loginResult?.user;

    if (token) {
      await setSessionCookie(token);
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
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
        message: error.message || 'An unexpected error occurred during login.',
      },
      { status: 500 }
    );
  }
}
