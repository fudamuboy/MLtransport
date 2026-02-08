// Types for Obilet Mali

export interface Region {
    id: string;
    name: string;
    chefLieu: string;
}

export interface Route {
    id: string;
    fromCity: string;
    toCity: string;
    duration: string;
    durationMin: number;
    durationMax: number;
    axis: string;
    distance: number;
}

export interface Stop {
    id: string;
    routeId: string;
    name: string;
    order: number;
    isPause?: boolean;
}

export interface Company {
    id: string;
    name: string;
    logo: string;
    rating: number;
}

export interface Trip {
    id: string;
    routeId: string;
    route: Route;
    companyId: string;
    company: Company;
    departureTime: string;
    arrivalTime: string;
    price: number;
    availableSeats: number;
    totalSeats: number;
    busType: string;
}

export interface Seat {
    id: string;
    tripId: string;
    number: string;
    row: number;
    column: number;
    status: 'available' | 'occupied' | 'selected' | 'held';
    holdUntil?: string;
}

export interface Booking {
    id: string;
    code: string;
    tripId: string;
    trip?: Trip;
    seats: string[];
    passengerName: string;
    passengerPhone: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    totalAmount: number;
    createdAt: string;
}

export interface Payment {
    id: string;
    bookingId: string;
    amount: number;
    status: 'pending' | 'success' | 'failed';
    provider: 'orange_money';
    phoneNumber: string;
    transactionId?: string;
}

export interface SearchParams {
    from: string;
    to: string;
    date: string;
    passengers: number;
}
