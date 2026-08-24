import { NextResponse } from 'next/server';
import { backendDelete, BackendError } from '@/lib/backend-client';

export async function DELETE(
  _request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;

    const data = await backendDelete(`/api/technician/availability/${id}`);
    return NextResponse.json(data);
  } catch (error: any) {
    if (error instanceof BackendError) {
      return NextResponse.json(
        { success: false, message: error.message, errorDetails: error.errorDetails },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Internal server error deleting availability window.' },
      { status: 500 }
    );
  }
}
