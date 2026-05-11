import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Send, ArrowRight, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Favorites = () => {
    const { favorites, toggleFavorite, recentlyViewed } = useApp();

    return (
        <main className="max-w-7xl mx-auto px-6 py-16">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-14">
                <div className="flex items-center gap-4 mb-4">
                    <div className="bg-red-500/20 border border-red-500/30 p-3 rounded-2xl">
                        <Heart size={28} className="text-red-400 fill-red-400" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white">My Favorites</h1>
                        <p className="text-gray-500 italic">{favorites.length} saved destination{favorites.length !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            </motion.div>

            {/* Favorites Grid */}
            {favorites.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
                    <Heart size={80} className="mx-auto text-gray-700 mb-6" />
                    <h3 className="text-3xl font-black italic uppercase text-white mb-3">No Favorites Yet</h3>
                    <p className="text-gray-500 italic text-lg mb-8">Start exploring and save states you love!</p>
                    <Link to="/" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all">
                        Explore India <ArrowRight size={18} />
                    </Link>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                    <AnimatePresence>
                        {favorites.map((state, i) => (
                            <motion.div
                                key={state._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                transition={{ delay: i * 0.08 }}
                                className="bg-[#0a1628] border border-white/5 hover:border-indigo-500/30 rounded-[2.5rem] p-6 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-indigo-600/20 border border-indigo-500/20 p-2.5 rounded-xl">
                                            <MapPin size={20} className="text-indigo-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-xl uppercase italic tracking-tighter">{state.name}</h4>
                                            <p className="text-gray-500 text-xs">India</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toggleFavorite(state)}
                                        className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                        title="Remove from favorites"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                                <p className="text-gray-500 text-sm italic mb-6 line-clamp-2">
                                    {state.description || 'A beautiful state waiting to be explored.'}
                                </p>
                                <Link
                                    to={`/state/${state._id}`}
                                    className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-white hover:text-black text-white rounded-2xl font-black text-xs uppercase transition-all"
                                >
                                    Explore <Send size={14} />
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
                <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white mb-6">Recently Viewed</h2>
                    <div className="flex flex-wrap gap-3">
                        {recentlyViewed.map(state => (
                            <Link
                                key={state._id}
                                to={`/state/${state._id}`}
                                className="flex items-center gap-2 bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:bg-white/10 px-5 py-3 rounded-2xl text-sm font-bold text-gray-400 hover:text-white transition-all"
                            >
                                <MapPin size={14} className="text-indigo-400" />
                                {state.name || state._id}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </main>
    );
};

export default Favorites;
