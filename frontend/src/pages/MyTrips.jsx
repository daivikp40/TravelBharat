import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Hotel, Calendar, Users, IndianRupee, ShieldCheck, X, Download, MapPin, Clock, CreditCard, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  Confirmed: { class: 'badge-emerald', icon: CheckCircle, color: 'text-emerald-400' },
  Pending: { class: 'badge-amber', icon: AlertCircle, color: 'text-amber-400' },
  Cancelled: { class: 'badge-red', icon: XCircle, color: 'text-red-400' },
};

// Booking Detail Modal
const BookingDetailModal = ({ booking, onClose, onCancel }) => {
  if (!booking) return null;
  const st = STATUS_CONFIG[booking.status] || STATUS_CONFIG.Pending;
  const StatusIcon = st.icon;

  const handlePrint = () => {
    const win = window.open('', '_blank');
    win.document.write(`
      <html><head><title>Booking ${booking.bookingId}</title>
      <style>body{font-family:system-ui;padding:40px;max-width:600px;margin:auto}
      h1{color:#4f46e5}table{width:100%;border-collapse:collapse;margin:20px 0}
      td{padding:8px 12px;border-bottom:1px solid #eee}td:first-child{font-weight:700;color:#666;width:40%}
      .badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700}
      .Confirmed{background:#d1fae5;color:#047857}.Pending{background:#fef3c7;color:#92400e}.Cancelled{background:#fee2e2;color:#b91c1c}
      </style></head><body>
      <h1>🌏 TravelBharat</h1><h2>Booking Confirmation</h2>
      <table>
        <tr><td>Booking ID</td><td>${booking.bookingId}</td></tr>
        <tr><td>Type</td><td>${booking.itemType}</td></tr>
        <tr><td>Name</td><td>${booking.itemName}</td></tr>
        <tr><td>Date</td><td>${new Date(booking.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
        <tr><td>Guests</td><td>${booking.guests}</td></tr>
        <tr><td>Total</td><td>₹${booking.totalAmount?.toLocaleString()}</td></tr>
        <tr><td>Status</td><td><span class="badge ${booking.status}">${booking.status}</span></td></tr>
        <tr><td>Booked On</td><td>${new Date(booking.createdAt).toLocaleDateString('en-IN')}</td></tr>
      </table>
      <p style="color:#999;margin-top:30px;font-size:12px">Thank you for choosing TravelBharat! For support, call 1800-TRAVEL-TB</p>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div
        initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={e => e.stopPropagation()}
        className="booking-detail-modal relative w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] max-h-[90dvh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#060f23] z-10 flex items-center justify-between px-5 sm:px-6 pt-5 pb-4 border-b border-white/5">
          <div>
            <h2 className="text-lg sm:text-xl font-black italic uppercase text-white">Booking Details</h2>
            <p className="text-[10px] sm:text-xs text-gray-500 font-mono mt-0.5">{booking.bookingId}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Status Banner */}
          <div className={`flex items-center gap-3 p-4 rounded-2xl ${booking.status === 'Confirmed' ? 'bg-emerald-500/10 border border-emerald-500/20' : booking.status === 'Cancelled' ? 'bg-red-500/10 border border-red-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
            <StatusIcon size={24} className={st.color} />
            <div>
              <p className={`font-black text-sm ${st.color}`}>{booking.status}</p>
              <p className="text-[10px] sm:text-xs text-gray-500">Last updated: {new Date(booking.updatedAt || booking.createdAt).toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          {/* Property Info */}
          <div className="glass-card p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shrink-0">
                {booking.itemType === 'Package' ? <Package size={22} className="text-indigo-400" /> : <Hotel size={22} className="text-amber-400" />}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mb-0.5">{booking.itemType}</p>
                <h3 className="font-black text-base sm:text-lg text-white leading-tight">{booking.itemName}</h3>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Calendar, label: 'Date', value: new Date(booking.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }), color: 'indigo' },
              { icon: Users, label: 'Guests', value: `${booking.guests} Person${booking.guests > 1 ? 's' : ''}`, color: 'purple' },
              { icon: Clock, label: 'Booked On', value: new Date(booking.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }), color: 'blue' },
              { icon: CreditCard, label: 'Payment', value: 'Paid', color: 'emerald' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white/3 border border-white/5 rounded-xl p-3 sm:p-4">
                <Icon size={14} className={`text-${color}-400 mb-1.5`} />
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</p>
                <p className="text-xs sm:text-sm font-bold text-white mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest">Total Amount</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">₹{booking.totalAmount?.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] sm:text-xs text-gray-500">Taxes & Fees</p>
              <p className="text-xs sm:text-sm font-bold text-emerald-300">Included</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            <button onClick={handlePrint} className="btn-primary flex-1 !py-3">
              <Download size={14} /> Download Receipt
            </button>
            {booking.status !== 'Cancelled' && (
              <button onClick={() => { onCancel(booking._id); onClose(); }} className="flex-1 py-3 px-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-xs uppercase tracking-widest hover:bg-red-500/20 transition-all text-center">
                Cancel Booking
              </button>
            )}
          </div>

          {/* Support */}
          <div className="flex items-center gap-3 bg-white/3 border border-white/5 rounded-xl p-3 sm:p-4">
            <Phone size={14} className="text-indigo-400 shrink-0" />
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500">Need help? Call us 24/7</p>
              <a href="tel:1800-TRAVEL-TB" className="text-xs sm:text-sm font-bold text-indigo-400 hover:text-indigo-300">1800-TRAVEL-TB</a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const MyTrips = () => {
  const { user, setAuthModalOpen } = useApp();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (!user) {
      setAuthModalOpen(true);
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const { data } = await axios.get('import.meta.env.VITE_API_URL/api/bookings/my', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancel = async (id) => {
    try {
      await axios.patch(`import.meta.env.VITE_API_URL/api/bookings/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setBookings(bs => bs.map(b => b._id === id ? { ...b, status: 'Cancelled' } : b));
      toast.success('Booking cancelled successfully');
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  const filteredBookings = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);

  if (!user) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
      <p className="text-lg sm:text-xl text-gray-500">Please login to view your trips.</p>
    </div>
  );

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14 min-h-[70vh]">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black italic uppercase text-white mb-1 sm:mb-2">My Trips</h1>
          <p className="text-gray-400 text-sm">Manage your upcoming and past bookings.</p>
        </div>
        {bookings.length > 0 && (
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1">
            {['All', 'Confirmed', 'Pending', 'Cancelled'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all shrink-0 ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 border border-white/5 hover:text-white'}`}>
                {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {bookings.length === 0 ? (
        <div className="glass-card p-10 sm:p-12 text-center">
          <Package size={40} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg sm:text-xl font-bold text-white mb-2">No trips booked yet!</h3>
          <p className="text-gray-500 text-sm">Looks like you haven't booked any packages or hotels. Start exploring India today!</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <p className="text-gray-500 italic">No {filter.toLowerCase()} bookings found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredBookings.map((b, i) => (
            <motion.div key={b._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="glass-card p-4 sm:p-6 flex flex-col relative overflow-hidden cursor-pointer group"
              onClick={() => setSelected(b)}>
              <div className="absolute -right-4 -top-4 w-20 sm:w-24 h-20 sm:h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className={`badge ${b.status === 'Confirmed' ? 'badge-emerald' : b.status === 'Pending' ? 'badge-amber' : 'badge-red'}`}>
                  {b.status}
                </span>
                <span className="text-[10px] sm:text-xs font-mono text-gray-500">{b.bookingId}</span>
              </div>

              <div className="flex items-start gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-2 sm:p-2.5 rounded-xl bg-white/5 border border-white/10 shrink-0">
                  {b.itemType === 'Package' ? <Package size={18} className="text-indigo-400" /> : <Hotel size={18} className="text-amber-400" />}
                </div>
                <div className="min-w-0">
                  <h3 className="font-black text-sm sm:text-lg text-white leading-tight mb-0.5 sm:mb-1 truncate">{b.itemName}</h3>
                  <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-widest">{b.itemType}</p>
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6 flex-1">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                  <Calendar size={13} className="text-gray-500 shrink-0" /> {new Date(b.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
                  <Users size={13} className="text-gray-500 shrink-0" /> {b.guests} Guest{b.guests > 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-emerald-400 mt-1.5 sm:mt-2">
                  <IndianRupee size={14} /> {b.totalAmount?.toLocaleString()}
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500">
                  <ShieldCheck size={13} className="text-indigo-400" /> Secure Booking
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-indigo-400 group-hover:text-white transition-colors">View Details →</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && <BookingDetailModal booking={selected} onClose={() => setSelected(null)} onCancel={handleCancel} />}
      </AnimatePresence>
    </div>
  );
};

export default MyTrips;
