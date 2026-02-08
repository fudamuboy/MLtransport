import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, MapPin, Calendar, Users, Search, ArrowRight, Shield, Clock, CreditCard, ArrowLeftRight } from 'lucide-react';
import { regions } from '../data/mockData';

// All available cities (Bamako + all regions)
const allCities = ['Bamako', ...regions.map(r => r.name)];

export default function SearchPage() {
    const navigate = useNavigate();
    const [departure, setDeparture] = useState('Bamako');
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [passengers, setPassengers] = useState(1);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (departure && destination && date && departure !== destination) {
            navigate(`/results?from=${departure}&to=${destination}&date=${date}&passengers=${passengers}`);
        }
    };

    // Swap departure and destination
    const handleSwap = () => {
        const temp = departure;
        setDeparture(destination || 'Bamako');
        setDestination(temp);
    };

    const today = new Date().toISOString().split('T')[0];

    // Get available destinations (exclude current departure)
    const availableDestinations = allCities.filter(city => city !== departure);
    // Get available departures (exclude current destination)
    const availableDepartures = allCities.filter(city => city !== destination);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700">
            {/* Header */}
            <header className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                            <Bus className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Sewa Transport</h1>
                            <p className="text-white/80 text-sm">Transport interurbain</p>
                        </div>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <a href="#" className="text-white/90 hover:text-white transition-colors">Mes réservations</a>
                        <a href="#" className="text-white/90 hover:text-white transition-colors">Aide</a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Voyagez à travers le Mali
                    </h2>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Réservez votre billet de bus en ligne. Simple, rapide et sécurisé.
                    </p>
                </div>

                {/* Search Card */}
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSearch} className="bg-white rounded-3xl shadow-2xl p-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Departure */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Départ</label>
                                <div className="relative">
                                    <select
                                        value={departure}
                                        onChange={(e) => setDeparture(e.target.value)}
                                        required
                                        className="input-field pl-10 pr-4 appearance-none cursor-pointer"
                                    >
                                        {availableDepartures.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* Swap Button - Mobile hidden */}
                            <div className="hidden lg:flex items-end justify-center pb-3">
                                <button
                                    type="button"
                                    onClick={handleSwap}
                                    className="p-2 bg-primary-100 hover:bg-primary-200 rounded-full transition-colors"
                                    title="Inverser départ et destination"
                                >
                                    <ArrowLeftRight className="w-5 h-5 text-primary-600" />
                                </button>
                            </div>

                            {/* Destination */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Destination</label>
                                <div className="relative">
                                    <select
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        required
                                        className="input-field pl-10 pr-10 appearance-none cursor-pointer"
                                    >
                                        <option value="">Choisir une ville</option>
                                        {availableDestinations.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 pointer-events-none" />
                                    <ArrowRight className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Date de voyage</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        min={today}
                                        required
                                        className="input-field pl-10"
                                    />
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 pointer-events-none" />
                                </div>
                            </div>

                            {/* Passengers */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-2">Passagers</label>
                                <div className="relative">
                                    <select
                                        value={passengers}
                                        onChange={(e) => setPassengers(parseInt(e.target.value))}
                                        className="input-field pl-10 appearance-none cursor-pointer"
                                    >
                                        {[1, 2, 3, 4, 5, 6].map((num) => (
                                            <option key={num} value={num}>
                                                {num} {num === 1 ? 'passager' : 'passagers'}
                                            </option>
                                        ))}
                                    </select>
                                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Swap Button - Mobile only */}
                        <div className="lg:hidden flex justify-center mt-4">
                            <button
                                type="button"
                                onClick={handleSwap}
                                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                            >
                                <ArrowLeftRight className="w-5 h-5" />
                                Inverser
                            </button>
                        </div>

                        <div className="mt-8 text-center">
                            <button type="submit" className="btn-primary inline-flex items-center gap-3 text-lg px-12">
                                <Search className="w-5 h-5" />
                                Rechercher
                            </button>
                        </div>
                    </form>
                </div>

                {/* Features */}
                <div className="mt-20 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="text-center">
                        <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Paiement sécurisé</h3>
                        <p className="text-white/80">Orange Money et autres options</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Réservation rapide</h3>
                        <p className="text-white/80">En moins de 5 minutes</p>
                    </div>
                    <div className="text-center">
                        <div className="bg-white/20 backdrop-blur-sm w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <CreditCard className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">Prix transparents</h3>
                        <p className="text-white/80">Sans frais cachés</p>
                    </div>
                </div>

                {/* Popular Routes */}
                <div className="mt-20 max-w-4xl mx-auto">
                    <h3 className="text-2xl font-bold text-white text-center mb-8">Trajets populaires</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { from: 'Bamako', to: 'Ségou' },
                            { from: 'Bamako', to: 'Sikasso' },
                            { from: 'Ségou', to: 'Mopti' },
                            { from: 'Bamako', to: 'Kayes' },
                        ].map((route) => (
                            <button
                                key={`${route.from}-${route.to}`}
                                onClick={() => {
                                    setDeparture(route.from);
                                    setDestination(route.to);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white py-4 px-6 rounded-2xl transition-all duration-200 font-medium"
                            >
                                {route.from} → {route.to}
                            </button>
                        ))}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="container mx-auto px-4 py-8 mt-12 border-t border-white/20">
                <div className="text-center text-white/70">
                    <p>© 2026 Obilet Mali. Tous droits réservés.</p>
                </div>
            </footer>
        </div>
    );
}
