import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, Search, Heart, Menu, X, ChevronRight, Compass, Package, Hotel, Info, Shield, LogOut, LogIn, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';

const NAV_LINKS = [
  { label: 'Explore', to: '/', icon: Compass },
  { label: 'Packages', to: '/packages', icon: Package },
  { label: 'Hotels', to: '/hotels', icon: Hotel },
  { label: 'Favorites', to: '/favorites', icon: Heart },
  { label: 'About', to: '/about', icon: Info },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites, globalSearch, setGlobalSearch, isNavOpen, setIsNavOpen, user, logout, setAuthModalOpen } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(globalSearch);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setIsNavOpen(false); setSearchOpen(false); }, [location.pathname]);

  const handleSearch = e => {
    e.preventDefault();
    setGlobalSearch(localSearch);
    navigate('/');
    setSearchOpen(false);
  };

  const isAdmin = location.pathname === '/admin';

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#020617]/97 backdrop-blur-2xl border-b border-white/8 shadow-2xl shadow-black/60' : 'bg-black/30 backdrop-blur-xl border-b border-white/5'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <motion.div whileHover={{ rotate:15, scale:1.1 }} transition={{ type:'spring', stiffness:400 }}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 sm:p-2 rounded-lg sm:rounded-xl shadow-lg shadow-indigo-500/30">
              <Globe className="text-white" size={18}/>
            </motion.div>
            <div className="leading-none">
              <span className="text-base sm:text-lg font-black italic tracking-tighter uppercase text-white block">TravelBharat</span>
              <span className="text-[7px] sm:text-[8px] font-bold tracking-[0.3em] uppercase text-emerald-400">Discover India 2026</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, to, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link key={to} to={to}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 ${active ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <Icon size={13}/>
                  {label}
                  {label === 'Favorites' && favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{favorites.length}</span>
                  )}
                  {active && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-indigo-600/20 border border-indigo-500/30 rounded-xl -z-10"/>}
                </Link>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-indigo-500/50 hover:bg-white/5 transition-all">
              <Search size={16}/>
            </button>
            <Link to="/admin" title="Admin Panel"
              className={`p-2 rounded-xl border transition-all hidden sm:flex ${isAdmin ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-white/10 text-gray-500 hover:text-white hover:border-indigo-500/40 hover:bg-white/5'}`}>
              <Shield size={16}/>
            </Link>
            
            {/* User Auth — Desktop */}
            {user ? (
              <div className="hidden md:flex items-center gap-2 pl-2 border-l border-white/10">
                <Link to="/mytrips" className="text-xs font-bold text-gray-300 hover:text-white px-2 flex items-center gap-1.5">
                  <Briefcase size={13}/> My Trips
                </Link>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                  <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-black">{user.name.charAt(0)}</div>
                  <button onClick={logout} className="text-xs text-red-400 hover:text-red-300 font-bold ml-1">Logout</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAuthModalOpen(true)} className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all ml-1">
                Sign In
              </button>
            )}

            <button onClick={() => setIsNavOpen(!isNavOpen)} className="lg:hidden p-2 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all">
              {isNavOpen ? <X size={18}/> : <Menu size={18}/>}
            </button>
          </div>
        </div>

        {/* Search Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} className="border-t border-white/5 overflow-hidden">
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4 sm:px-5 py-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl blur opacity-30 group-focus-within:opacity-60 transition duration-500"/>
                  <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-indigo-400 z-10" size={16}/>
                  <input autoFocus type="text" value={localSearch} onChange={e => setLocalSearch(e.target.value)}
                    placeholder="Search states, destinations..." className="relative w-full bg-[#0f172a] border border-white/10 rounded-2xl py-3 sm:py-3.5 pl-11 sm:pl-12 pr-16 outline-none focus:border-indigo-500 transition-all text-sm z-10"/>
                  <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all z-10">GO</button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isNavOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={() => setIsNavOpen(false)} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"/>
            <motion.div initial={{ x:'100%' }} animate={{ x:0 }} exit={{ x:'100%' }} transition={{ type:'spring', damping:25, stiffness:200 }}
              className="fixed right-0 top-0 h-full w-[280px] max-w-[85vw] bg-[#050e1f] border-l border-white/10 z-50 lg:hidden flex flex-col">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                <span className="font-black text-lg italic uppercase text-white">Menu</span>
                <button onClick={() => setIsNavOpen(false)} className="text-gray-400 hover:text-white p-1"><X size={22}/></button>
              </div>

              {/* User info in drawer */}
              {user && (
                <div className="px-5 py-4 border-b border-white/5 bg-indigo-600/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-black">{user.name.charAt(0)}</div>
                    <div>
                      <p className="font-bold text-white text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
                {[...NAV_LINKS, { label:'My Trips', to:'/mytrips', icon: Briefcase }, { label:'Admin', to:'/admin', icon: Shield }].map(({ label, to, icon: Icon }) => {
                  const active = location.pathname === to;
                  // Hide My Trips if not logged in
                  if (label === 'My Trips' && !user) return null;
                  return (
                    <Link key={to} to={to}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all ${active ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                      <span className="flex items-center gap-3"><Icon size={17}/>{label}</span>
                      {label === 'Favorites' && favorites.length > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{favorites.length}</span>
                      )}
                      {label !== 'Favorites' && <ChevronRight size={15}/>}
                    </Link>
                  );
                })}
              </div>

              {/* Auth Action in drawer */}
              <div className="p-4 border-t border-white/5">
                {user ? (
                  <button onClick={() => { logout(); setIsNavOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold text-sm hover:bg-red-500/20 transition-all">
                    <LogOut size={16}/> Sign Out
                  </button>
                ) : (
                  <button onClick={() => { setAuthModalOpen(true); setIsNavOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-all">
                    <LogIn size={16}/> Sign In
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;