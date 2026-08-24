export type BookingStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'DECLINED'
  | 'PAID'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface BookingService {
  id: string;
  title: string;
  price: string | number;
}

export interface BookingUserRef {
  id: string;
  name: string;
}

export interface BookingTechnicianRef {
  id: string;
  name?: string;
  user?: BookingUserRef;
}

export interface Booking {
  id: string;
  scheduledDate: string;
  status: BookingStatus;
  priceAtBooking: string | number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  service?: BookingService;
  technician?: BookingTechnicianRef;
  technicianProfile?: BookingTechnicianRef;
  customer?: BookingUserRef;
}

export interface CreateBookingInput {
  serviceId: string;
  scheduledDate: string;
  notes?: string;
}

export interface UpdateBookingStatusInput {
  id: string;
  status: 'ACCEPTED' | 'DECLINED' | 'IN_PROGRESS' | 'COMPLETED';
}
