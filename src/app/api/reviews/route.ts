import { NextResponse } from 'next/server';
import { backendPost, BackendError } from '@/lib/backend-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await backendPost('/api/reviews', body);
    return NextResponse.json(data);
  } catch (error: any) {
    if (error instanceof BackendError) {
      return NextResponse.json(
        { success: false, message: error.message, errorDetails: error.errorDetails },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Internal server error while submitting review.' },
      { status: 500 }
    );
  }
}
