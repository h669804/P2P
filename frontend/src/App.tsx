import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegistrerPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import Departure from './pages/Departure';
import Destination from './pages/Destination';
import Passengers from './pages/Passengers';
import TravelDate from './pages/TravelDate.tsx';
import ChooseRoute from './pages/ChooseRoute.tsx';
import Cabin from './pages/CabinPage.tsx';
import Profile from './pages/ProfilePage';
import MealPackage from './pages/MealPackage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import PassengerDetails from './pages/PassengerDetails.tsx';
import Summary from './pages/Summary.tsx';
import Choosepayment from './pages/ChoosePayment.tsx';
import Payment from './pages/Payment.tsx';
import Confirmation from './pages/Confirmation.tsx';
import { InactivityProvider } from './contexts/InActivityTracker.tsx';

const App = () => {
  return (
    <Router>
      <InactivityProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrerPage />} />
          <Route path="/departure" element={<Departure />} />
          <Route path="/destination" element={<Destination />} />
          <Route path="/passengers" element={<Passengers />} />
          <Route path="/traveldate" element={<TravelDate />} />
          <Route path="/chooseroute" element={<ChooseRoute />} />
          <Route path="/mealpackage" element={<MealPackage />} />
          <Route path="/cabin" element={<Cabin />} />
          <Route path="/passengerdetails" element={<PassengerDetails />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/choosepayment" element={<Choosepayment />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/confirmation" element={<Confirmation />} />
          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </InactivityProvider>
    </Router>
  );
};

export default App;
