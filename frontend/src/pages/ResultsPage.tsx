import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Bus, MapPin, Users, Star, ArrowLeft, Info, ChevronRight, Loader2 } from 'lucide-react';
import { formatPrice, formatTime } from '../data/mockData';
import { useTrips, useStops } from '../hooks/useApi';
import type { Trip } from '../types';
import TripDetailsModal from '../components/TripDetailsModal';

export default function ResultsPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [showModal, setShowModal] = useState(false);

    const from = searchParams.get('from') || 'Bamako';
    const to = searchParams.get('to') || '';
    const date = searchParams.get('date') || '';
    const passengers = parseInt(searchParams.get('passengers') || '1');

    // Fetch trips from API
    const { data: trips = [], isLoading, error } = useTrips(from, to, date);

    // Get route from first trip (if available)
    const route = trips.length > 0 ? trips[0].route : null;

    // Fetch stops from API
    const { data: routeStops = [] } = useStops(route?.id || '');

    const handleSelectTrip = (trip: Trip) => {
        navigate(`/seats/${trip.id}?passengers=${passengers}`);
    };

    const handleShowDetails = (trip: Trip) => {
        setSelectedTrip(trip);
        setShowModal(true);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Recherche des trajets disponibles...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Erreur de connexion</h2>
                    <p className="text-gray-600 mb-6">Impossible de charger les trajets. Vérifiez votre connexion.</p>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    if (!route) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Route non trouvée</h2>
                    <p className="text-gray-600 mb-6">Aucune route disponible pour cette destination.</p>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-primary-500 text-white py-6">
                <div className="container mx-auto px-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Modifier la recherche
                    </button>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            <span className="font-semibold">{from}</span>
                            <ChevronRight className="w-5 h-5" />
                            <MapPin className="w-5 h-5" />
                            <span className="font-semibold">{to}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm sm:ml-auto">
                            <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full">{route.axis}</span>
                            <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full">{route.distance} km</span>
                            <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full">{route.duration}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Results */}
            <main className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        {trips.length} trajets disponibles
                    </h2>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-5 h-5" />
                        <span>{passengers} {passengers === 1 ? 'passager' : 'passagers'}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    {trips.map((trip) => (
                        <div key={trip.id} className="card hover:border-primary-200">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                {/* Company Info */}
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-3xl">
                                        {trip.company.logo}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{trip.company.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                            <span>{trip.company.rating}</span>
                                            <span className="text-gray-400">•</span>
                                            <span>{trip.busType}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Time Info */}
                                <div className="flex items-center gap-4 sm:gap-8">
                                    <div className="text-center">
                                        <p className="text-xl sm:text-2xl font-bold text-gray-800">{formatTime(trip.departureTime)}</p>
                                        <p className="text-xs sm:text-sm text-gray-500">Départ</p>
                                    </div>
                                    <div className="flex flex-col items-center flex-1">
                                        <div className="w-16 sm:w-24 h-0.5 bg-gray-200 relative">
                                            <Bus className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 sm:w-5 h-4 sm:h-5 text-primary-500" />
                                        </div>
                                        <span className="text-xs text-gray-500 mt-2">{route.duration}</span>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl sm:text-2xl font-bold text-gray-800">{formatTime(trip.arrivalTime)}</p>
                                        <p className="text-xs sm:text-sm text-gray-500">Arrivée</p>
                                    </div>
                                </div>

                                {/* Price & Actions */}
                                <div className="flex flex-col items-end gap-3">
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-primary-500">{formatPrice(trip.price)}</p>
                                        <p className="text-sm text-gray-500">par personne</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600 flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            {trip.availableSeats} places
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-4 justify-end">
                                <button
                                    onClick={() => handleShowDetails(trip)}
                                    className="btn-secondary inline-flex items-center gap-2"
                                >
                                    <Info className="w-4 h-4" />
                                    Détails
                                </button>
                                <button
                                    onClick={() => handleSelectTrip(trip)}
                                    className="btn-primary inline-flex items-center gap-2"
                                >
                                    Choisir siège
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {trips.length === 0 && (
                    <div className="text-center py-12">
                        <Bus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun trajet disponible</h3>
                        <p className="text-gray-500">Essayez une autre date ou destination</p>
                    </div>
                )}
            </main>

            {/* Trip Details Modal */}
            {showModal && selectedTrip && (
                <TripDetailsModal
                    trip={selectedTrip}
                    stops={routeStops}
                    onClose={() => setShowModal(false)}
                    onSelectSeats={() => {
                        setShowModal(false);
                        handleSelectTrip(selectedTrip);
                    }}
                />
            )}
        </div>
    );
}
