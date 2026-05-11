import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Map, Package, Hotel, Users, Star, TrendingUp,
  Eye, Plus, Trash2, Edit, Check, X, Shield, Globe, Activity,
  Phone, Mail, Calendar, ShoppingBag, IndianRupee, UserCheck
} from 'lucide-react';
import { STATES_STATIC, HOLIDAY_PACKAGES, HOTELS_DATA } from '../data/statesData';
import { useApp } from '../context/AppContext';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: ShoppingBag },
  { id: 'states', label: 'States', icon: Globe },
  { id: 'packages', label: 'Packages', icon: Package },
  { id: 'hotels', label: 'Hotels', icon: Hotel },
];

const STATUS_STYLE = {
  Confirmed: 'badge badge-emerald',
  Pending: 'badge badge-amber',
  Cancelled: 'badge badge-red',
};

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="glass-card p-6">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl bg-${color}-500/10 border border-${color}-500/20`}>
        <Icon size={22} className={`text-${color}-400`} />
      </div>
      <span className="text-xs text-gray-500">{sub}</span>
    </div>
    <p className={`text-4xl font-black text-${color}-400 mb-1`}>{value}</p>
    <p className="text-xs text-gray-500 uppercase tracking-widest">{label}</p>
  </div>
);

// ─── BOOKINGS TAB (fetches real data from API) ───
const BookingsTab = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (!user?.token) return;
    const headers = { Authorization: `Bearer ${user.token}` };
    Promise.all([
      fetch('import.meta.env.VITE_API_URL/api/bookings/admin/all', { headers }).then(r => r.json()),
      fetch('import.meta.env.VITE_API_URL/api/bookings/admin/stats', { headers }).then(r => r.json()),
    ])
      .then(([bk, st]) => {
        setBookings(Array.isArray(bk) ? bk : []);
        setStats(st?.totalBookings !== undefined ? st : null);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);

  if (loading) return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>;

  return (
    <div className="space-y-8">
      {/* Stats cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total Bookings" value={stats.totalBookings} icon={ShoppingBag} color="indigo" sub="All time" />
          <StatCard label="Total Revenue" value={`₹${(stats.totalRevenue || 0).toLocaleString()}`} icon={IndianRupee} color="emerald" sub="All time" />
          <StatCard label="Confirmed" value={stats.confirmedBookings} icon={Check} color="emerald" sub={`${stats.pendingBookings} pending`} />
          <StatCard label="Cancelled" value={stats.cancelledBookings} icon={X} color="red" sub="Refund processed" />
        </div>
      )}

      {/* Package-wise breakdown */}
      {stats?.bookingsByPackage?.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-black uppercase italic text-white mb-5 flex items-center gap-2"><Package size={18} className="text-amber-400" /> Bookings by Package</h3>
          <div className="space-y-3">
            {stats.bookingsByPackage.map(p => (
              <div key={p._id} className="flex items-center gap-4 p-4 bg-white/3 rounded-2xl border border-white/5">
                <div className="flex-1">
                  <p className="font-bold text-white">{p._id}</p>
                  <p className="text-xs text-gray-500">{p.count} bookings · {p.totalGuests} guests</p>
                </div>
                <p className="font-black text-emerald-400">₹{p.totalRevenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All bookings table */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h3 className="text-lg font-black uppercase italic text-white flex items-center gap-2"><Users size={18} className="text-indigo-400" /> All Bookings — Buyer Details</h3>
          <div className="flex gap-1.5">
            {['All', 'Confirmed', 'Pending', 'Cancelled'].map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === s ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}>{s}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500 italic">No bookings found{filter !== 'All' ? ` with status "${filter}"` : '. Bookings will appear here when users purchase packages.'}.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500 uppercase tracking-widest border-b border-white/5">
                  <th className="text-left pb-3 pr-3">Booking ID</th>
                  <th className="text-left pb-3 pr-3">User Name</th>
                  <th className="text-left pb-3 pr-3">Mobile</th>
                  <th className="text-left pb-3 pr-3 hidden md:table-cell">Email</th>
                  <th className="text-left pb-3 pr-3">Package</th>
                  <th className="text-left pb-3 pr-3 hidden md:table-cell">Guests</th>
                  <th className="text-left pb-3 pr-3">Amount</th>
                  <th className="text-left pb-3 pr-3">Status</th>
                  <th className="text-left pb-3 hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(b => (
                  <tr key={b._id} className="hover:bg-white/3 transition-all">
                    <td className="py-3 pr-3 font-mono text-indigo-400 text-xs">{b.bookingId}</td>
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-black shrink-0">
                          {(b.userName || b.user?.name || 'U').charAt(0)}
                        </div>
                        <span className="font-bold text-white text-xs">{b.userName || b.user?.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <Phone size={10} />{b.userPhone || b.user?.phone || '—'}
                      </span>
                    </td>
                    <td className="py-3 pr-3 text-gray-400 text-xs hidden md:table-cell">{b.userEmail || b.user?.email || '—'}</td>
                    <td className="py-3 pr-3 font-bold text-white text-xs">{b.itemName}</td>
                    <td className="py-3 pr-3 text-gray-400 hidden md:table-cell">{b.guests}</td>
                    <td className="py-3 pr-3 text-emerald-400 font-bold">₹{b.totalAmount?.toLocaleString()}</td>
                    <td className="py-3 pr-3"><span className={STATUS_STYLE[b.status] || 'badge badge-indigo'}>{b.status}</span></td>
                    <td className="py-3 text-gray-500 text-xs hidden lg:table-cell">{new Date(b.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4 text-xs text-gray-600 italic">Showing {filtered.length} of {bookings.length} total bookings</div>
      </div>
    </div>
  );
};

const Overview = ({ user }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {[
        { label: 'Total States', value: STATES_STATIC.length, icon: Map, color: 'indigo', sub: '+2 this month' },
        { label: 'Packages', value: HOLIDAY_PACKAGES.length, icon: Package, color: 'amber', sub: 'Active listings' },
        { label: 'Hotels', value: HOTELS_DATA.length, icon: Hotel, color: 'emerald', sub: 'Verified properties' },
        { label: 'Total Visitors', value: '2.4M+', icon: Users, color: 'purple', sub: '+18% this season' },
      ].map(s => <StatCard key={s.label} {...s} />)}
    </div>

    {/* Quick bookings preview */}
    <BookingsTab user={user} />
  </div>
);

const StatesTable = () => (
  <div className="glass-card p-6">
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-lg font-black uppercase italic text-white">All States</h3>
      <button className="btn-primary !py-2 !px-4 text-xs"><Plus size={14} /> Add State</button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-gray-500 uppercase tracking-widest border-b border-white/5">
            {['State', 'Region', 'Rating', 'Visitors', 'Safety', 'Actions'].map(h => (
              <th key={h} className="text-left pb-3 pr-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {STATES_STATIC.map(s => (
            <tr key={s._id} className="hover:bg-white/3 transition-all">
              <td className="py-3 pr-4">
                <div className="flex items-center gap-3">
                  <img src={s.imageUrl} className="w-10 h-10 rounded-xl object-cover" alt={s.name}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1524492707947-54b2bb40a516?w=100&q=60'; }} />
                  <div><p className="font-bold text-white">{s.name}</p><p className="text-xs text-gray-500">{s.capital}</p></div>
                </div>
              </td>
              <td className="py-3 pr-4"><span className="badge badge-indigo">{s.region}</span></td>
              <td className="py-3 pr-4 text-amber-400 font-bold">⭐ {s.rating}</td>
              <td className="py-3 pr-4 text-gray-400">{s.visitors}</td>
              <td className="py-3 pr-4">
                <span className={`badge ${s.rating >= 4.6 ? 'badge-emerald' : s.rating >= 4.3 ? 'badge-amber' : 'badge-red'}`}>
                  {s.rating >= 4.6 ? '✓ Safe' : s.rating >= 4.3 ? '⚠ Caution' : 'Alert'}
                </span>
              </td>
              <td className="py-3 pr-4">
                <div className="flex gap-2">
                  <button className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"><Edit size={14} /></button>
                  <button className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const PackagesTable = () => (
  <div className="glass-card p-6">
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-lg font-black uppercase italic text-white">Holiday Packages</h3>
      <button className="btn-primary !py-2 !px-4 text-xs"><Plus size={14} /> Add Package</button>
    </div>
    <div className="space-y-3">
      {HOLIDAY_PACKAGES.map(pkg => (
        <div key={pkg.id} className="flex items-center gap-4 p-4 bg-white/3 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
          <img src={pkg.image} className="w-16 h-16 rounded-2xl object-cover shrink-0" alt={pkg.title}
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1524492707947-54b2bb40a516?w=100&q=60'; }} />
          <div className="flex-1 min-w-0">
            <p className="font-black text-white">{pkg.title}</p>
            <p className="text-xs text-gray-500">{pkg.duration} · {pkg.category}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-black text-emerald-400">₹{pkg.price.toLocaleString()}</p>
            <p className="text-xs text-gray-500">{pkg.reviews} reviews</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10"><Edit size={14} /></button>
            <button className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10"><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const HotelsTable = () => (
  <div className="glass-card p-6">
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-lg font-black uppercase italic text-white">Hotels</h3>
      <button className="btn-primary !py-2 !px-4 text-xs"><Plus size={14} /> Add Hotel</button>
    </div>
    <div className="space-y-3">
      {HOTELS_DATA.map(h => (
        <div key={h.id} className="flex items-center gap-4 p-4 bg-white/3 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
          <img src={h.image} className="w-16 h-16 rounded-2xl object-cover shrink-0" alt={h.name}
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&q=60'; }} />
          <div className="flex-1 min-w-0">
            <p className="font-black text-white">{h.name}</p>
            <p className="text-xs text-gray-500">{h.location} · {h.type}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-black text-white">₹{h.price.toLocaleString()}<span className="text-xs text-gray-500">/night</span></p>
            <p className="text-xs text-amber-400">⭐ {h.rating}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-400 hover:bg-indigo-500/10"><Edit size={14} /></button>
            <button className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10"><Trash2 size={14} /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Admin = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useApp();

  // Check admin access
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-12 text-center max-w-md">
          <Shield size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase italic text-white mb-2">Access Denied</h2>
          <p className="text-gray-400 italic">Only admin users can access this dashboard. Please login with an admin account.</p>
          <p className="text-xs text-gray-600 mt-4">To make yourself admin, update your user role in MongoDB to "admin".</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/5 bg-[#040d1f] hidden md:flex flex-col">
        <div className="px-6 py-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/20 border border-indigo-500/30 p-2.5 rounded-xl">
              <Shield size={20} className="text-indigo-400" />
            </div>
            <div>
              <p className="font-black text-sm text-white uppercase italic">Admin Panel</p>
              <p className="text-xs text-gray-500">TravelBharat</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left ${activeTab === id ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-2 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-black">{user.name?.charAt(0) || 'A'}</div>
            <div><p className="text-xs font-bold text-white">{user.name}</p><p className="text-xs text-gray-500">Admin</p></div>
          </div>
        </div>
      </aside>

      {/* Mobile Tabs */}
      <div className="flex-1 flex flex-col">
        <div className="md:hidden flex gap-2 overflow-x-auto p-4 border-b border-white/5 bg-[#040d1f]">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`tab-btn shrink-0 ${activeTab === id ? 'active' : ''}`}>
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-6xl">
            <div className="mb-8">
              <h1 className="text-3xl font-black italic uppercase text-white">{TABS.find(t => t.id === activeTab)?.label}</h1>
              <p className="text-gray-500 text-sm">TravelBharat Admin Dashboard</p>
            </div>
            {activeTab === 'overview' && <Overview user={user} />}
            {activeTab === 'bookings' && <BookingsTab user={user} />}
            {activeTab === 'states' && <StatesTable />}
            {activeTab === 'packages' && <PackagesTable />}
            {activeTab === 'hotels' && <HotelsTable />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
