import { NextResponse } from 'next/server';
import { backendPost, BackendError } from '@/lib/backend-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, role } = body;

    // Call backend register endpoint (Prisma user creation)
    const regResult: any = await backendPost('/api/auth/register', {
      name,
      email,
      password,
      phone: phone || undefined,
      role: role || 'CUSTOMER',
    });

    const user = regResult?.data || regResult?.user;

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
