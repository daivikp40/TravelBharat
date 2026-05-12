import { Link } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';

const NotFound = () => (
    <div className="not-found-page">
        <MapPin size={64} className="text-indigo-500/30 mb-6" />
        <h1 className="text-5xl sm:text-7xl font-black italic uppercase tracking-tighter text-white mb-4">404</h1>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-400 mb-2">Page Not Found</h2>
        <p className="text-gray-500 italic mb-8 max-w-md">
            The destination you're looking for doesn't exist. Let's get you back on track!
        </p>
        <Link to="/" className="btn-primary">
            <ArrowLeft size={16} /> Back to Home
        </Link>
    </div>
);

export default NotFound;
