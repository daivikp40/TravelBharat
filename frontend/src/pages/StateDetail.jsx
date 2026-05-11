import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { fetchPlacesByState } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, MapPin, Bed, Navigation, ShieldCheck, Sparkles,
  UtensilsCrossed, Landmark, Heart, Star, Calendar, Cloud,
  Thermometer, Wind, Users, Clock, Share2, Camera, ChevronRight,
  Phone, AlertTriangle, CheckCircle, XCircle, Ambulance, Image
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STATES_STATIC, STATE_EXTRA, HOLIDAY_PACKAGES } from '../data/statesData';
import { TOURIST_PLACES } from '../data/touristPlaces';

const TABS = [
  { id: 'overview', label: 'Overview', icon: MapPin },
  { id: 'destinations', label: 'Destinations', icon: Sparkles },
  { id: 'hotels', label: 'Hotels', icon: Bed },
  { id: 'food', label: 'Food', icon: UtensilsCrossed },
  { id: 'safety', label: 'Safety', icon: ShieldCheck },
  { id: 'reviews', label: 'Reviews', icon: Star },
];

// Live Photo Gallery
const LiveGallery = ({ photos }) => {
  const [active, setActive] = useState(0);
  if (!photos?.length) return null;
  return (
    <div className="relative rounded-[2.5rem] overflow-hidden h-80 md:h-[28rem] mb-4">
      <AnimatePresence mode="wait">
        <motion.img key={active} src={photos[active]} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
          className="w-full h-full object-cover" alt=""
          onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1524492707947-54b2bb40a516?w=800&q=80'; }} />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/70 to-transparent pointer-events-none" />
      {/* Thumbnails */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {photos.map((p, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`transition-all rounded-xl overflow-hidden border-2 ${i === active ? 'border-white scale-110' : 'border-transparent opacity-60 hover:opacity-90'}`}>
            <img src={p} className="w-14 h-10 object-cover" alt=""
              onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1524492707947-54b2bb40a516?w=100&q=60'; }} />
          </button>
        ))}
      </div>
      <button onClick={() => setActive(a => (a - 1 + photos.length) % photos.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-xl transition-all">
        <ChevronLeft size={18} />
      </button>
      <button onClick={() => setActive(a => (a + 1) % photos.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2.5 rounded-xl transition-all">
        <ChevronRight size={18} />
      </button>
      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-xl text-xs text-white flex items-center gap-1.5">
        <Camera size={12} /> {active + 1}/{photos.length}
      </div>
    </div>
  );
};

// Safety Panel
const SafetyPanel = ({ extra, stateName }) => {
  if (!extra) return <div className="glass-card p-8 text-center text-gray-500 italic">Safety info not available for this state.</div>;
  const levelColor = extra.safetyLevel === 'Very Safe' ? 'emerald' : extra.safetyLevel === 'Safe' ? 'blue' : extra.safetyLevel === 'Caution' ? 'amber' : 'red';
  const LevelIcon = extra.safetyLevel === 'Very Safe' ? CheckCircle : extra.safetyLevel === 'Safe' ? CheckCircle : extra.safetyLevel === 'Caution' ? AlertTriangle : XCircle;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
      {/* Safety Level */}
      <div className={`glass-card p-7 border-${levelColor}-500/30 bg-${levelColor}-500/5`}>
        <div className="flex items-center gap-4 mb-5">
          <LevelIcon size={36} className={`text-${levelColor}-400`} />
          <div>
            <h3 className="text-2xl font-black text-white">{extra.safetyLevel}</h3>
            <p className="text-gray-400 text-sm">for {stateName} travel</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-4xl font-black text-white">{extra.safetyScore}<span className="text-lg text-gray-500">/10</span></p>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Safety Score</p>
          </div>
        </div>
        {/* Score bar */}
        <div className="bg-white/5 rounded-full h-3 overflow-hidden mb-4">
          <motion.div initial={{ width: 0 }} animate={{ width: `${extra.safetyScore * 10}%` }} transition={{ duration: 1.2, delay: 0.3 }}
            className={`h-full bg-${levelColor}-500 rounded-full`} />
        </div>
        <p className="text-sm text-gray-300 italic">{extra.safetyNotes}</p>
      </div>

      {/* Emergency Numbers */}
      <div className="glass-card p-7">
        <h4 className="font-black uppercase text-white text-sm tracking-widest mb-5 flex items-center gap-2"><Phone size={16} className="text-indigo-400" /> Emergency Contacts</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Emergency Helpline', number: extra.emergencyPhone, color: 'red', icon: '🚨' },
            { label: 'Police', number: extra.policeHelpline, color: 'blue', icon: '👮' },
            { label: 'Ambulance', number: extra.ambulance, color: 'emerald', icon: '🚑' },
            { label: 'Tourism Helpline', number: extra.tourismPhone, color: 'amber', icon: '🗺️' },
          ].map(({ label, number, color, icon }) => (
            <a key={label} href={`tel:${number}`}
              className={`flex items-center gap-3 p-4 rounded-2xl bg-${color}-500/8 border border-${color}-500/20 hover:border-${color}-500/40 hover:bg-${color}-500/15 transition-all`}>
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{label}</p>
                <p className={`font-black text-${color}-400 text-lg`}>{number}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Nearby Hospital */}
      <div className="glass-card p-6 flex items-start gap-4">
        <span className="text-3xl">🏥</span>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Nearest Major Hospital</p>
          <p className="font-bold text-white">{extra.hospitalNearby}</p>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="glass-card p-6">
        <h4 className="font-black uppercase text-white text-xs tracking-widest mb-4">General Safety Tips</h4>
        <ul className="space-y-2">
          {['Keep copies of all travel documents', 'Share itinerary with family/friends', 'Use registered taxis and auto-rickshaws', 'Carry basic first-aid kit', 'Respect local customs & dress codes'].map(tip => (
            <li key={tip} className="flex items-start gap-2 text-sm text-gray-400">
              <CheckCircle size={14} className="text-emerald-400 shrink-0 mt-0.5" />{tip}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

// Place Card with multi-image gallery (Gujarat Tourism style)
const PlaceCard = ({ place }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const imgs = place.images?.length ? place.images : ['https://images.unsplash.com/photo-1524492707947-54b2bb40a516?w=800&q=80'];
  const CAT_COLOR = { Heritage: 'indigo', Nature: 'emerald', Adventure: 'blue', Religious: 'amber' };
  const col = CAT_COLOR[place.cat] || 'indigo';
  return (
    <motion.div whileHover={{ y: -4 }} className="glass-card overflow-hidden group">
      {/* Image gallery */}
      <div className="relative h-52 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img key={imgIdx} src={imgs[imgIdx]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="w-full h-full object-cover" alt={place.name}
            onError={e => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1524492707947-54b2bb40a516?w=800&q=80'; }} />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-[#060f23] via-transparent to-transparent" />
        {imgs.length > 1 && (
          <>
            <button onClick={() => setImgIdx(i => (i - 1 + imgs.length) % imgs.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"><ChevronLeft size={14} /></button>
            <button onClick={() => setImgIdx(i => (i + 1) % imgs.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"><ChevronRight size={14} /></button>
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5">
              {imgs.map((_, i) => <span key={i} className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-white scale-125' : 'bg-white/40'}`} />)}
            </div>
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] text-white flex items-center gap-1"><Image size={10} />{imgIdx + 1}/{imgs.length}</div>
          </>
        )}
        <span className={`absolute top-3 left-3 badge badge-${col}`}>{place.cat}</span>
        <h4 className="absolute bottom-3 left-4 text-xl font-black text-white drop-shadow-lg">{place.name}</h4>
      </div>
      {/* Info */}
      <div className="p-5">
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1"><MapPin size={11} className="text-indigo-400" />{place.city}</span>
          {place.best && <span className="flex items-center gap-1"><Calendar size={11} className="text-amber-400" />{place.best}</span>}
        </div>
        <p className="text-gray-400 text-sm italic line-clamp-2 mb-4">"{place.desc}"</p>
        <div className="flex gap-2">
          <a href={`https://www.google.com/maps/search/${encodeURIComponent(place.name)}`} target="_blank" rel="noreferrer" className="btn-primary !py-2 !px-4 text-[10px]"><Navigation size={12} />Maps</a>
          <a href={`https://en.wikipedia.org/wiki/${encodeURIComponent(place.name)}`} target="_blank" rel="noreferrer" className="btn-ghost !py-2 !px-4 text-[10px]">Learn More</a>
        </div>
      </div>
    </motion.div>
  );
};

const StateDetail = () => {
  const { id } = useParams();
  const { toggleFavorite, isFavorite, addRecentlyViewed, user, setAuthModalOpen } = useApp();
  const [places, setPlaces] = useState([]);
  const [stateName, setStateName] = useState('');
  const [stateData, setStateData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);

  const fav = isFavorite(id);
  const extra = STATE_EXTRA[id] || null;

  useEffect(() => {
    // Find from static data first
    const staticState = STATES_STATIC.find(s => s._id === id);
    if (staticState) {
      setStateData(staticState);
      setStateName(staticState.name);
      addRecentlyViewed({ _id: id, name: staticState.name });
    }
    setLoading(true);

    // Fetch places
    fetchPlacesByState(id)
      .then(res => {
        setPlaces(res.data || []);
        if (res.data?.length && res.data[0].state?.name) {
          const n = res.data[0].state.name;
          setStateName(n);
          if (!staticState) addRecentlyViewed({ _id: id, name: n });
        }
      })
      .catch(() => { });

    // Fetch reviews
    axios.get(`${import.meta.env.VITE_API_URL}/api/reviews/${id}`)
      .then(res => setReviews(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));

  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    try {
      setReviewLoading(true);
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/reviews`, {
        stateId: id,
        rating: reviewRating,
        comment: reviewText
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setReviews([data, ...reviews]);
      setReviewText('');
      setReviewRating(5);
      import('react-hot-toast').then(({ default: toast }) => toast.success("Review posted successfully!"));
    } catch (err) {
      import('react-hot-toast').then(({ default: toast }) => toast.error(err.response?.data?.message || 'Error submitting review'));
    } finally {
      setReviewLoading(false);
    }
  };

  const livePhotos = extra?.livePhotos || (stateData?.imageUrl ? [stateData.imageUrl] : []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-white">
      {/* Back Bar */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <Link to="/" className="inline-flex items-center gap-2 text-indigo-400 font-bold bg-white/5 px-5 py-2.5 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all text-sm">
          <ChevronLeft size={18} /> All States
        </Link>
        <div className="flex items-center gap-2">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleFavorite({ _id: id, name: stateName })}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border font-bold text-sm transition-all ${fav ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-white/5 border-white/10 text-gray-400 hover:border-red-500/40 hover:text-red-400'}`}>
            <Heart size={15} fill={fav ? 'currentColor' : 'none'} /> {fav ? 'Saved' : 'Save'}
          </motion.button>
          <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white text-sm font-bold transition-all">
            <Share2 size={15} /> {copied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>

      {/* Hero Gallery */}
      <LiveGallery photos={livePhotos} />

      {/* State Title + Info */}
      {stateName && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-none mb-4">{stateName}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            {stateData?.capital && <span className="flex items-center gap-1.5"><MapPin size={13} className="text-indigo-400" /> {stateData.capital}</span>}
            <span className="flex items-center gap-1.5"><Users size={13} className="text-emerald-400" /> {stateData?.visitors || '2M+'} visitors/yr</span>
            <span className="flex items-center gap-1.5"><Star size={13} className="text-amber-400 fill-amber-400" /> {stateData?.rating || 4.5} Rating</span>
            <span className="flex items-center gap-1.5"><Clock size={13} className="text-purple-400" /> Best: {stateData?.bestSeason || 'Oct–Feb'}</span>
            {extra && (
              <span className={`flex items-center gap-1.5 font-bold ${extra.safetyLevel === 'Very Safe' ? 'text-emerald-400' : extra.safetyLevel === 'Safe' ? 'text-blue-400' : 'text-amber-400'}`}>
                <ShieldCheck size={13} /> {extra.safetyLevel}
              </span>
            )}
            {extra?.tourismPhone && (
              <a href={`tel:${extra.tourismPhone}`} className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors">
                <Phone size={13} /> {extra.tourismPhone}
              </a>
            )}
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <div className="tab-bar mb-10 flex-wrap">
        {TABS.map(({ id: tid, label, icon: Icon }) => (
          <button key={tid} onClick={() => setActiveTab(tid)} className={`tab-btn ${activeTab === tid ? 'active' : ''}`}>
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {/* Overview */}
            {activeTab === 'overview' && (
              <motion.div key="ov" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                {stateData?.description && (
                  <div className="glass-card p-7">
                    <p className="text-gray-300 text-lg italic leading-relaxed">"{stateData.description}"</p>
                  </div>
                )}
                {/* Highlights */}
                {stateData?.highlights && (
                  <div className="glass-card p-7">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Top Highlights</h3>
                    <div className="flex flex-wrap gap-2">
                      {stateData.highlights.map(h => (
                        <span key={h} className="badge badge-indigo">{h}</span>
                      ))}
                    </div>
                  </div>
                )}
                {/* Quick Facts */}
                <div className="glass-card p-7">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-5">Quick Facts</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      ['🏛️', 'Capital', stateData?.capital || 'N/A'],
                      ['🗣️', 'Language', stateData?.language || 'N/A'],
                      ['📍', 'Region', stateData?.region || 'N/A'],
                      ['🌤️', 'Best Season', stateData?.bestSeason || 'Oct–Feb'],
                      ['🏞️', 'Destinations', `${stateData?.placesCount || places.length || '20+'}`],
                      ['👥', 'Visitors/yr', stateData?.visitors || '1M+'],
                    ].map(([e, l, v]) => (
                      <div key={l} className="bg-white/3 rounded-2xl p-4">
                        <span className="text-xl block mb-1">{e}</span>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">{l}</p>
                        <p className="font-bold text-white text-sm mt-0.5">{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Destinations — Gujarat Tourism style cards */}
            {activeTab === 'destinations' && (
              <motion.div key="dest" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <h2 className="text-3xl font-black italic flex items-center gap-3"><Sparkles className="text-indigo-500" size={28} /> Tourist Destinations</h2>
                {(() => {
                  const staticPlaces = TOURIST_PLACES[id] || [];
                  const allPlaces = staticPlaces.length > 0 ? staticPlaces : places.map(p => ({ id: p._id, name: p.placeName, city: p.city, cat: p.category, desc: p.description, best: p.bestTimeToVisit, images: p.images || [] }));
                  if (loading && allPlaces.length === 0) return Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-64 rounded-[2rem]" />);
                  if (allPlaces.length === 0) return <div className="glass-card p-16 text-center text-gray-500 italic">No destinations found yet.</div>;
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {allPlaces.map((place, pi) => (
                        <PlaceCard key={place.id || pi} place={place} />
                      ))}
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* Hotels Tab */}
            {activeTab === 'hotels' && (
              <motion.div key="hotels" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <h2 className="text-3xl font-black italic flex items-center gap-3"><Bed className="text-indigo-500" size={28} /> Stay Options</h2>
                {['Luxury Palace', 'Heritage Haveli', 'Business Hotel', 'Budget Guesthouse'].map((name, i) => (
                  <div key={name} className="glass-card p-6 flex items-center gap-5">
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-2 justify-between">
                        <h4 className="font-black text-white">{name}</h4>
                        <span className="text-amber-400 text-sm">{'⭐'.repeat(5 - i)}</span>
                      </div>
                      <p className="text-gray-400 text-xs italic">Premium accommodation in {stateName} with modern amenities.</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-black text-white text-lg">₹{((5 - i) * 2).toFixed(0)}k<span className="text-xs text-gray-500">/night</span></p>
                      <Link to="/hotels" className="btn-primary !py-2 !px-4 text-xs mt-2 inline-flex">Book</Link>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Food Tab */}
            {activeTab === 'food' && (
              <motion.div key="food" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
                <h2 className="text-3xl font-black italic flex items-center gap-3"><UtensilsCrossed className="text-indigo-500" size={28} /> Local Cuisine</h2>
                {[['🍛', 'Street Food', 'Authentic local street food with bold regional spices'], ['🥘', 'Traditional Thali', 'Complete meal with 12+ dishes unique to this region'], ['🍮', 'Local Sweets', 'Famous mithai and desserts you won\'t find anywhere else'], ['☕', 'Signature Drink', 'Traditional chai or local beverage — a cultural experience']].map(([e, n, d]) => (
                  <div key={n} className="glass-card p-5 flex items-center gap-5">
                    <span className="text-4xl">{e}</span>
                    <div><h4 className="font-black text-white mb-1">{n}</h4><p className="text-gray-400 text-sm italic">{d}</p></div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Safety Tab */}
            {activeTab === 'safety' && (
              <motion.div key="safety" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <h2 className="text-3xl font-black italic flex items-center gap-3 mb-6"><ShieldCheck className="text-indigo-500" size={28} /> Safety & Contacts</h2>
                <SafetyPanel extra={extra} stateName={stateName} />
              </motion.div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <motion.div key="reviews" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                <h2 className="text-3xl font-black italic flex items-center gap-3"><Star className="text-indigo-500" size={28} /> Traveler Reviews</h2>

                {/* Add Review Form */}
                <div className="glass-card p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Leave a Review</h3>
                  <form onSubmit={submitReview} className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(num => (
                          <button type="button" key={num} onClick={() => setReviewRating(num)}
                            className={`p-2 rounded-xl transition-all ${num <= reviewRating ? 'text-amber-400 bg-amber-400/10' : 'text-gray-600 hover:text-amber-400/50'}`}>
                            <Star size={24} fill={num <= reviewRating ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-widest mb-2 block">Your Experience</label>
                      <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} required rows="4"
                        placeholder={`Share your experience visiting ${stateName}...`}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:border-indigo-500 outline-none resize-none" />
                    </div>
                    <button type="submit" disabled={reviewLoading} className="btn-primary">
                      {reviewLoading ? 'Submitting...' : 'Post Review'}
                    </button>
                  </form>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="glass-card p-10 text-center text-gray-500 italic">No reviews yet. Be the first to share your experience!</div>
                  ) : (
                    reviews.map(review => (
                      <div key={review._id} className="glass-card p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">
                              {review.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{review.user?.name || 'Anonymous'}</p>
                              <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} className={i >= review.rating ? 'text-gray-600' : ''} />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm">{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-5">
          {/* Safety quick card */}
          {extra && (
            <div className={`glass-card p-6 border-${extra.safetyLevel === 'Very Safe' ? 'emerald' : 'blue'}-500/20`}>
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2"><ShieldCheck size={13} /> Safety Status</p>
              <p className={`text-2xl font-black mb-1 ${extra.safetyLevel === 'Very Safe' ? 'text-emerald-400' : extra.safetyLevel === 'Safe' ? 'text-blue-400' : 'text-amber-400'}`}>{extra.safetyLevel}</p>
              <div className="bg-white/5 rounded-full h-2 mb-3 overflow-hidden">
                <div className={`h-full bg-emerald-500 rounded-full`} style={{ width: `${extra.safetyScore * 10}%` }} />
              </div>
              <p className="text-xs text-gray-500">{extra.safetyScore}/10 — {extra.safetyNotes?.slice(0, 60)}...</p>
              <button onClick={() => setActiveTab('safety')} className="btn-ghost w-full justify-center mt-3 text-xs">View Full Safety Info</button>
            </div>
          )}

          {/* Contact */}
          {extra?.tourismPhone && (
            <div className="glass-card p-6">
              <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Quick Contacts</p>
              <div className="space-y-3">
                <a href={`tel:${extra.tourismPhone}`} className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 hover:border-amber-500/40 transition-all">
                  <Phone size={16} className="text-amber-400" /><div><p className="text-xs text-gray-500">Tourism Helpline</p><p className="text-sm font-bold text-amber-300">{extra.tourismPhone}</p></div>
                </a>
                <a href="tel:112" className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-3 hover:border-red-500/40 transition-all">
                  <Phone size={16} className="text-red-400" /><div><p className="text-xs text-gray-500">Emergency</p><p className="text-sm font-bold text-red-300">112</p></div>
                </a>
              </div>
            </div>
          )}

          {/* Packages CTA */}
          <div className="glass-card p-6">
            <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Ready to Explore?</p>
            <p className="text-gray-400 text-sm italic mb-4">Book an all-inclusive package to {stateName} starting from ₹12,999/person</p>
            <Link to="/packages" className="btn-primary w-full justify-center">View All Packages</Link>
          </div>

          {/* State-specific packages */}
          {(() => {
            const stPkgs = HOLIDAY_PACKAGES.filter(p => p.states.some(s => s.toLowerCase().includes(stateName?.toLowerCase()?.split(' ')[0] || '---')));
            if (stPkgs.length === 0) return null;
            return (
              <div className="glass-card p-6">
                <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">📦 Packages for {stateName}</p>
                <div className="space-y-3">
                  {stPkgs.map(pkg => (
                    <Link key={pkg.id} to="/packages" className="block bg-white/3 border border-white/5 hover:border-indigo-500/30 rounded-2xl p-4 transition-all">
                      <div className="flex items-center gap-3">
                        <img src={pkg.image} className="w-12 h-12 rounded-xl object-cover shrink-0" alt={pkg.title} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1524492707947-54b2bb40a516?w=100&q=60'; }} />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-sm truncate">{pkg.title}</p>
                          <p className="text-xs text-gray-500">{pkg.duration}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-black text-emerald-400 text-sm">₹{pkg.price.toLocaleString()}</p>
                          <p className="text-[10px] text-gray-500 line-through">₹{pkg.originalPrice.toLocaleString()}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })()}
        </aside>
      </div>
    </div>
  );
};

export default StateDetail;