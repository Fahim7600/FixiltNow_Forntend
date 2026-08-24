import { NextResponse } from 'next/server';
import { backendPatch, BackendError } from '@/lib/backend-client';

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params;
    const { id } = params;
    const body = await request.json();

    const data = await backendPatch(`/api/technician/bookings/${id}`, body);
    return NextResponse.json(data);
  } catch (error: any) {
    if (error instanceof BackendError) {
      return NextResponse.json(
        { success: false, message: error.message, errorDetails: error.errorDetails },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Internal server error while updating booking status.' },
      { status: 500 }
    );
  }
}
