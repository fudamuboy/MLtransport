// React Query hooks for API calls
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripsAPI, routesAPI, bookingsAPI, paymentsAPI } from '../api';
import type { BookingData } from '../api';

// Routes hooks
export function useRoutes() {
    return useQuery({
        queryKey: ['routes'],
        queryFn: routesAPI.getAll,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export function useRegions() {
    return useQuery({
        queryKey: ['regions'],
        queryFn: routesAPI.getRegions,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

export function useStops(routeId: string) {
    return useQuery({
        queryKey: ['stops', routeId],
        queryFn: () => routesAPI.getStops(routeId),
        enabled: !!routeId,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

// Trips hooks
export function useTrips(from: string, to: string, date: string, enabled = true) {
    return useQuery({
        queryKey: ['trips', from, to, date],
        queryFn: () => tripsAPI.search({ from, to, date }),
        enabled: enabled && !!from && !!to && !!date,
        staleTime: 1 * 60 * 1000, // 1 minute
    });
}

export function useTrip(tripId: string) {
    return useQuery({
        queryKey: ['trip', tripId],
        queryFn: () => tripsAPI.getById(tripId),
        enabled: !!tripId,
    });
}

export function useSeats(tripId: string) {
    return useQuery({
        queryKey: ['seats', tripId],
        queryFn: () => tripsAPI.getSeats(tripId),
        enabled: !!tripId,
        refetchInterval: 30 * 1000, // Refetch every 30 seconds
    });
}

export function useHoldSeats() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ tripId, seatNumbers }: { tripId: string; seatNumbers: string[] }) =>
            tripsAPI.holdSeats(tripId, seatNumbers),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['seats', variables.tripId] });
        },
    });
}

// Bookings hooks
export function useCreateBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: BookingData) => bookingsAPI.create(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['seats', variables.tripId] });
        },
    });
}

export function useBooking(code: string) {
    return useQuery({
        queryKey: ['booking', code],
        queryFn: () => bookingsAPI.getByCode(code),
        enabled: !!code,
    });
}

// Payments hooks
export function useInitiatePayment() {
    return useMutation({
        mutationFn: ({
            bookingId,
            phoneNumber,
            provider,
        }: {
            bookingId: string;
            phoneNumber: string;
            provider: string;
        }) => paymentsAPI.initiate(bookingId, phoneNumber, provider),
    });
}

export function useVerifyPayment(transactionId: string) {
    return useQuery({
        queryKey: ['payment', transactionId],
        queryFn: () => paymentsAPI.verify(transactionId),
        enabled: !!transactionId,
        refetchInterval: 5000, // Poll every 5 seconds
    });
}
