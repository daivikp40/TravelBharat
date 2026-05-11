import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Users, Check, X, Package, ChevronRight, CreditCard, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { HOLIDAY_PACKAGES } from '../data/statesData';

const CATS = ['All', 'Heritage', 'Nature', 'Beach', 'Adventure'];

const BADGE = { amber: 'badge badge-amber', emerald: 'badge badge-emerald', red: 'badge badge-red', blue: 'badge badge-blue', purple: 'badge badge-purple', indigo: 'badge badge-indigo' };

const BookingModal = ({ pkg, onClose }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', email: '', phone: '', guests: '2', date: '', card: '', expiry: '', cvv: '' });
  const [paid, setPaid] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
  const total = pkg.price * parseInt(form.guests || 1);

  const handlePay = async e => {
    e.preventDefault();
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
          itemType: 'Package',
          itemId: pkg._id || pkg.id,
          itemName: pkg.title,
          guests: form.guests,
          date: form.date,
          totalAmount: total,
          userName: form.name,
          userPhone: form.phone,
          userEmail: form.email
        })
      });
      const data = await res.json();
      setBookingResult(data);
      setPaid(true);
      toast.success("Booking confirmed!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to book package. Please try again.");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div className="modal-box" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-5 border-b border-white/8">
          <div>
            <h2 className="text-xl font-black italic uppercase text-white">{pkg.title}</h2>
            <p className="text-xs text-gray-500 mt-1">{pkg.duration}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/8 transition-all"><X size={20} /></button>
        </div>

        {/* Steps indicator */}
        {!paid && (
          <div className="flex items-center gap-3 px-8 py-5 border-b border-white/5">
            {['Details', 'Payment'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-indigo-600 text-white' : 'bg-white/8 text-gray-500'}`}>{step > i + 1 ? <Check size={12} /> : i + 1}</div>
                <span className={`text-xs font-bold ${step === i + 1 ? 'text-white' : 'text-gray-500'}`}>{s}</span>
                {i < 1 && <ChevronRight size={14} className="text-gray-600" />}
              </div>
            ))}
          </div>
        )}

        <div className="px-8 py-6">
          {paid ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <Check size={36} className="text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black uppercase italic text-white mb-2">Booking Confirmed!</h3>
              <p className="text-gray-400 italic mb-1">Thank you, {form.name}!</p>
              <p className="text-gray-500 text-sm mb-5">Booking ID: <span className="text-indigo-400 font-bold">{bookingResult?.bookingId || `TB${Date.now().toString().slice(-6)}`}</span></p>

              {/* Full booking details */}
              <div className="bg-white/5 border border-white/8 rounded-2xl p-5 text-left space-y-2.5 mb-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-3">📋 Booking Details</h4>
                {[['Package', pkg.title], ['Duration', pkg.duration], ['Category', pkg.category], ['Name', form.name], ['Email', form.email], ['Phone', form.phone], ['Guests', form.guests], ['Travel Date', form.date], ['Status', bookingResult?.status || 'Confirmed']].map(([l, v]) => (
                  <div key={l} className="flex justify-between text-sm"><span className="text-gray-500">{l}</span><span className={`font-bold ${l === 'Status' ? 'text-emerald-400' : 'text-white'}`}>{v}</span></div>
                ))}
                <div className="border-t border-white/8 pt-2 mt-2" />
                <div className="flex justify-between text-sm"><span className="text-gray-400 font-bold">Total Paid</span><span className="font-black text-emerald-400 text-lg">₹{total.toLocaleString()}</span></div>
              </div>

              {/* Package highlights */}
              <div className="bg-white/3 border border-white/5 rounded-2xl p-4 text-left mb-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-2">✨ What's Included</h4>
                <div className="flex flex-wrap gap-1.5">
                  {pkg.includes.map(item => <span key={item} className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1"><Check size={8} />{item}</span>)}
                </div>
              </div>
              <div className="bg-white/3 border border-white/5 rounded-2xl p-4 text-left mb-5">
                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-2">📍 Highlights</h4>
                <div className="flex flex-wrap gap-1.5">
                  {pkg.highlights.map(h => <span key={h} className="text-[10px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-full">{h}</span>)}
                </div>
              </div>

              <div className="text-xs text-gray-500 italic mb-4">Confirmation sent to {form.email}</div>
              <button onClick={onClose} className="btn-primary">Done</button>
            </motion.div>
          ) : step === 1 ? (
            <div className="space-y-4">
              <div className="bg-white/3 border border-white/8 rounded-2xl p-5 mb-5">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-gray-400">Price per person</span>
                  <span className="font-black text-white">₹{pkg.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <label className="input-label !mb-0 shrink-0">Guests</label>
                  <select value={form.guests} onChange={set('guests')} className="input-field !py-2">
                    {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'persons'}</option>)}
                  </select>
                </div>
                <div className="flex justify-between text-sm mt-3 pt-3 border-t border-white/8">
                  <span className="text-gray-400 font-bold">Total</span>
                  <span className="font-black text-emerald-400 text-lg">₹{total.toLocaleString()}</span>
                </div>
              </div>

              {[['name', 'Full Name', 'text', 'John Doe'], ['email', 'Email', 'email', 'john@example.com'], ['phone', 'Phone Number', 'tel', '+91 98765 43210'], ['date', 'Travel Date', 'date', '']].map(([k, l, t, ph]) => (
                <div key={k}>
                  <label className="input-label">{l}</label>
                  <input type={t} placeholder={ph} value={form[k]} onChange={set(k)} className="input-field" required />
                </div>
              ))}
              <button onClick={() => setStep(2)} disabled={!form.name || !form.email || !form.phone || !form.date} className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed mt-2">
                Continue to Payment <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            <form onSubmit={handlePay} className="space-y-4">
              {/* Payment Method Tabs */}
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
                  <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-4 flex items-center gap-3 mb-5">
                    <CreditCard size={20} className="text-indigo-400" />
                    <span className="text-sm text-gray-300">Secure SSL Payment · 256-bit Encrypted</span>
                  </div>
                  <div>
                    <label className="input-label">Card Number</label>
                    <input type="text" placeholder="4111 1111 1111 1111" maxLength={19} value={form.card} onChange={set('card')} className="input-field" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Expiry</label>
                      <input type="text" placeholder="MM/YY" maxLength={5} value={form.expiry} onChange={set('expiry')} className="input-field" required />
                    </div>
                    <div>
                      <label className="input-label">CVV</label>
                      <input type="text" placeholder="•••" maxLength={3} value={form.cvv} onChange={set('cvv')} className="input-field" required />
                    </div>
                  </div>
                </>
              )}

              <div className="bg-white/3 border border-white/8 rounded-2xl p-4 mt-4">
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-400">{form.guests} × ₹{pkg.price.toLocaleString()}</span><span>₹{total.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400">Taxes & Fees</span><span className="text-emerald-400">Included</span></div>
                <div className="flex justify-between font-black text-lg mt-2 pt-2 border-t border-white/8"><span>Total</span><span className="text-emerald-400">₹{total.toLocaleString()}</span></div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-ghost">Back</button>
                <button type="submit" className="btn-primary flex-1 justify-center">Pay ₹{total.toLocaleString()} Now</button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const Packages = () => {
  const [cat, setCat] = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = cat === 'All' ? HOLIDAY_PACKAGES : HOLIDAY_PACKAGES.filter(p => p.category === cat);

  return (
    <main className="max-w-7xl mx-auto px-6 py-14">
      {/* Hero Banner */}
      <div className="relative rounded-[2.5rem] overflow-hidden mb-14 h-64">
        <img src="https://images.unsplash.com/photo-1524492707947-54b2bb40a516?w=1600&q=80" className="w-full h-full object-cover" alt="Packages" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/95 via-[#020617]/70 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-12">
          <div className="badge badge-amber mb-4"><Package size={10} /> Holiday Packages</div>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-2">Curated Journeys</h1>
          <p className="text-gray-300 italic">All-inclusive packages · Best price guaranteed · 24/7 support</p>
        </div>
      </div>

      {/* Support Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: Phone, label: 'Helpline', value: '+91-1800-123-4567', sub: 'Mon–Sat 9AM–8PM', color: 'emerald' },
          { icon: Mail, label: 'Email Us', value: 'packages@travelbharat.in', sub: 'Reply within 2 hours', color: 'indigo' },
          { icon: Users, label: 'Group Bookings', value: '10+ people?', sub: 'Get special rates', color: 'amber' },
        ].map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className={`glass-card p-5 flex items-center gap-4`}>
            <div className={`p-3 rounded-2xl badge-${color} bg-opacity-20`}><Icon size={20} className={`text-${color}-400`} /></div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest">{label}</p>
              <p className="font-bold text-white text-sm">{value}</p>
              <p className="text-xs text-gray-500">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category Tabs */}
      <div className="tab-bar mb-10">
        {CATS.map(c => <button key={c} onClick={() => setCat(c)} className={`tab-btn ${cat === c ? 'active' : ''}`}>{c}</button>)}
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((pkg, i) => (
          <motion.div key={pkg.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="package-card">
            <div className="relative h-52 overflow-hidden">
              <img src={pkg.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={pkg.title}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1524492707947-54b2bb40a516?w=800&q=80'; }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060f23] via-transparent to-transparent" />
              <div className={`absolute top-4 left-4 ${BADGE[pkg.badgeColor] || 'badge badge-indigo'}`}>{pkg.badge}</div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-2xl font-black italic uppercase text-white">{pkg.title}</h3>
                <p className="text-gray-300 text-sm">{pkg.subtitle}</p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1"><Clock size={12} /> {pkg.duration}</span>
                <span className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" /> {pkg.rating} ({pkg.reviews.toLocaleString()})</span>
              </div>
              <ul className="space-y-1.5 mb-5">
                {pkg.includes.map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs text-gray-400">
                    <Check size={12} className="text-emerald-400 shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {pkg.highlights.map(h => <span key={h} className="text-[10px] bg-white/5 border border-white/8 px-2.5 py-1 rounded-full text-gray-400">{h}</span>)}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-gray-500 text-xs line-through">₹{pkg.originalPrice.toLocaleString()}</p>
                  <p className="text-2xl font-black text-white">₹{pkg.price.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/person</span></p>
                </div>
                <button onClick={() => setSelected(pkg)} className="btn-primary">Book Now</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && <BookingModal pkg={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </main>
  );
};

export default Packages;
