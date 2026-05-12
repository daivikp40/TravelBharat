import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, Shield, Calendar, Edit3, Save, X, LogOut,
    Briefcase, Heart, MapPin, Clock, ChevronRight, CheckCircle, AlertCircle, Lock, Eye, EyeOff
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Profile = () => {
    const navigate = useNavigate();
    const { user, setUser, logout, favorites, recentlyViewed, setAuthModalOpen } = useApp();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', phone: '' });
    const [passwordForm, setPasswordForm] = useState({ password: '', confirm: '' });
    const [changingPassword, setChangingPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    const [bookingCount, setBookingCount] = useState(0);

    useEffect(() => {
        if (!user) {
            setAuthModalOpen(true);
            navigate('/');
            return;
        }
        setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });

        // Fetch booking count
        axios.get(`${API_URL}/api/bookings/my`, {
            headers: { Authorization: `Bearer ${user.token}` }
        }).then(res => setBookingCount(Array.isArray(res.data) ? res.data.length : 0))
            .catch(() => setBookingCount(0));
    }, [user]);

    if (!user) return null;

    const handleSave = async () => {
        if (!form.name.trim()) {
            toast.error('Name is required');
            return;
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/.test(form.email)) {
            toast.error('Invalid email format (e.g. name@example.com)');
            return;
        }
        const emailTld = form.email.split('.').pop().toLowerCase();
        const badTLDs = ['con', 'cmo', 'ocm', 'nrt', 'ogr', 'ner', 'coj', 'vom', 'xom', 'gml', 'cm'];
        if (badTLDs.includes(emailTld)) {
            toast.error(`Did you mean .com? ".${emailTld}" is not a valid domain`);
            return;
        }
        if (form.phone.trim()) {
            const cleanPhone = form.phone.replace(/[\s-]/g, '');
            if (!/^(\+91)?[6-9]\d{9}$/.test(cleanPhone)) {
                toast.error('Invalid phone number (10 digits, e.g. +91 98765 43210)');
                return;
            }
        }
        setSaving(true);
        try {
            const payload = { name: form.name, email: form.email, phone: form.phone };
            const { data } = await axios.put(`${API_URL}/api/auth/profile`, payload, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setUser(data);
            setEditing(false);
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (passwordForm.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }
        if (passwordForm.password !== passwordForm.confirm) {
            toast.error('Passwords do not match');
            return;
        }
        setSaving(true);
        try {
            const { data } = await axios.put(`${API_URL}/api/auth/profile`, { password: passwordForm.password }, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setUser(data);
            setChangingPassword(false);
            setPasswordForm({ password: '', confirm: '' });
            toast.success('Password updated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update password');
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('Signed out successfully');
        navigate('/');
    };

    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long' })
        : 'Recently';

    const initials = user.name?.split(' ').map(n => n.charAt(0)).join('').substring(0, 2).toUpperCase() || 'U';

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14 min-h-[70vh]">
            {/* Profile Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card overflow-hidden mb-8">
                {/* Cover gradient */}
                <div className="h-32 sm:h-40 bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-emerald-600/10 relative">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524492707947-54b2bb40a516?w=1200&q=30')] bg-cover bg-center opacity-10" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#060f23]" />
                </div>

                {/* Avatar & Basic Info */}
                <div className="px-6 sm:px-8 pb-6 sm:pb-8 -mt-12 sm:-mt-16 relative">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl sm:text-4xl font-black text-white border-4 border-[#060f23] shadow-2xl shadow-indigo-500/30 shrink-0">
                            {initials}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-black italic uppercase text-white tracking-tight">{user.name}</h1>
                            <p className="text-gray-400 text-sm mt-1">{user.email}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                <span className={`badge ${user.role === 'admin' ? 'badge-amber' : 'badge-indigo'}`}>
                                    <Shield size={10} /> {user.role === 'admin' ? 'Admin' : 'Traveller'}
                                </span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Calendar size={11} /> Member since {memberSince}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                            <button onClick={() => setEditing(!editing)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:border-indigo-500/40 text-xs font-bold transition-all">
                                <Edit3 size={13} /> {editing ? 'Cancel' : 'Edit Profile'}
                            </button>
                            <button onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-bold transition-all">
                                <LogOut size={13} /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left — Stats & Quick Links */}
                <div className="space-y-6">
                    {/* Stats Grid */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Trips', value: bookingCount, icon: Briefcase, color: 'indigo' },
                            { label: 'Favorites', value: favorites.length, icon: Heart, color: 'red' },
                            { label: 'Viewed', value: recentlyViewed.length, icon: Eye, color: 'purple' },
                            { label: 'Reviews', value: '—', icon: MapPin, color: 'emerald' },
                        ].map(({ label, value, icon: Icon, color }) => (
                            <div key={label} className="glass-card p-4 text-center hover:scale-[1.02] transition-transform">
                                <Icon size={18} className={`mx-auto mb-2 profile-icon-${color}`} />
                                <p className="text-xl font-black text-white">{value}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="glass-card p-5 space-y-2">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">Quick Links</h3>
                        {[
                            { label: 'My Trips', to: '/mytrips', icon: Briefcase, desc: 'View bookings' },
                            { label: 'Favorites', to: '/favorites', icon: Heart, desc: 'Saved states' },
                            { label: 'Packages', to: '/packages', icon: MapPin, desc: 'Browse tours' },
                        ].map(({ label, to, icon: Icon, desc }) => (
                            <Link key={to} to={to}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-indigo-500/30 hover:bg-white/5 transition-all group">
                                <Icon size={16} className="text-indigo-400 shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white">{label}</p>
                                    <p className="text-[10px] text-gray-500">{desc}</p>
                                </div>
                                <ChevronRight size={14} className="text-gray-600 group-hover:text-indigo-400 transition-colors" />
                            </Link>
                        ))}
                    </motion.div>

                    {/* Recently Viewed */}
                    {recentlyViewed.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="glass-card p-5">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3 flex items-center gap-2">
                                <Clock size={12} /> Recently Viewed
                            </h3>
                            <div className="space-y-2">
                                {recentlyViewed.map(s => (
                                    <Link key={s._id} to={`/state/${s._id}`}
                                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-all">
                                        <span className="text-sm text-gray-300 font-bold">{s.name}</span>
                                        <ChevronRight size={12} className="text-gray-600" />
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right — Profile Details & Edit Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile Information */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                        className="glass-card p-6 sm:p-8">
                        <h2 className="text-lg font-black uppercase italic text-white mb-6 flex items-center gap-2">
                            <User size={18} className="text-indigo-400" /> Personal Information
                        </h2>

                        {editing ? (
                            <div className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 outline-none transition-all"
                                            placeholder="Your name" />
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Email Address</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 outline-none transition-all"
                                            placeholder="your@email.com" />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Phone Number</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 outline-none transition-all"
                                            placeholder="+91 98765 43210" />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button onClick={handleSave} disabled={saving}
                                        className="btn-primary flex-1 justify-center !py-3 disabled:opacity-50">
                                        {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><Save size={14} /> Save Changes</>}
                                    </button>
                                    <button onClick={() => { setEditing(false); setForm({ name: user.name, email: user.email, phone: user.phone || '' }); }}
                                        className="btn-ghost !py-3">
                                        <X size={14} /> Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {[
                                    { icon: User, label: 'Full Name', value: user.name, color: 'indigo' },
                                    { icon: Mail, label: 'Email', value: user.email, color: 'emerald' },
                                    { icon: Phone, label: 'Phone', value: user.phone || 'Not provided', color: 'amber' },
                                    { icon: Shield, label: 'Role', value: user.role === 'admin' ? 'Administrator' : 'Traveller', color: 'purple' },
                                    { icon: Calendar, label: 'Member Since', value: memberSince, color: 'blue' },
                                ].map(({ icon: Icon, label, value, color }) => (
                                    <div key={label} className="flex items-center gap-4 p-4 bg-white/3 rounded-2xl border border-white/5">
                                        <div className={`p-2.5 rounded-xl profile-bg-${color} shrink-0`}>
                                            <Icon size={16} className={`profile-icon-${color}`} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</p>
                                            <p className="text-sm font-bold text-white mt-0.5">{value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Change Password */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                        className="glass-card p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-lg font-black uppercase italic text-white flex items-center gap-2">
                                <Lock size={18} className="text-amber-400" /> Security
                            </h2>
                            <button onClick={() => setChangingPassword(!changingPassword)}
                                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                                {changingPassword ? 'Cancel' : 'Change Password'}
                            </button>
                        </div>

                        {changingPassword ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">New Password</label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input type={showPassword ? 'text' : 'password'} value={passwordForm.password}
                                            onChange={e => setPasswordForm({ ...passwordForm, password: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white focus:border-indigo-500 outline-none transition-all"
                                            placeholder="Min 6 characters" />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">Confirm Password</label>
                                    <div className="relative">
                                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input type="password" value={passwordForm.confirm}
                                            onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                                            className={`w-full bg-white/5 border rounded-xl py-3 pl-10 pr-4 text-white focus:border-indigo-500 outline-none transition-all ${passwordForm.confirm && passwordForm.confirm !== passwordForm.password ? 'border-red-500/50' : 'border-white/10'}`}
                                            placeholder="Repeat password" />
                                    </div>
                                    {passwordForm.confirm && passwordForm.confirm !== passwordForm.password && (
                                        <p className="text-red-400 text-[10px] mt-1 flex items-center gap-1"><AlertCircle size={10} /> Passwords don't match</p>
                                    )}
                                    {passwordForm.confirm && passwordForm.confirm === passwordForm.password && passwordForm.password.length >= 6 && (
                                        <p className="text-emerald-400 text-[10px] mt-1 flex items-center gap-1"><CheckCircle size={10} /> Passwords match</p>
                                    )}
                                </div>
                                <button onClick={handlePasswordChange} disabled={saving || passwordForm.password.length < 6 || passwordForm.password !== passwordForm.confirm}
                                    className="btn-primary !py-3 w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed">
                                    {saving ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-4 bg-white/3 rounded-2xl border border-white/5">
                                <CheckCircle size={16} className="text-emerald-400 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-white">Password is secure</p>
                                    <p className="text-[10px] text-gray-500">Last updated: {memberSince}</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
