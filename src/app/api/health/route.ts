import { NextResponse } from 'next/server';
import { backendGet, BackendError } from '@/lib/backend-client';

export async function GET() {
  try {
    const data = await backendGet('/api/health');
    return NextResponse.json(data);
  } catch (error) {
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
        message: 'Internal server error while connecting to backend',
      },
      { status: 500 }
    );
  }
}
