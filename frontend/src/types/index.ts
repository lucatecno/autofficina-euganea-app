export interface User {
  user_id: string;
  email: string;
  name: string;
  picture?: string;
  phone?: string;
  created_at: string;
  gdpr_accepted: boolean;
  marketing_accepted: boolean;
}

export interface Vehicle {
  vehicle_id: string;
  user_id: string;
  marca: string;
  modello: string;
  targa: string;
  anno?: number;
  created_at: string;
}

export interface Service {
  service_id: string;
  name: string;
  description: string;
  estimated_hours: number;
  price_estimate?: number;
  category: string;
  active: boolean;
}

export interface Booking {
  booking_id: string;
  user_id: string;
  vehicle_id: string;
  service_id: string;
  scheduled_date: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled';
  notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleStatus {
  status_id: string;
  booking_id: string;
  status: 'waiting' | 'checked_in' | 'in_progress' | 'testing' | 'ready' | 'delivered';
  notes?: string;
  updated_by?: string;
  created_at: string;
}

export interface TimeSlot {
  time: string;
  datetime: string;
  available: boolean;
  spots_left: number;
}

export interface EnrichedBooking extends Booking {
  user?: User;
  vehicle?: Vehicle;
  service?: Service;
  current_status?: string;
}
