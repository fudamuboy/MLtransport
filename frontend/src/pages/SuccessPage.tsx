import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Download, MessageSquare, Bus, MapPin, Clock, Calendar, Armchair } from 'lucide-react';
import { formatPrice, formatTime, formatDate } from '../data/mockData';

interface SuccessState {
    trip: {
        company: { name: string; logo: string };
        route: { fromCity: string; toCity: string; duration: string };
        departureTime: string;
        price: number;
    };
    seats: string[];
    passengerName: string;
    phoneNumber: string;
    totalPrice: number;
}

export default function SuccessPage() {
    const { code } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as SuccessState | null;

    if (!state || !code) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Réservation introuvable</h2>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

    const { trip, seats, passengerName, phoneNumber, totalPrice } = state;

    const handleDownloadPDF = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
            const response = await fetch(`${API_BASE_URL}/bookings/${code}/pdf`);

            if (!response.ok) {
                throw new Error('Erreur lors du téléchargement du billet');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `billet-${code}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Erreur lors du téléchargement du billet. Veuillez réessayer.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-8 sm:py-12">
                <div className="container mx-auto px-4 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 animate-bounce">
                        <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Réservation confirmée !</h1>
                    <p className="text-white/90 text-base sm:text-lg">Votre billet a été envoyé par SMS</p>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 -mt-8">
                <div className="max-w-2xl mx-auto">
                    {/* Ticket Card */}
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                        {/* Ticket Header */}
                        <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">{trip.company.logo}</div>
                                    <div>
                                        <h2 className="text-xl font-bold">{trip.company.name}</h2>
                                        <p className="text-white/80">Billet électronique</p>
                                    </div>
                                </div>
                                <Bus className="w-10 h-10 opacity-50" />
                            </div>
                        </div>

                        {/* Booking Code */}
                        <div className="bg-primary-50 p-4 sm:p-6 text-center border-b border-dashed border-primary-200">
                            <p className="text-sm text-primary-600 mb-1">Code de réservation</p>
                            <p className="text-xl sm:text-3xl font-bold text-primary-600 tracking-wider">{code}</p>
                            <p className="text-xs sm:text-sm text-primary-500 mt-2">Présentez ce code à l'embarquement</p>
                        </div>

                        {/* Trip Details */}
                        <div className="p-6 space-y-6">
                            {/* Route */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-primary-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Trajet</p>
                                    <p className="text-lg font-bold text-gray-800">
                                        {trip.route.fromCity} → {trip.route.toCity}
                                    </p>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                        <Calendar className="w-6 h-6 text-primary-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date</p>
                                        <p className="font-semibold text-gray-800">
                                            {formatDate(trip.departureTime)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-primary-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Heure de départ</p>
                                        <p className="font-semibold text-gray-800">{formatTime(trip.departureTime)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Passenger */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-sm text-gray-500 mb-1">Passager</p>
                                <p className="font-semibold text-gray-800">{passengerName}</p>
                                <p className="text-sm text-gray-500">+223 {phoneNumber}</p>
                            </div>

                            {/* Seats */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                    <Armchair className="w-6 h-6 text-primary-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Siège(s)</p>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {seats.map((seat) => (
                                            <span
                                                key={seat}
                                                className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-bold"
                                            >
                                                {seat}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total payé</span>
                                    <span className="text-2xl font-bold text-primary-500">{formatPrice(totalPrice)}</span>
                                </div>
                            </div>
                        </div>

                        {/* SMS Preview */}
                        <div className="bg-gray-50 p-6 border-t border-gray-100">
                            <div className="flex items-start gap-3">
                                <MessageSquare className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                                <div className="text-sm">
                                    <p className="font-medium text-gray-700 mb-2">SMS envoyé à +223 {phoneNumber}</p>
                                    <div className="bg-white rounded-xl p-4 border border-gray-200 text-gray-600 font-mono text-xs">
                                        {trip.company.name} ✅<br />
                                        Réservation confirmée<br />
                                        <br />
                                        Code : {code}<br />
                                        Trajet : {trip.route.fromCity} → {trip.route.toCity}<br />
                                        Date : {formatDate(trip.departureTime)} - {formatTime(trip.departureTime)}<br />
                                        Siège : {seats.join(', ')}<br />
                                        <br />
                                        Présentez ce code à l'embarquement.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={handleDownloadPDF}
                                className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Télécharger billet PDF
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="btn-secondary flex-1"
                            >
                                Nouvelle réservation
                            </button>
                        </div>
                    </div>

                    {/* Info Footer */}
                    <div className="text-center mt-8 text-gray-500 text-sm">
                        <p>Conservez votre code de réservation précieusement.</p>
                        <p>Il vous sera demandé à l'embarquement.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
