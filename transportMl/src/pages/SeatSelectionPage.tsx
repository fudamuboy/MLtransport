import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bus, AlertCircle, Clock } from 'lucide-react';
import { routes, generateTrips, generateSeats, formatPrice, formatTime, companies } from '../data/mockData';
import { Seat } from '../types';

export default function SeatSelectionPage() {
    const { tripId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const passengers = parseInt(searchParams.get('passengers') || '1');

    const [seats, setSeats] = useState<Seat[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [holdTimer, setHoldTimer] = useState<number>(300); // 5 minutes

    // Parse trip info from tripId
    const tripInfo = useMemo(() => {
        if (!tripId) return null;
        const parts = tripId.split('-');
        const routeId = `route-${parts[1]}`;
        const companyId = `comp-${parts[2]}`;
        const route = routes.find(r => r.id === routeId);
        const company = companies.find(c => c.id === companyId);
        if (!route || !company) return null;

        const trips = generateTrips(routeId, new Date().toISOString().split('T')[0]);
        const trip = trips.find(t => t.id === tripId);
        return trip || null;
    }, [tripId]);

    useEffect(() => {
        if (tripId) {
            setSeats(generateSeats(tripId));
        }
    }, [tripId]);

    // Hold timer countdown
    useEffect(() => {
        if (selectedSeats.length > 0 && holdTimer > 0) {
            const timer = setInterval(() => {
                setHoldTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [selectedSeats.length, holdTimer]);

    const handleSeatClick = (seat: Seat) => {
        if (seat.status === 'occupied') return;

        setSelectedSeats((prev) => {
            if (prev.includes(seat.number)) {
                return prev.filter((s) => s !== seat.number);
            }
            if (prev.length >= passengers) {
                return [...prev.slice(1), seat.number];
            }
            return [...prev, seat.number];
        });
        setHoldTimer(300); // Reset timer on new selection
    };

    const getSeatStatus = (seat: Seat): 'available' | 'occupied' | 'selected' => {
        if (selectedSeats.includes(seat.number)) return 'selected';
        return seat.status as 'available' | 'occupied';
    };

    const formatTimer = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const totalPrice = tripInfo ? tripInfo.price * selectedSeats.length : 0;

    if (!tripInfo) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Trajet non trouvé</h2>
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
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Retour
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Choisissez vos sièges</h1>
                            <p className="text-white/80">
                                {tripInfo.company.name} • {tripInfo.route.fromCity} → {tripInfo.route.toCity}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold">{formatTime(tripInfo.departureTime)}</p>
                            <p className="text-white/80">Départ</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Seat Map */}
                    <div className="lg:col-span-2">
                        <div className="card">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <Bus className="w-6 h-6 text-primary-500" />
                                Plan du bus - 40 places
                            </h2>

                            {/* Legend */}
                            <div className="flex flex-wrap gap-6 mb-8 p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg seat-available"></div>
                                    <span className="text-sm text-gray-600">Disponible</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg seat-selected"></div>
                                    <span className="text-sm text-gray-600">Sélectionné</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg seat-occupied"></div>
                                    <span className="text-sm text-gray-600">Occupé</span>
                                </div>
                            </div>

                            {/* Bus Layout */}
                            <div className="bg-gradient-to-b from-gray-100 to-gray-50 rounded-3xl p-6 max-w-md mx-auto">
                                {/* Driver area */}
                                <div className="flex justify-end mb-6">
                                    <div className="bg-gray-300 rounded-xl px-4 py-2 text-sm text-gray-600 font-medium">
                                        🚗 Conducteur
                                    </div>
                                </div>

                                {/* Seat Grid */}
                                <div className="space-y-3">
                                    {Array.from({ length: 10 }).map((_, rowIndex) => (
                                        <div key={rowIndex} className="flex items-center justify-center gap-3">
                                            {/* Left side - seats A & B */}
                                            <div className="flex gap-2">
                                                {seats
                                                    .filter((s) => s.row === rowIndex + 1 && s.column <= 2)
                                                    .sort((a, b) => a.column - b.column)
                                                    .map((seat) => (
                                                        <button
                                                            key={seat.id}
                                                            onClick={() => handleSeatClick(seat)}
                                                            disabled={seat.status === 'occupied'}
                                                            className={`w-12 h-12 rounded-xl font-semibold text-sm transition-all duration-200 ${getSeatStatus(seat) === 'selected'
                                                                ? 'seat-selected'
                                                                : getSeatStatus(seat) === 'occupied'
                                                                    ? 'seat-occupied'
                                                                    : 'seat-available hover:scale-105'
                                                                }`}
                                                        >
                                                            {seat.number}
                                                        </button>
                                                    ))}
                                            </div>

                                            {/* Aisle */}
                                            <div className="w-8 text-center text-gray-400 text-xs">{rowIndex + 1}</div>

                                            {/* Right side - seats C & D */}
                                            <div className="flex gap-2">
                                                {seats
                                                    .filter((s) => s.row === rowIndex + 1 && s.column > 2)
                                                    .sort((a, b) => a.column - b.column)
                                                    .map((seat) => (
                                                        <button
                                                            key={seat.id}
                                                            onClick={() => handleSeatClick(seat)}
                                                            disabled={seat.status === 'occupied'}
                                                            className={`w-12 h-12 rounded-xl font-semibold text-sm transition-all duration-200 ${getSeatStatus(seat) === 'selected'
                                                                ? 'seat-selected'
                                                                : getSeatStatus(seat) === 'occupied'
                                                                    ? 'seat-occupied'
                                                                    : 'seat-available hover:scale-105'
                                                                }`}
                                                        >
                                                            {seat.number}
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Back of bus */}
                                <div className="text-center mt-6 text-gray-400 text-sm">
                                    ← Arrière du bus →
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Résumé</h3>

                            {/* Hold Timer Warning */}
                            {selectedSeats.length > 0 && (
                                <div className={`p-4 rounded-xl mb-4 flex items-center gap-3 ${holdTimer < 60 ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                                    }`}>
                                    <Clock className="w-5 h-5" />
                                    <div>
                                        <p className="font-medium">Sièges réservés pour</p>
                                        <p className="text-2xl font-bold">{formatTimer(holdTimer)}</p>
                                    </div>
                                </div>
                            )}

                            {/* Trip Info */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Trajet</span>
                                    <span className="font-medium text-gray-800">
                                        {tripInfo.route.fromCity} → {tripInfo.route.toCity}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Compagnie</span>
                                    <span className="font-medium text-gray-800">{tripInfo.company.name}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Départ</span>
                                    <span className="font-medium text-gray-800">{formatTime(tripInfo.departureTime)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Prix par siège</span>
                                    <span className="font-medium text-gray-800">{formatPrice(tripInfo.price)}</span>
                                </div>
                            </div>

                            {/* Selected Seats */}
                            <div className="border-t border-gray-100 pt-4 mb-6">
                                <p className="text-gray-600 mb-2">
                                    Sièges sélectionnés ({selectedSeats.length}/{passengers})
                                </p>
                                {selectedSeats.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSeats.map((seat) => (
                                            <span
                                                key={seat}
                                                className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                                            >
                                                {seat}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-sm">Aucun siège sélectionné</p>
                                )}
                            </div>

                            {/* Total */}
                            <div className="border-t border-gray-100 pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-800">Total</span>
                                    <span className="text-2xl font-bold text-primary-500">
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>
                            </div>

                            {/* Action Button */}
                            {selectedSeats.length < passengers && (
                                <div className="bg-blue-50 text-blue-700 p-4 rounded-xl mb-4 flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm">
                                        Veuillez sélectionner {passengers - selectedSeats.length} siège(s) supplémentaire(s)
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={() => navigate(`/checkout/${tripId}?seats=${selectedSeats.join(',')}`)}
                                disabled={selectedSeats.length !== passengers || holdTimer === 0}
                                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${selectedSeats.length === passengers && holdTimer > 0
                                    ? 'btn-primary'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Continuer vers paiement
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
