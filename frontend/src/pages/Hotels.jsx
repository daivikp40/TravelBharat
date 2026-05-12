import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Wifi, Dumbbell, Utensils, X, Check, CreditCard, Phone, ChevronRight, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { HOTELS_DATA } from '../data/statesData';

const ALL_STATES = ['All', ...new Set(HOTELS_DATA.map(h => h.state))];
const ALL_TYPES = ['All', 'Luxury', 'Heritage Luxury', 'Resort', 'Mountain Retreat', 'Beach Resort', 'Boutique'];

const Stars = ({ n }) => (
  <span className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => (
    <Star key={i} size={11} className={i < n ? 'text-amber-400 fill-amber-400' : 'text-gray-700 fill-gray-700'} />
  ))}</span>
);

const PaymentModal = ({ hotel, nights, onClose }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', checkin: '', card: '', expiry: '', cvv: '' });
  const [done, setDone] = useState(false);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const total = hotel.price * nights;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div className="modal-box" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-white/8">
          <div>
            <h2 className="text-lg font-black italic uppercase text-white">{hotel.name}</h2>
            <p className="text-xs text-gray-500">{hotel.location} · {nights} night{nights > 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:text-white"><X size={20} /></button>
        </div>
        <div className="px-8 py-6">
          {done ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-black uppercase italic text-white mb-2">Booking Confirmed!</h3>
              <p className="text-gray-400 text-sm mb-1">Booking ID: <span className="text-indigo-400 font-bold">HTL{Date.now().toString().slice(-6)}</span></p>
              <p className="text-gray-500 text-xs mb-5">Confirmation sent to {form.email}</p>
              <div className="bg-white/3 border border-white/8 rounded-xl p-4 text-sm space-y-2 mb-5 text-left">
                <div className="flex justify-between"><span className="text-gray-400">Hotel</span><span className="font-bold">{hotel.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Check-in</span><span className="font-bold">{form.checkin}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Nights</span><span className="font-bold">{nights}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Total</span><span className="font-black text-emerald-400">₹{total.toLocaleString()}</span></div>
              </div>
              <button onClick={onClose} className="btn-primary">Done</button>
            </div>
          ) : (
            <form onSubmit={async e => {
              e.preventDefault();
              if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/.test(form.email)) {
                toast.error('Please enter a valid email (e.g. name@example.com)'); return;
              }
              const emailTld = form.email.split('.').pop().toLowerCase();
              const badTLDs = ['con', 'cmo', 'ocm', 'nrt', 'ogr', 'ner', 'coj', 'vom', 'xom', 'gml', 'cm'];
              if (badTLDs.includes(emailTld)) {
                toast.error(`Did you mean .com? ".${emailTld}" is not a valid domain`); return;
              }
              const cleanPh = form.phone.replace(/[\s-]/g, '');
              if (!/^(\+91)?[6-9]\d{9}$/.test(cleanPh)) {
                toast.error('Please enter a valid 10-digit phone number (e.g. +91 98765 43210)'); return;
              }
              try {
                const userStr = localStorage.getItem('tb_user');
                if (!userStr) {
                  toast.error("Please login first to book.");
                  return;
                }
                const user = JSON.parse(userStr);
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bookings`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
                  body: JSON.stringify({
                    itemType: 'Hotel',
                    itemId: hotel._id || hotel.id,
                    itemName: hotel.name,
                    guests: 2,
                    date: form.checkin,
                    totalAmount: total,
                    userName: form.name,
                    userPhone: form.phone,
                    userEmail: form.email
                  })
                });
                if (!res.ok) {
                  const errData = await res.json();
                  throw new Error(errData.message || 'Booking failed');
                }
                setDone(true);
                toast.success("Hotel booked successfully!");
              } catch (err) {
                console.error(err);
                toast.error(err.message || "Failed to book hotel. Please try again.");
              }
            }} className="space-y-4">
              <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 mb-4">
                <button type="button" onClick={() => setForm({ ...form, method: 'card' })} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${form.method !== 'upi' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Credit Card</button>
                <button type="button" onClick={() => setForm({ ...form, method: 'upi' })} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${form.method === 'upi' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>UPI (QR Code)</button>
              </div>

              {form.method === 'upi' ? (
                <div className="bg-white/3 border border-white/8 rounded-2xl p-6 flex flex-col items-center text-center">
                  <div className="bg-white p-3 rounded-2xl mb-4">
                    <QRCode value={`upi://pay?pa=travelbharat@upi&pn=TravelBharat&am=${total}&cu=INR`} size={150} level="H" />
                  </div>
                  <p className="text-white font-bold mb-1">Scan to Pay ₹{total.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Use any UPI app (GPay, PhonePe, Paytm)</p>
                </div>
              ) : (
                <>
                  <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-3 flex items-center gap-2 mb-2">
                    <CreditCard size={16} className="text-indigo-400" /><span className="text-xs text-gray-300">Secure SSL Payment</span>
                  </div>
                  <div><label className="input-label">Card Number</label><input type="text" placeholder="4111 1111 1111 1111" maxLength={19} value={form.card} onChange={set('card')} className="input-field" required /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="input-label">Expiry</label><input type="text" placeholder="MM/YY" maxLength={5} value={form.expiry} onChange={set('expiry')} className="input-field" required /></div>
                    <div><label className="input-label">CVV</label><input type="text" placeholder="•••" maxLength={3} value={form.cvv} onChange={set('cvv')} className="input-field" required /></div>
                  </div>
                </>
              )}

              {[['name', 'Full Name', 'text', 'John Doe'], ['email', 'Email', 'email', 'john@example.com'], ['phone', 'Phone', 'tel', '+91 98765 43210'], ['checkin', 'Check-in Date', 'date', '']].map(([k, l, t, ph]) => (
                <div key={k} className="mt-2"><label className="input-label">{l}</label><input type={t} placeholder={ph} value={form[k]} onChange={set(k)} className="input-field" required /></div>
              ))}

              <div className="bg-white/3 border border-white/8 rounded-xl p-4 text-sm mt-4">
                <div className="flex justify-between mb-1"><span className="text-gray-400">{nights} night{nights > 1 ? 's' : ''} × ₹{hotel.price.toLocaleString()}</span><span>₹{total.toLocaleString()}</span></div>
                <div className="flex justify-between font-black pt-2 border-t border-white/8"><span>Total</span><span className="text-emerald-400">₹{total.toLocaleString()}</span></div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center mt-4">Confirm & Pay ₹{total.toLocaleString()}</button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const HotelCard = ({ hotel, onBook }) => {
  const [nights, setNights] = useState(2);
  return (
    <div className="hotel-card">
      <div className="relative h-52 overflow-hidden">
        <img src={hotel.image} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" alt={hotel.name}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060f23] to-transparent" />
        <div className="absolute top-4 left-4 badge badge-amber">{hotel.tag}</div>
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-xl">
          <Stars n={hotel.stars} />
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-black text-lg text-white">{hotel.name}</h3>
          <span className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
            <Star size={10} className="fill-amber-400 text-amber-400" /> {hotel.rating}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-3">{hotel.location}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hotel.amenities.slice(0, 4).map(a => <span key={a} className="text-[10px] bg-white/5 border border-white/8 px-2 py-0.5 rounded-full text-gray-400">{a}</span>)}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <label className="text-xs text-gray-500">Nights:</label>
          <select value={nights} onChange={e => setNights(Number(e.target.value))} className="input-field !py-1.5 !px-3 text-xs w-24">
            {[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">per night from</p>
            <p className="text-xl font-black text-white">₹{hotel.price.toLocaleString()}</p>
            <p className="text-xs text-emerald-400">{nights} nights = ₹{(hotel.price * nights).toLocaleString()}</p>
          </div>
          <button onClick={() => onBook(hotel, nights)} className="btn-primary">Book Now</button>
        </div>
      </div>
    </div>
  );
};

const Hotels = () => {
  const [stateFilter, setStateFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = HOTELS_DATA.filter(h =>
    (stateFilter === 'All' || h.state === stateFilter) &&
    (typeFilter === 'All' || h.type === typeFilter)
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-14 relative">
      {/* Hero */}
      <div className="relative rounded-[2.5rem] overflow-hidden mb-12 h-56">
        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80" className="w-full h-full object-cover" alt="Hotels" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/95 via-[#020617]/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-12">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-2">Premium Hotels</h1>
          <p className="text-gray-300 italic">Handpicked luxury stays · Best rate guaranteed · Free cancellation</p>
        </div>
      </div>

      {/* Contact */}
      <div className="flex flex-wrap gap-4 mb-10">
        {[
          { icon: Phone, text: '+91-1800-HOTEL-TB (24/7)', textClass: 'text-emerald-400' },
          { icon: Filter, text: `${filtered.length} properties available`, textClass: 'text-indigo-400' },
        ].map(({ icon: Icon, text, textClass }) => (
          <div key={text} className="glass-card flex items-center gap-3 px-5 py-3">
            <Icon size={16} className={textClass} /> <span className="text-sm text-gray-300">{text}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex flex-wrap gap-2">
          {ALL_STATES.map(s => <button key={s} onClick={() => setStateFilter(s)} className={`tab-btn ${stateFilter === s ? 'active' : ''}`}>{s}</button>)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((h, i) => (
          <motion.div key={h.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <HotelCard hotel={h} onBook={(hotel, nights) => setSelected({ hotel, nights })} />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && <PaymentModal hotel={selected.hotel} nights={selected.nights} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </main>
  );
};

export default Hotels;
