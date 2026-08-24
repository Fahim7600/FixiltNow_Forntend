import { NextResponse } from 'next/server';
import { backendGet, BackendError } from '@/lib/backend-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const path = queryString ? `/api/services?${queryString}` : '/api/services';

    const data = await backendGet(path);
    return NextResponse.json(data);
  } catch (error: any) {
    if (error instanceof BackendError) {
      return NextResponse.json(
        { success: false, message: error.message, errorDetails: error.errorDetails },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Internal server error while fetching services.' },
      { status: 500 }
    );
  }
}
