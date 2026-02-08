import { X, MapPin, Clock, Route, Coffee } from 'lucide-react';
import type { Trip } from '../types';
import { formatTime } from '../data/mockData';

interface Stop {
    id: string;
    name: string;
    order: number;
    isPause: boolean;
}

interface TripDetailsModalProps {
    trip: Trip;
    stops: Stop[];
    onClose: () => void;
    onSelectSeats: () => void;
}

// Calculate estimated arrival time at each stop
function calculateStopTime(departureTime: Date, totalStops: number, stopIndex: number, totalDurationMin: number): string {
    // Distribute time proportionally across stops
    const minutesPerStop = totalDurationMin / (totalStops + 1);
    const minutesToStop = minutesPerStop * (stopIndex + 1);
    const stopTime = new Date(departureTime.getTime() + minutesToStop * 60 * 1000);
    return formatTime(stopTime.toISOString());
}

export default function TripDetailsModal({ trip, stops, onClose, onSelectSeats }: TripDetailsModalProps) {
    const departureTime = new Date(trip.departureTime);
    const arrivalTime = new Date(trip.arrivalTime);

    // Calculate total duration in minutes
    const totalDurationMin = (arrivalTime.getTime() - departureTime.getTime()) / (60 * 1000);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-primary-500 text-white p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
                            {trip.company.logo}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">{trip.company.name}</h3>
                            <p className="text-white/80">{trip.busType}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-2">
                            <Route className="w-4 h-4" />
                            {trip.route.axis}
                        </span>
                        <span className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {trip.route.duration}
                        </span>
                    </div>
                </div>

                {/* Stops List */}
                <div className="p-6 overflow-y-auto max-h-96">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary-500" />
                        Localités traversées
                    </h4>

                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200"></div>

                        <div className="space-y-0">
                            {/* Start Point */}
                            <div className="flex items-center gap-4 py-3 relative">
                                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center z-10">
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{trip.route.fromCity}</p>
                                    <p className="text-sm text-gray-500">Point de départ</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-primary-600">{formatTime(departureTime.toISOString())}</p>
                                    <p className="text-xs text-gray-400">Départ</p>
                                </div>
                            </div>

                            {/* Intermediate Stops */}
                            {stops.map((stop, index) => (
                                <div key={stop.id} className="flex items-center gap-4 py-3 relative">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${stop.isPause
                                        ? 'bg-yellow-100 border-2 border-yellow-400'
                                        : 'bg-gray-100 border-2 border-gray-300'
                                        }`}>
                                        {stop.isPause ? (
                                            <Coffee className="w-4 h-4 text-yellow-600" />
                                        ) : (
                                            <span className="text-xs font-medium text-gray-500">{index + 1}</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-medium ${stop.isPause ? 'text-yellow-700' : 'text-gray-700'}`}>
                                            {stop.name}
                                        </p>
                                        {stop.isPause && (
                                            <p className="text-sm text-yellow-600">Pause principale (15-20 min)</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className={`font-medium ${stop.isPause ? 'text-yellow-600' : 'text-gray-600'}`}>
                                            ~{calculateStopTime(departureTime, stops.length, index, totalDurationMin)}
                                        </p>
                                        <p className="text-xs text-gray-400">Estimé</p>
                                    </div>
                                </div>
                            ))}

                            {/* End Point */}
                            <div className="flex items-center gap-4 py-3 relative">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center z-10">
                                    <div className="w-3 h-3 bg-white rounded-full"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800">{trip.route.toCity}</p>
                                    <p className="text-sm text-gray-500">Destination finale</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-green-600">{formatTime(arrivalTime.toISOString())}</p>
                                    <p className="text-xs text-gray-400">Arrivée</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <button onClick={onSelectSeats} className="btn-primary w-full">
                        Choisir mon siège
                    </button>
                </div>
            </div>
        </div>
    );
}
