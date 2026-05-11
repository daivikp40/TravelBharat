import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ChevronDown, X, MapPin, Sparkles, TrendingUp, Package, Hotel } from 'lucide-react';
import StateCard from '../components/ui/StateCard';
import { useApp } from '../context/AppContext';
import { STATES_STATIC } from '../data/statesData';
import { fetchStates } from '../services/api';

const REGIONS = ['All', 'North', 'South', 'East', 'West', 'Central', 'Northeast'];
const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'A → Z', value: 'az' },
  { label: 'Z → A', value: 'za' },
  { label: 'Top Rated', value: 'rating' },
];
const HERO_TEXTS = ['Incredible India', 'Diverse Culture', 'Ancient Heritage', 'Royal Traditions'];
const HERO_BG = 'https://images.unsplash.com/photo-1524492707947-54b2bb40a516?w=1920&q=80';

const Skeleton = () => (
  <div className="state-card overflow-hidden">
    <div className="skeleton" style={{ height: 220 }} />
    <div className="p-5 space-y-3">
      <div className="skeleton h-4 w-1/3 rounded-full" />
      <div className="skeleton h-3 w-full rounded-full" />
      <div className="skeleton h-3 w-2/3 rounded-full" />
      <div className="skeleton h-12 w-full rounded-2xl mt-4" />
    </div>
  </div>
);

const Home = () => {
  const { globalSearch, setGlobalSearch, activeRegion, setActiveRegion } = useApp();
  const [apiStates, setApiStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(globalSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [sortOpen, setSortOpen] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_TEXTS.length), 3200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetchStates()
      .then(res => setApiStates(res.data || []))
      .catch(() => setApiStates([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { setSearchTerm(globalSearch); }, [globalSearch]);

  const allStates = useMemo(() => {
    if (apiStates.length >= 10) return apiStates;
    const apiIds = new Set(apiStates.map(s => s.name?.toLowerCase()));
    const extras = STATES_STATIC.filter(s => !apiIds.has(s.name.toLowerCase()));
    return [...apiStates, ...extras];
  }, [apiStates]);

  const filtered = useMemo(() => {
    let r = [...allStates];
    if (activeRegion !== 'All') r = r.filter(s => s.region === activeRegion);
    const q = searchTerm.toLowerCase();
    if (q) r = r.filter(s => s.name?.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q) || s.region?.toLowerCase().includes(q));
    if (sortBy === 'az') r.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'za') r.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortBy === 'rating') r.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
    return r;
  }, [allStates, searchTerm, activeRegion, sortBy]);

  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-bg" style={{ backgroundImage: `url(${HERO_BG})` }} />
        <div className="hero-overlay" />
        <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-indigo-600/15 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-40 sm:w-64 h-40 sm:h-64 bg-emerald-600/10 rounded-full blur-[60px] sm:blur-[80px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center w-full py-16 sm:py-24">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-white/8 backdrop-blur-md border border-white/15 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full mb-6 sm:mb-8">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold text-emerald-300 tracking-widest uppercase">28 States · 8 UTs · Endless Stories</span>
            </div>

            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black italic uppercase tracking-tighter leading-none mb-4 sm:mb-6 text-white drop-shadow-2xl">
              Explore
            </h1>
            <AnimatePresence mode="wait">
              <motion.h2
                key={heroIdx}
                initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0)' }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-6 sm:mb-10 gradient-text"
              >
                {HERO_TEXTS[heroIdx]}
              </motion.h2>
            </AnimatePresence>
            <p className="text-gray-300 text-base sm:text-xl max-w-2xl mx-auto italic leading-relaxed mb-8 sm:mb-12 px-2">
              From the snow-capped Himalayas to the tropical shores of Lakshadweep — your ultimate India travel companion.
            </p>

            {/* Quick links */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
              {[
                { label: 'Holiday Packages', to: '/packages', icon: Package, color: 'bg-amber-500/20 border-amber-500/30 text-amber-300 hover:bg-amber-500/30' },
                { label: 'Book Hotels', to: '/hotels', icon: Hotel, color: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30' },
              ].map(({ label, to, icon: Icon, color }) => (
                <Link key={to} to={to} className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border font-bold text-xs sm:text-sm transition-all backdrop-blur-md ${color}`}>
                  <Icon size={15} /> {label}
                </Link>
              ))}
            </div>

            {/* Search */}
            <div className="relative max-w-2xl mx-auto group px-2">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl blur opacity-30 group-focus-within:opacity-60 transition duration-700" />
              <Search className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-indigo-400 z-10" size={18} />
              <input
                type="text"
                value={searchTerm}
                placeholder="Search states, destinations, regions..."
                className="relative w-full bg-[#060f23]/90 backdrop-blur-xl border border-white/15 rounded-xl sm:rounded-2xl py-4 sm:py-5 pl-12 sm:pl-16 pr-12 sm:pr-14 outline-none focus:border-indigo-500 transition-all text-sm z-10"
                onChange={e => { setSearchTerm(e.target.value); setGlobalSearch(e.target.value); }}
              />
              {searchTerm && (
                <button onClick={() => { setSearchTerm(''); setGlobalSearch(''); }} className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition z-10">
                  <X size={18} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="border-y border-white/5 bg-white/2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[['28+', 'States & UTs'], ['500+', 'Destinations'], ['2M+', 'Happy Travellers'], ['4.9★', 'Avg Rating']].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="text-xl sm:text-2xl font-black gradient-text">{v}</div>
              <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FILTERS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-4 sm:pb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto overflow-x-auto pb-1">
            {REGIONS.map(r => (
              <button key={r} onClick={() => setActiveRegion(r)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all shrink-0 ${activeRegion === r ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'}`}>
                {r}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-[10px] sm:text-xs text-gray-500 font-bold">{loading ? '...' : `${filtered.length} states`}</span>
            <div className="relative">
              <button onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-1.5 sm:gap-2 bg-white/5 border border-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold text-gray-400 hover:text-white transition-all">
                <SlidersHorizontal size={12} />
                {SORT_OPTIONS.find(s => s.value === sortBy)?.label}
                <ChevronDown size={12} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {sortOpen && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-full mt-2 w-36 bg-[#060f23] border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden z-20 shadow-2xl">
                    {SORT_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 sm:py-3 text-xs font-bold transition-all ${sortBy === opt.value ? 'text-indigo-400 bg-indigo-600/10' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATES GRID ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 sm:py-32">
            <MapPin size={48} className="mx-auto text-indigo-500/30 mb-4 sm:mb-6" />
            <h3 className="text-2xl sm:text-3xl font-black italic uppercase mb-3">No States Found</h3>
            <p className="text-gray-500 italic mb-6 sm:mb-8">Try adjusting your search or region filter</p>
            <button onClick={() => { setSearchTerm(''); setGlobalSearch(''); setActiveRegion('All'); }} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {filtered.map((s, i) => <StateCard key={s._id || s.name} state={s} index={i} />)}
          </div>
        )}
      </section>

      {/* ── TRENDING BANNER ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="relative rounded-2xl sm:rounded-[2.5rem] overflow-hidden">
          <div className="absolute inset-0 parallax-bg" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1600&q=80)` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/95 via-[#020617]/70 to-transparent" />
          <div className="relative z-10 p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
            <div>
              <div className="badge badge-emerald mb-3 sm:mb-4"><TrendingUp size={10} /> Trending Now</div>
              <h3 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tighter text-white mb-2 sm:mb-3">Kerala is calling</h3>
              <p className="text-gray-300 italic max-w-md text-sm sm:text-base">God's Own Country is at its most magical Oct–Feb. Houseboat stays from ₹8,999/night.</p>
            </div>
            <Link to="/packages" className="btn-primary shrink-0 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4">View Packages</Link>
          </div>
        </div>
      </section>

      {/* ── QUICK LINKS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Link to="/hotels" className="group relative rounded-2xl sm:rounded-[2rem] overflow-hidden h-40 sm:h-48 block">
            <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Hotels" onError={e => { e.target.onerror = null; e.target.src='https://images.unsplash.com/photo-1524492707947-54b2bb40a516?w=800&q=80'; }}/>
            <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/90 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
              <Hotel size={28} className="text-indigo-400 mb-2 sm:mb-3" />
              <h3 className="text-2xl sm:text-3xl font-black italic uppercase text-white">Book Hotels</h3>
              <p className="text-gray-400 text-xs sm:text-sm italic">150+ premium properties across India</p>
            </div>
          </Link>
          <Link to="/packages" className="group relative rounded-2xl sm:rounded-[2rem] overflow-hidden h-40 sm:h-48 block">
            <img src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Packages" onError={e => { e.target.onerror = null; e.target.src='https://images.unsplash.com/photo-1524492707947-54b2bb40a516?w=800&q=80'; }}/>
            <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/90 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
              <Package size={28} className="text-amber-400 mb-2 sm:mb-3" />
              <h3 className="text-2xl sm:text-3xl font-black italic uppercase text-white">Holiday Packages</h3>
              <p className="text-gray-400 text-xs sm:text-sm italic">Curated tours from ₹12,999/person</p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;