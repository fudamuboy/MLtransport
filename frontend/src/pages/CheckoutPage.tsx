import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Phone, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { formatPrice, formatTime } from '../data/mockData';
import { useTrip, useCreateBooking } from '../hooks/useApi';

type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

export default function CheckoutPage() {
    const { tripId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const seats = searchParams.get('seats')?.split(',') || [];

    const [passengerName, setPassengerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');

    // Fetch trip from API
    const { data: tripInfo, isLoading: tripLoading, error: tripError } = useTrip(tripId || '');
    const createBookingMutation = useCreateBooking();

    const totalPrice = tripInfo ? tripInfo.price * seats.length : 0;

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phoneNumber.startsWith('7') && !phoneNumber.startsWith('6')) {
            alert('Numéro Orange Money invalide. Doit commencer par 7 ou 6.');
            return;
        }

        if (!tripId || !tripInfo) return;

        setPaymentStatus('processing');

        try {
            // Create booking in database
            const booking = await createBookingMutation.mutateAsync({
                tripId,
                seats,
                passengerName,
                passengerPhone: phoneNumber,
                totalAmount: totalPrice,
            });

            setPaymentStatus('success');

            // Navigate to success page after brief delay
            setTimeout(() => {
                navigate(`/success/${booking.code}`, {
                    state: {
                        trip: tripInfo,
                        seats,
                        passengerName,
                        phoneNumber,
                        totalPrice,
                    },
                });
            }, 1500);
        } catch (error) {
            console.error('Booking failed:', error);
            setPaymentStatus('failed');
        }
    };

    // Loading state
    if (tripLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (tripError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Erreur de connexion</h2>
                    <p className="text-gray-600 mb-6">Impossible de charger le trajet.</p>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Retour à l'accueil
                    </button>
                </div>
            </div>
        );
    }

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
                    <h1 className="text-2xl font-bold">Paiement</h1>
                    <p className="text-white/80">Finalisez votre réservation</p>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Payment Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handlePayment} className="card">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <CreditCard className="w-6 h-6 text-primary-500" />
                                Informations de paiement
                            </h2>

                            {/* Passenger Info */}
                            <div className="mb-8">
                                <h3 className="font-semibold text-gray-700 mb-4">Informations du passager</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            Nom complet
                                        </label>
                                        <input
                                            type="text"
                                            value={passengerName}
                                            onChange={(e) => setPassengerName(e.target.value)}
                                            required
                                            placeholder="Exemple: Amadou Traoré"
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Orange Money Payment */}
                            <div className="mb-8">
                                <h3 className="font-semibold text-gray-700 mb-4">Paiement Orange Money</h3>

                                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 mb-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-orange-500 text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold">
                                            OM
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">Orange Money Mali</p>
                                            <p className="text-sm text-gray-600">Paiement mobile sécurisé</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                            <Phone className="inline w-4 h-4 mr-2" />
                                            Numéro Orange Money
                                        </label>
                                        <div className="flex">
                                            <span className="bg-gray-100 border border-r-0 border-gray-200 px-4 py-3 rounded-l-xl text-gray-600 font-medium">
                                                +223
                                            </span>
                                            <input
                                                type="tel"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 8))}
                                                required
                                                placeholder="7X XX XX XX"
                                                maxLength={8}
                                                className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Vous recevrez une notification sur ce numéro pour confirmer le paiement.
                                        </p>
                                    </div>
                                </div>

                                {/* Security Notice */}
                                <div className="flex items-start gap-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                                    <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <p>
                                        Votre paiement est sécurisé. Nous ne stockons pas vos informations de paiement.
                                    </p>
                                </div>
                            </div>

                            {/* Payment Status */}
                            {paymentStatus === 'failed' && (
                                <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">
                                    <p className="font-medium">Paiement échoué</p>
                                    <p className="text-sm">Veuillez réessayer ou utiliser un autre numéro.</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={paymentStatus === 'processing' || paymentStatus === 'success'}
                                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${paymentStatus === 'processing' || paymentStatus === 'success'
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'btn-primary'
                                    }`}
                            >
                                {paymentStatus === 'processing' && (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Traitement en cours...
                                    </>
                                )}
                                {paymentStatus === 'success' && (
                                    <>
                                        <CheckCircle className="w-5 h-5" />
                                        Paiement réussi !
                                    </>
                                )}
                                {(paymentStatus === 'idle' || paymentStatus === 'failed') && (
                                    <>Payer {formatPrice(totalPrice)}</>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-8">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Récapitulatif</h3>

                            {/* Trip Info */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="text-2xl">{tripInfo.company.logo}</div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{tripInfo.company.name}</p>
                                        <p className="text-sm text-gray-600">{tripInfo.busType}</p>
                                    </div>
                                </div>
                                <div className="text-sm space-y-2 text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Trajet</span>
                                        <span className="font-medium text-gray-800">
                                            {tripInfo.route.fromCity} → {tripInfo.route.toCity}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Départ</span>
                                        <span className="font-medium text-gray-800">{formatTime(tripInfo.departureTime)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Durée</span>
                                        <span className="font-medium text-gray-800">{tripInfo.route.duration}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Seats */}
                            <div className="mb-6">
                                <p className="text-gray-600 mb-2">Sièges réservés</p>
                                <div className="flex flex-wrap gap-2">
                                    {seats.map((seat) => (
                                        <span
                                            key={seat}
                                            className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium"
                                        >
                                            {seat}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="border-t border-gray-100 pt-4 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>{seats.length} × {formatPrice(tripInfo.price)}</span>
                                    <span>{formatPrice(totalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Frais de service</span>
                                    <span className="text-green-600">Gratuit</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t border-gray-100 pt-4 mt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-800">Total</span>
                                    <span className="text-2xl font-bold text-primary-500">
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
