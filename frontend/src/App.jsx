import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AuthModal from './components/auth/AuthModal';
import Home from './pages/Home';
import StateDetail from './pages/StateDetail';
import Favorites from './pages/Favorites';
import About from './pages/About';
import Packages from './pages/Packages';
import Hotels from './pages/Hotels';
import MyTrips from './pages/MyTrips';
import Admin from './pages/Admin';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen min-h-dvh flex flex-col bg-[#020617] text-white">
          <Toaster position="top-center" toastOptions={{ style: { background: '#1e293b', color: '#fff', borderRadius: '1rem', fontSize: '0.85rem' } }} />
          <Navbar />
          <AuthModal />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/state/:id" element={<StateDetail />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/about" element={<About />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/hotels" element={<Hotels />} />
              <Route path="/mytrips" element={<MyTrips />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;