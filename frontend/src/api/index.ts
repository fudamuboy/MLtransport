// API Service - Connects frontend to backend
import type { Trip, Seat, Route, Region } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper for fetch requests
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(error.error || 'Request failed');
    }

    return response.json();
}

// Routes API
export const routesAPI = {
    getAll: () => fetchAPI<Route[]>('/routes'),
    getRegions: () => fetchAPI<Region[]>('/routes/regions'),
    getByDestination: (to: string) => fetchAPI<Route>(`/routes?to=${encodeURIComponent(to)}`),
    getStops: (routeId: string) => fetchAPI<Stop[]>(`/routes/${routeId}/stops`),
};

// Stop type for API
interface Stop {
    id: string;
    routeId: string;
    name: string;
    order: number;
    isPause: boolean;
}

// Trips API
export const tripsAPI = {
    search: (params: { from?: string; to: string; date: string }) => {
        const queryParams = new URLSearchParams({
            from: params.from || 'Bamako',
            to: params.to,
            date: params.date,
        });
        return fetchAPI<Trip[]>(`/trips?${queryParams}`);
    },

    getById: (tripId: string) => fetchAPI<Trip>(`/trips/${tripId}`),

    getSeats: (tripId: string) => fetchAPI<Seat[]>(`/trips/${tripId}/seats`),

    holdSeats: (tripId: string, seatNumbers: string[]) =>
        fetchAPI<{ success: boolean; holdUntil: string; seats: string[] }>(
            `/trips/${tripId}/hold`,
            {
                method: 'POST',
                body: JSON.stringify({ seatNumbers }),
            }
        ),
};

// Bookings API
export interface BookingData {
    tripId: string;
    seats: string[];
    passengerName: string;
    passengerPhone: string;
    totalAmount: number;
}

export interface Booking {
    id: string;
    code: string;
    tripId: string;
    passengerName: string;
    passengerPhone: string;
    seats: string[];
    totalAmount: number;
    status: string;
    createdAt: string;
}

export const bookingsAPI = {
    create: (data: BookingData) =>
        fetchAPI<Booking>('/bookings', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    getByCode: (code: string) => fetchAPI<Booking>(`/bookings/${code}`),

    confirm: (bookingId: string) =>
        fetchAPI<Booking>(`/bookings/${bookingId}/confirm`, {
            method: 'POST',
        }),
};

// Payments API
export const paymentsAPI = {
    initiate: (bookingId: string, phoneNumber: string, provider: string) =>
        fetchAPI<{ success: boolean; transactionId: string }>('/payments/initiate', {
            method: 'POST',
            body: JSON.stringify({ bookingId, phoneNumber, provider }),
        }),

    verify: (transactionId: string) =>
        fetchAPI<{ status: string; booking?: Booking }>(`/payments/verify/${transactionId}`),
};
