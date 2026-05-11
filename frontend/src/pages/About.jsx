import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Globe, Heart, ShieldCheck, Compass, Star, ArrowRight } from 'lucide-react';

const STATS = [
    { value: '28+', label: 'States & UTs' },
    { value: '500+', label: 'Destinations' },
    { value: '2M+', label: 'Happy Travelers' },
    { value: '4.9★', label: 'App Rating' },
];

const FEATURES = [
    {
        icon: Compass,
        color: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30',
        iconColor: 'text-indigo-400',
        title: 'Discover Destinations',
        desc: 'Explore 500+ verified destinations across every state and union territory of India.',
    },
    {
        icon: ShieldCheck,
        color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
        iconColor: 'text-emerald-400',
        title: 'Verified & Safe',
        desc: 'All destinations are verified for safety, accessibility, and tourist-friendliness.',
    },
    {
        icon: Heart,
        color: 'from-red-500/20 to-rose-500/20 border-red-500/30',
        iconColor: 'text-red-400',
        title: 'Save Favorites',
        desc: 'Build your personal India travel list and revisit your saved destinations anytime.',
    },
    {
        icon: Star,
        color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
        iconColor: 'text-amber-400',
        title: 'Curated Experiences',
        desc: 'Handpicked hotels, resorts, local food trails, and cultural experiences in every state.',
    },
];

const About = () => (
    <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
            <div className="flex justify-center mb-8">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-[2rem] shadow-2xl shadow-indigo-500/30">
                    <Globe size={48} className="text-white" />
                </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-white mb-6">
                About
                <br />
                <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                    TravelBharat
                </span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto italic leading-relaxed">
                India's premier digital travel companion — curating authentic experiences across the world's most diverse country.
            </p>
        </motion.div>

        {/* Stats */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
            {STATS.map(({ value, label }) => (
                <div key={label} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 text-center">
                    <div className="text-4xl font-black text-white mb-2">{value}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">{label}</div>
                </div>
            ))}
        </motion.div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
            {FEATURES.map(({ icon: Icon, color, iconColor, title, desc }, i) => (
                <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className={`bg-gradient-to-br ${color} border rounded-[2.5rem] p-8`}
                >
                    <Icon size={36} className={`${iconColor} mb-5`} />
                    <h3 className="text-xl font-black uppercase italic tracking-tight text-white mb-3">{title}</h3>
                    <p className="text-gray-400 italic text-sm leading-relaxed">{desc}</p>
                </motion.div>
            ))}
        </div>

        {/* Mission */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-emerald-600/10 border border-white/10 rounded-[3rem] p-14 text-center mb-12"
        >
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-6">Our Mission</h2>
            <p className="text-gray-300 text-lg italic leading-relaxed max-w-3xl mx-auto">
                "To make every corner of India accessible, known, and celebrated — from the snowy peaks of Ladakh to the tropical shores of Lakshadweep. We believe in responsible tourism that honors culture, supports local communities, and creates lifelong memories."
            </p>
        </motion.div>

        {/* CTA */}
        <div className="text-center">
            <Link
                to="/"
                className="inline-flex items-center gap-3 bg-indigo-600 hover:bg-white hover:text-black text-white px-10 py-5 rounded-2xl font-black text-base uppercase tracking-wider transition-all shadow-2xl shadow-indigo-500/20"
            >
                Start Exploring India <ArrowRight size={20} />
            </Link>
        </div>
    </main>
);

export default About;
