import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, Phone, Satellite } from 'lucide-react';
import { NAV_LINKS } from '../constants';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white text-black shadow-sm transition-all duration-300">
      {/* Top Bar */}
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          
          {/* Left: Search & Contact */}
          <div className="hidden md:flex items-center gap-6">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
              <Search size={20} className="group-hover:scale-110 transition-transform" />
            </button>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
              <Phone size={14} />
              <span>+91 8237511551</span>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Center: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <a href="#" className="flex flex-col items-center group">
              <div className="relative">
                <span className="text-3xl md:text-4xl font-display font-extrabold tracking-tighter group-hover:tracking-normal transition-all duration-500">
                    Hubble
                </span>
                <Satellite className="absolute -top-3 -right-6 w-5 h-5 md:w-6 md:h-6 text-gray-800 animate-float" strokeWidth={1.5} />
              </div>
              <span className="hidden md:block text-[10px] text-gray-500 tracking-[0.3em] uppercase mt-1 group-hover:text-black transition-colors">Collectibles</span>
            </a>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors group">
              <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-black rounded-full border-2 border-white"></span>
            </button>
            <button className="hidden md:flex items-center gap-2 text-sm font-semibold hover:text-gray-600 transition-colors">
              Sign in
            </button>
            <button className="hidden md:block bg-black text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Navigation */}
      <div className={`
        md:block border-t border-gray-100 bg-white
        ${isMenuOpen ? 'block absolute top-full left-0 w-full shadow-lg p-6 animate-in slide-in-from-top-5' : 'hidden'}
      `}>
        <div className="container mx-auto px-4">
          <ul className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 py-3">
            {NAV_LINKS.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href} 
                  className="text-sm font-semibold uppercase tracking-wide hover:text-gray-500 transition-colors relative group py-1"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;