// Mock data for development - will be replaced by API calls

import type { Region, Route, Stop, Company, Trip, Seat } from '../types';

export const regions: Region[] = [
    { id: '1', name: 'Koulikoro', chefLieu: 'Koulikoro' },
    { id: '2', name: 'Ségou', chefLieu: 'Ségou' },
    { id: '3', name: 'Sikasso', chefLieu: 'Sikasso' },
    { id: '4', name: 'Mopti', chefLieu: 'Mopti' },
    { id: '5', name: 'Kayes', chefLieu: 'Kayes' },
    { id: '6', name: 'Kita', chefLieu: 'Kita' },
    { id: '7', name: 'Dioïla', chefLieu: 'Dioïla' },
    { id: '8', name: 'Bougouni', chefLieu: 'Bougouni' },
    { id: '9', name: 'Tombouctou', chefLieu: 'Tombouctou' },
    { id: '10', name: 'Gao', chefLieu: 'Gao' },
    { id: '11', name: 'Kidal', chefLieu: 'Kidal' },
    { id: '12', name: 'Taoudénit', chefLieu: 'Taoudénit' },
];

export const routes: Route[] = [
    {
        id: 'route-1',
        fromCity: 'Bamako',
        toCity: 'Ségou',
        duration: '3h - 4h',
        durationMin: 180,
        durationMax: 240,
        axis: 'RN6',
        distance: 235,
    },
    {
        id: 'route-2',
        fromCity: 'Bamako',
        toCity: 'Koulikoro',
        duration: '1h - 1h30',
        durationMin: 60,
        durationMax: 90,
        axis: 'RN27',
        distance: 60,
    },
    {
        id: 'route-3',
        fromCity: 'Bamako',
        toCity: 'Sikasso',
        duration: '5h - 6h',
        durationMin: 300,
        durationMax: 360,
        axis: 'RN7',
        distance: 370,
    },
    {
        id: 'route-4',
        fromCity: 'Bamako',
        toCity: 'Mopti',
        duration: '6h - 8h',
        durationMin: 360,
        durationMax: 480,
        axis: 'RN6',
        distance: 620,
    },
    {
        id: 'route-5',
        fromCity: 'Bamako',
        toCity: 'Kayes',
        duration: '7h - 9h',
        durationMin: 420,
        durationMax: 540,
        axis: 'RN1',
        distance: 510,
    },
];

export const stops: Record<string, Stop[]> = {
    'route-1': [
        { id: 's1', routeId: 'route-1', name: 'Yirimadio', order: 1 },
        { id: 's2', routeId: 'route-1', name: 'Baguinéda', order: 2 },
        { id: 's3', routeId: 'route-1', name: 'Kasséla', order: 3 },
        { id: 's4', routeId: 'route-1', name: 'Zantiguila', order: 4 },
        { id: 's5', routeId: 'route-1', name: 'Fana', order: 5, isPause: true },
        { id: 's6', routeId: 'route-1', name: 'Konobougou', order: 6 },
        { id: 's7', routeId: 'route-1', name: 'Boni', order: 7 },
        { id: 's8', routeId: 'route-1', name: 'Cinzana Gare', order: 8 },
        { id: 's9', routeId: 'route-1', name: 'Ségou', order: 9 },
    ],
    'route-2': [
        { id: 's10', routeId: 'route-2', name: 'Sotuba', order: 1 },
        { id: 's11', routeId: 'route-2', name: 'Titibougou', order: 2 },
        { id: 's12', routeId: 'route-2', name: 'Koulikoro', order: 3 },
    ],
    'route-3': [
        { id: 's13', routeId: 'route-3', name: 'Yirimadio', order: 1 },
        { id: 's14', routeId: 'route-3', name: 'Sénou', order: 2 },
        { id: 's15', routeId: 'route-3', name: 'Bougoula', order: 3 },
        { id: 's16', routeId: 'route-3', name: 'Ouélessébougou', order: 4, isPause: true },
        { id: 's17', routeId: 'route-3', name: 'Kourouba', order: 5 },
        { id: 's18', routeId: 'route-3', name: 'Bougouni', order: 6, isPause: true },
        { id: 's19', routeId: 'route-3', name: 'Kolondiéba', order: 7 },
        { id: 's20', routeId: 'route-3', name: 'Sikasso', order: 8 },
    ],
    'route-4': [
        { id: 's21', routeId: 'route-4', name: 'Yirimadio', order: 1 },
        { id: 's22', routeId: 'route-4', name: 'Baguinéda', order: 2 },
        { id: 's23', routeId: 'route-4', name: 'Fana', order: 3, isPause: true },
        { id: 's24', routeId: 'route-4', name: 'Ségou', order: 4, isPause: true },
        { id: 's25', routeId: 'route-4', name: 'San', order: 5, isPause: true },
        { id: 's26', routeId: 'route-4', name: 'Mopti', order: 6 },
    ],
    'route-5': [
        { id: 's27', routeId: 'route-5', name: 'Kati', order: 1 },
        { id: 's28', routeId: 'route-5', name: 'Néguela', order: 2 },
        { id: 's29', routeId: 'route-5', name: 'Kita', order: 3, isPause: true },
        { id: 's30', routeId: 'route-5', name: 'Toukoto', order: 4 },
        { id: 's31', routeId: 'route-5', name: 'Mahina', order: 5 },
        { id: 's32', routeId: 'route-5', name: 'Kayes', order: 6 },
    ],
};

export const companies: Company[] = [
    {
        id: 'comp-1',
        name: 'Sewa Transport',
        logo: '🚌',
        rating: 4.5,
    },
    {
        id: 'comp-2',
        name: 'Bani Transport',
        logo: '🚍',
        rating: 4.2,
    },
    {
        id: 'comp-3',
        name: 'Balanzan Express',
        logo: '🚐',
        rating: 4.7,
    },
    {
        id: 'comp-4',
        name: 'Kamilkoç',
        logo: '🚌',
        rating: 4.5,
    },
    {
        id: 'comp-5',
        name: 'Mali Bus',
        logo: '🚍',
        rating: 4.2,
    },
    {
        id: 'comp-6',
        name: 'Bary Express',
        logo: '🚐',
        rating: 4.7,
    },
];

export const generateTrips = (routeId: string, date: string): Trip[] => {
    const route = routes.find(r => r.id === routeId);
    if (!route) return [];

    const basePrices: Record<string, number> = {
        'route-1': 5000,
        'route-2': 2500,
        'route-3': 7500,
        'route-4': 12000,
        'route-5': 15000,
    };

    const basePrice = basePrices[routeId] || 5000;
    const departureTimes = ['06:00', '08:00', '10:00', '14:00', '16:00'];

    return companies.flatMap((company, companyIndex) =>
        departureTimes.slice(0, 3 - companyIndex).map((time, index) => {
            const departureHour = parseInt(time.split(':')[0]);
            const durationHours = Math.floor((route.durationMin + route.durationMax) / 2 / 60);
            const arrivalHour = (departureHour + durationHours) % 24;

            return {
                id: `trip-${routeId}-${company.id}-${index}`,
                routeId,
                route,
                companyId: company.id,
                company,
                departureTime: `${date}T${time}:00`,
                arrivalTime: `${date}T${String(arrivalHour).padStart(2, '0')}:00:00`,
                price: basePrice + (companyIndex * 500) + (index * 250),
                availableSeats: 25 + Math.floor(Math.random() * 15),
                totalSeats: 40,
                busType: 'Standard 40 places',
            };
        })
    );
};

export const generateSeats = (tripId: string): Seat[] => {
    const seats: Seat[] = [];
    const occupiedSeats = new Set<string>();

    // Randomly mark some seats as occupied
    for (let i = 0; i < 8; i++) {
        const row = Math.floor(Math.random() * 10) + 1;
        const col = Math.floor(Math.random() * 4) + 1;
        occupiedSeats.add(`${row}-${col}`);
    }

    for (let row = 1; row <= 10; row++) {
        for (let col = 1; col <= 4; col++) {
            const seatKey = `${row}-${col}`;
            const colLetter = ['A', 'B', 'C', 'D'][col - 1];
            seats.push({
                id: `seat-${tripId}-${row}-${col}`,
                tripId,
                number: `${colLetter}${row}`,
                row,
                column: col,
                status: occupiedSeats.has(seatKey) ? 'occupied' : 'available',
            });
        }
    }

    return seats;
};

export const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('fr-ML', {
        style: 'decimal',
        minimumFractionDigits: 0,
    }).format(price) + ' FCFA';
};

export const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

export const generateBookingCode = (): string => {
    const year = new Date().getFullYear();
    const num = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    return `YY-${year}-${num}`;
};
