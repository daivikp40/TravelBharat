import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Send, Heart, Star, MapPin, Users, Sun } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const REGION_COLORS = {
    'North': 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
    'South': 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
    'East': 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
    'West': 'from-rose-500/20 to-pink-500/20 border-rose-500/30',
    'Central': 'from-purple-500/20 to-violet-500/20 border-purple-500/30',
    'Northeast': 'from-cyan-500/20 to-sky-500/20 border-cyan-500/30',
    'default': 'from-white/5 to-white/10 border-white/10',
};

const StateCard = ({ state, index }) => {
    const { toggleFavorite, isFavorite } = useApp();
    const fav = isFavorite(state._id);
    const regionClass = REGION_COLORS[state.region] || REGION_COLORS.default;
    const rating = state.rating || '4.5';
    const visitors = state.visitors || '2M+';
    const bestSeason = state.bestSeason || 'Oct–Feb';

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, type: 'spring', damping: 20 }}
            className="group"
        >
            <div className="relative bg-[#0a1628] rounded-2xl sm:rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 transition-all duration-700 shadow-2xl overflow-hidden">
                {/* Image */}
                <div className="relative h-48 sm:h-64 overflow-hidden rounded-t-2xl sm:rounded-t-[2.5rem]">
                    <img
                        src={state.imageUrl}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        alt={state.name}
                        loading="lazy"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1524492707947-54b2bb40a516?q=80&w=800" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-[#0a1628]/20 to-transparent" />

                    {/* Favorite Button */}
                    <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={(e) => { e.preventDefault(); toggleFavorite(state); }}
                        className={`absolute top-3 sm:top-4 right-3 sm:right-4 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl backdrop-blur-md border transition-all ${fav ? 'bg-red-500/90 border-red-400 text-white' : 'bg-black/40 border-white/20 text-white/70 hover:bg-red-500/80 hover:border-red-400'}`}
                    >
                        <Heart size={16} fill={fav ? 'currentColor' : 'none'} />
                    </motion.button>

                    {/* Rating Badge */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex items-center gap-1.5 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl">
                        <Star size={11} className="text-amber-400 fill-amber-400" />
                        <span className="text-[10px] sm:text-xs font-bold text-white">{rating}</span>
                    </div>

                    {/* State Name */}
                    <h4 className="absolute bottom-3 sm:bottom-4 left-4 sm:left-5 text-2xl sm:text-4xl font-black italic tracking-tighter uppercase leading-none text-white drop-shadow-2xl">{state.name}</h4>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6">
                    {/* Region & Season Tags */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                        {state.region && (
                            <span className={`text-[9px] sm:text-[10px] font-black tracking-widest uppercase px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-r border ${regionClass}`}>
                                {state.region} India
                            </span>
                        )}
                        <span className="text-[9px] sm:text-[10px] font-black tracking-widest uppercase px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center gap-1">
                            <Sun size={9} /> {bestSeason}
                        </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-5 line-clamp-2 italic leading-relaxed">"{state.description}"</p>

                    {/* Stats Row */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 text-[10px] sm:text-xs text-gray-500">
                        <span className="flex items-center gap-1.5">
                            <MapPin size={11} className="text-indigo-400" />
                            {state.placesCount || '15+'} places
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Users size={11} className="text-emerald-400" />
                            {visitors} visitors/yr
                        </span>
                    </div>

                    {/* Explore Button */}
                    <Link
                        to={`/state/${state._id}`}
                        className="w-full py-3 sm:py-4 bg-indigo-600 hover:bg-white hover:text-black rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-white group-hover:shadow-lg group-hover:shadow-indigo-500/20"
                    >
                        EXPLORE STATE <Send size={14} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default StateCard;