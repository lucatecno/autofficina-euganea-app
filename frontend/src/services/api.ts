import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Vehicle, Service, Booking, VehicleStatus, TimeSlot, EnrichedBooking } from '../types';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';
const API_URL = `${BACKEND_URL}/api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('session_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  exchangeSession: async (sessionId: string): Promise<{ user: User; session_token: string }> => {
    const response = await api.post('/auth/session', {}, {
      headers: { 'X-Session-ID': sessionId }
    });
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  updateGDPR: async (gdpr_accepted: boolean, marketing_accepted: boolean): Promise<void> => {
    await api.put(`/auth/gdpr?gdpr_accepted=${gdpr_accepted}&marketing_accepted=${marketing_accepted}`);
  },
};

// Vehicles API
export const vehiclesAPI = {
  getAll: async (): Promise<Vehicle[]> => {
    const response = await api.get('/vehicles');
    return response.data;
  },

  create: async (vehicle: { marca: string; modello: string; targa: string; anno?: number }): Promise<Vehicle> => {
    const response = await api.post('/vehicles', vehicle);
    return response.data;
  },

  update: async (vehicleId: string, vehicle: Partial<Vehicle>): Promise<Vehicle> => {
    const response = await api.put(`/vehicles/${vehicleId}`, vehicle);
    return response.data;
  },

  delete: async (vehicleId: string): Promise<void> => {
    await api.delete(`/vehicles/${vehicleId}`);
  },
};

// Services API
export const servicesAPI = {
  getAll: async (): Promise<Service[]> => {
    const response = await api.get('/services');
    return response.data;
  },

  getById: async (serviceId: string): Promise<Service> => {
    const response = await api.get(`/services/${serviceId}`);
    return response.data;
  },
};

// Bookings API
export const bookingsAPI = {
  getAll: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings');
    return response.data;
  },

  create: async (booking: { vehicle_id: string; service_id: string; scheduled_date: string; notes?: string }): Promise<Booking> => {
    const response = await api.post('/bookings', booking);
    return response.data;
  },

  getById: async (bookingId: string): Promise<Booking> => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  cancel: async (bookingId: string): Promise<void> => {
    await api.delete(`/bookings/${bookingId}`);
  },
};

// Tracking API
export const trackingAPI = {
  getHistory: async (bookingId: string): Promise<VehicleStatus[]> => {
    const response = await api.get(`/tracking/${bookingId}`);
    return response.data;
  },

  getCurrent: async (bookingId: string): Promise<VehicleStatus | null> => {
    const response = await api.get(`/tracking/current/${bookingId}`);
    return response.data;
  },
};

// Slots API
export const slotsAPI = {
  getAvailable: async (date: string, serviceId?: string): Promise<{ date: string; slots: TimeSlot[] }> => {
    const params = new URLSearchParams({ date });
    if (serviceId) params.append('service_id', serviceId);
    const response = await api.get(`/slots?${params.toString()}`);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getAllBookings: async (status?: string, date?: string): Promise<EnrichedBooking[]> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (date) params.append('date', date);
    const response = await api.get(`/admin/bookings?${params.toString()}`);
    return response.data;
  },

  updateBooking: async (bookingId: string, update: { status?: string; admin_notes?: string; scheduled_date?: string }): Promise<Booking> => {
    const response = await api.put(`/admin/bookings/${bookingId}`, update);
    return response.data;
  },

  updateVehicleStatus: async (bookingId: string, status: string, notes?: string): Promise<VehicleStatus> => {
    const response = await api.post('/admin/tracking', { booking_id: bookingId, status, notes });
    return response.data;
  },
};

export default api;
