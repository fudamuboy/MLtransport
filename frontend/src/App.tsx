import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/seats/:tripId" element={<SeatSelectionPage />} />
          <Route path="/checkout/:tripId" element={<CheckoutPage />} />
          <Route path="/success/:code" element={<SuccessPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
