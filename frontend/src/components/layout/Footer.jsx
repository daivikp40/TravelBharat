import { Link } from 'react-router-dom';
import { Globe, Heart, MapPin, Phone, Mail } from 'lucide-react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => (
  <footer className="footer">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      {/* Main Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 py-10 sm:py-14">
        {/* Brand */}
        <div className="col-span-2 sm:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg">
              <Globe className="text-white" size={18}/>
            </div>
            <div className="leading-none">
              <span className="text-sm font-black italic tracking-tighter uppercase text-white block">TravelBharat</span>
              <span className="text-[7px] font-bold tracking-[0.3em] uppercase text-emerald-400">Discover India 2026</span>
            </div>
          </Link>
          <p className="text-gray-500 text-xs leading-relaxed max-w-xs mb-4">
            India's premier digital travel companion. Explore 28+ states, 500+ destinations, curated packages & premium hotels.
          </p>
          <div className="flex gap-2">
            {[FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
              <a key={i} href="#" className="p-2 rounded-xl bg-white/5 border border-white/8 text-gray-500 hover:text-white hover:border-indigo-500/40 transition-all">
                <Icon size={14}/>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Explore</h4>
          <ul className="space-y-2.5">
            {[['/', 'All States'], ['/packages', 'Packages'], ['/hotels', 'Hotels'], ['/favorites', 'Favorites'], ['/about', 'About Us']].map(([to, label]) => (
              <li key={to}><Link to={to} className="text-xs text-gray-500 hover:text-white transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Popular */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Popular</h4>
          <ul className="space-y-2.5">
            {[['rajasthan', 'Rajasthan'], ['kerala', 'Kerala'], ['goa', 'Goa'], ['himachal-pradesh', 'Himachal Pradesh'], ['kashmir', 'Kashmir']].map(([id, name]) => (
              <li key={id}><Link to={`/state/${id}`} className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1.5"><MapPin size={10}/>{name}</Link></li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Contact</h4>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-xs text-gray-500"><Phone size={12} className="text-emerald-400 shrink-0"/>1800-TRAVEL-TB</li>
            <li className="flex items-center gap-2 text-xs text-gray-500"><Mail size={12} className="text-indigo-400 shrink-0"/>hello@travelbharat.in</li>
            <li className="flex items-start gap-2 text-xs text-gray-500"><MapPin size={12} className="text-amber-400 shrink-0 mt-0.5"/>New Delhi, India</li>
          </ul>
          <div className="mt-5 flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
            <Heart size={12} className="text-emerald-400 shrink-0"/>
            <span className="text-[10px] text-emerald-300 font-bold">Made with love in India</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[10px] text-gray-600 font-bold tracking-wider uppercase">© 2026 TravelBharat. All rights reserved.</p>
        <div className="flex gap-4 text-[10px] text-gray-600 font-bold tracking-wider uppercase">
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Support</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
