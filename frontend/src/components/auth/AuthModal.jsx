import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, LogIn, UserPlus, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import axios from 'axios';

const AuthModal = () => {
    const { authModalOpen, setAuthModalOpen, setUser } = useApp();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!authModalOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const url = `${import.meta.env.VITE_API_URL}${endpoint}`;

        try {
            const { data } = await axios.post(url, formData);
            setUser(data);
            setAuthModalOpen(false);
            import('react-hot-toast').then(({ default: toast }) => {
                toast.success(isLogin ? `Welcome back, ${data.name}!` : "Account created successfully!");
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setAuthModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-[#060f23] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl shadow-indigo-500/20">

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
                    <h2 className="text-2xl font-black italic uppercase text-white flex items-center gap-2">
                        {isLogin ? <><LogIn className="text-indigo-400" /> Welcome Back</> : <><UserPlus className="text-emerald-400" /> Join Us</>}
                    </h2>
                    <button onClick={() => setAuthModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Full Name</label>
                                <div className="relative">
                                    <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 outline-none transition-all"
                                        placeholder="John Doe" />
                                </div>
                            </div>
                        )}
                        {!isLogin && (
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Phone Number</label>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 outline-none transition-all"
                                        placeholder="+91 98765 43210" />
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 outline-none transition-all"
                                    placeholder="john@example.com" />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 outline-none transition-all"
                                    placeholder="••••••••" />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50">
                            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-indigo-400 font-bold hover:underline">
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthModal;
