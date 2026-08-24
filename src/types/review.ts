export interface Review {
  id: string;
  bookingId: string;
  rating: number;
  comment?: string;
  createdAt?: string;
  customerName?: string;
  customer?: {
    name: string;
  };
}

export interface CreateReviewInput {
  bookingId: string;
  rating: number;
  comment?: string;
}
