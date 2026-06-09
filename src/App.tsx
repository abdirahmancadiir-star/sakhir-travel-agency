import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Tours from './pages/Tours'
import Hotels from './pages/Hotels'
import Visa from './pages/Visa'
import Contact from './pages/Contact'
import Flights from './pages/Flights'
import Cargo from './pages/Cargo'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import Bookings from './pages/Bookings'
import TourDetail from './pages/TourDetail'
import HotelDetail from './pages/HotelDetail'
import FlightBooking from './pages/FlightBooking'
import CargoBooking from './pages/CargoBooking'
import TrackBooking from './pages/TrackBooking'
import Payments from './pages/Payments'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="tours" element={<Tours />} />
              <Route path="tour/:id" element={<TourDetail />} />
              <Route path="hotels" element={<Hotels />} />
              <Route path="hotel/:id" element={<HotelDetail />} />
              <Route path="visa" element={<Visa />} />
              <Route path="contact" element={<Contact />} />
              <Route path="flights" element={<Flights />} />
              <Route path="flight" element={<FlightBooking />} />
              <Route path="cargo" element={<Cargo />} />
              <Route path="cargo-request" element={<CargoBooking />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="dashboard" element={<CustomerDashboard />} />
              <Route path="customer-dashboard" element={<CustomerDashboard />} />
              <Route path="payments" element={<Payments />} />
              <Route path="track-booking" element={<TrackBooking />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/hotel-booking" element={<Hotels />} />
            <Route path="/visa-services" element={<Visa />} />
            <Route path="/cargo-services" element={<Cargo />} />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
