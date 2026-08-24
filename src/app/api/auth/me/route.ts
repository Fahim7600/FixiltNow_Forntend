import { NextResponse } from 'next/server';
import { backendGet, BackendError } from '@/lib/backend-client';
import { getSessionToken, clearSessionCookie } from '@/lib/auth-cookie';

export async function GET() {
  try {
    const token = await getSessionToken();
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const meResult: any = await backendGet('/api/auth/me');
    const user = meResult?.data || meResult?.user || meResult;

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: any) {
    if (error instanceof BackendError) {
      if (error.statusCode === 401) {
        await clearSessionCookie();
      }
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error while fetching user profile.',
      },
      { status: 500 }
    );
  }
}
