import { NextResponse } from 'next/server';
import { backendGet, BackendError } from '@/lib/backend-client';

export async function GET() {
  try {
    const data = await backendGet('/api/categories');
    return NextResponse.json(data);
  } catch (error: any) {
    if (error instanceof BackendError) {
      return NextResponse.json(
        { success: false, message: error.message, errorDetails: error.errorDetails },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Internal server error while fetching categories.' },
      { status: 500 }
    );
  }
}
