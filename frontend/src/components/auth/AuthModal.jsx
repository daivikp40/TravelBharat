import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, LogIn, UserPlus, Phone, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthModal = () => {
    const { authModalOpen, setAuthModalOpen, setUser } = useApp();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState('');

    // Reset form when modal opens/closes or mode switches
    useEffect(() => {
        if (authModalOpen) {
            setFormData({ name: '', email: '', phone: '', password: '' });
            setError('');
            setFieldErrors({});
            setSuccess('');
            setShowPassword(false);
        }
    }, [authModalOpen, isLogin]);

    if (!authModalOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear field error on change
        if (fieldErrors[name]) {
            setFieldErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (error) setError('');
    };

    // Client-side validation
    const validate = () => {
        const errors = {};

        if (!isLogin) {
            if (!formData.name.trim()) errors.name = 'Name is required';
            else if (formData.name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/.test(formData.email)) errors.email = 'Invalid email (e.g. name@example.com)';
        else {
            const tld = formData.email.split('.').pop().toLowerCase();
            const badTLDs = ['con', 'cmo', 'ocm', 'nrt', 'ogr', 'ner', 'coj', 'vom', 'xom', 'gml', 'cm'];
            if (badTLDs.includes(tld)) errors.email = `Did you mean .com? ".${tld}" is not a valid domain`;
        }

        if (!isLogin && formData.phone.trim()) {
            const cleanPhone = formData.phone.replace(/[\s-]/g, '');
            if (!/^(\+91)?[6-9]\d{9}$/.test(cleanPhone)) errors.phone = 'Invalid phone (10 digits, e.g. +91 98765 43210)';
        }

        if (!formData.password) errors.password = 'Password is required';
        else if (!isLogin && formData.password.length < 6) errors.password = 'Password must be at least 6 characters';

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validate()) return;

        setLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const url = `${API_URL}${endpoint}`;

        // Only send relevant fields
        const payload = isLogin
            ? { email: formData.email.trim(), password: formData.password }
            : {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                password: formData.password
            };

        try {
            const { data } = await axios.post(url, payload);
            setUser(data);
            setSuccess(isLogin ? `Welcome back, ${data.name}!` : 'Account created successfully!');

            // Close after brief success message
            setTimeout(() => {
                setAuthModalOpen(false);
                import('react-hot-toast').then(({ default: toast }) => {
                    toast.success(isLogin ? `Welcome back, ${data.name}!` : 'Account created successfully!');
                });
            }, 600);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFieldErrors({});
        setSuccess('');
        setFormData({ name: '', email: '', phone: '', password: '' });
    };

    const FieldError = ({ field }) => fieldErrors[field] ? (
        <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={10} />{fieldErrors[field]}</p>
    ) : null;

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
                    <button onClick={() => setAuthModalOpen(false)} className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Success message */}
                    {success && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm p-3 rounded-xl mb-4 flex items-center gap-2">
                            <CheckCircle size={16} />{success}
                        </motion.div>
                    )}

                    {/* Error message */}
                    {error && (
                        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4 flex items-center gap-2">
                            <AlertCircle size={16} />{error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name field (register only) */}
                        <AnimatePresence mode="popLayout">
                            {!isLogin && (
                                <motion.div key="name-field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Full Name *</label>
                                    <div className="relative">
                                        <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input type="text" name="name" value={formData.name} onChange={handleChange}
                                            className={`w-full bg-white/5 border rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 outline-none transition-all ${fieldErrors.name ? 'border-red-500/50' : 'border-white/10'}`}
                                            placeholder="John Doe" />
                                    </div>
                                    <FieldError field="name" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Phone field (register only) */}
                        <AnimatePresence mode="popLayout">
                            {!isLogin && (
                                <motion.div key="phone-field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Phone Number</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                            className={`w-full bg-white/5 border rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 outline-none transition-all ${fieldErrors.phone ? 'border-red-500/50' : 'border-white/10'}`}
                                            placeholder="+91 98765 43210" />
                                    </div>
                                    <FieldError field="phone" />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Email */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Email *</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                                    className={`w-full bg-white/5 border rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 outline-none transition-all ${fieldErrors.email ? 'border-red-500/50' : 'border-white/10'}`}
                                    placeholder="john@example.com" />
                            </div>
                            <FieldError field="email" />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Password *</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                    className={`w-full bg-white/5 border rounded-xl py-3 pl-10 pr-12 text-white focus:border-indigo-500 outline-none transition-all ${fieldErrors.password ? 'border-red-500/50' : 'border-white/10'}`}
                                    placeholder="••••••••" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <FieldError field="password" />
                            {!isLogin && formData.password && (
                                <div className="mt-1.5">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${formData.password.length >= i * 3 ? (formData.password.length >= 8 ? 'bg-emerald-500' : formData.password.length >= 6 ? 'bg-amber-500' : 'bg-red-500') : 'bg-white/10'}`} />
                                        ))}
                                    </div>
                                    <p className={`text-[10px] mt-0.5 ${formData.password.length >= 8 ? 'text-emerald-400' : formData.password.length >= 6 ? 'text-amber-400' : 'text-red-400'}`}>
                                        {formData.password.length >= 8 ? 'Strong password' : formData.password.length >= 6 ? 'Good password' : 'Min 6 characters required'}
                                    </p>
                                </div>
                            )}
                        </div>

                        <button type="submit" disabled={loading || !!success}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                            {loading ? (
                                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                            ) : success ? (
                                <><CheckCircle size={16} /> Done!</>
                            ) : isLogin ? (
                                'Sign In'
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button type="button" onClick={switchMode} className="text-indigo-400 font-bold hover:underline">
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthModal;
