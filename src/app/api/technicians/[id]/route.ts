import { NextResponse } from 'next/server';
import { backendGet, BackendError } from '@/lib/backend-client';

export async function GET(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;

    const data = await backendGet(`/api/technicians/${id}`);
    return NextResponse.json(data);
  } catch (error: any) {
    if (error instanceof BackendError) {
      return NextResponse.json(
        { success: false, message: error.message, errorDetails: error.errorDetails },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Internal server error while fetching technician profile.' },
      { status: 500 }
    );
  }
}
