import { NextResponse } from 'next/server';
import { backendGet, BackendError } from '@/lib/backend-client';

export async function GET(request: Request) {
  try {
    const { search } = new URL(request.url);
    const data = await backendGet(`/api/admin/users${search}`);
    return NextResponse.json(data);
  } catch (error: any) {
    if (error instanceof BackendError) {
      return NextResponse.json(
        { success: false, message: error.message, errorDetails: error.errorDetails },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Internal server error fetching admin users.' },
      { status: 500 }
    );
  }
}
