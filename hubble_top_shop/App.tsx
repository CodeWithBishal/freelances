import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import NewArrivals from './components/NewArrivals';
import CategoryGrid from './components/CategoryGrid';
import CardStack from './components/CardStack';
import CustomCursor from './components/CustomCursor';
import Preloader from './components/Preloader';
import { Linkedin, Twitter, Facebook } from 'lucide-react';

// Declaration for Lenis if not using TS types package
declare global {
  interface Window {
    Lenis: any;
  }
}

const Footer: React.FC = () => (
  <footer className="bg-black text-gray-400 py-20 px-6 border-t border-gray-900 relative z-50">
    <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div>
        <h3 className="text-white text-3xl font-display font-bold mb-6">Hubble</h3>
        <p className="text-sm leading-relaxed mb-6 font-light">
          The ultimate destination for premium Marvel, Anime, and Pop Culture collectibles.
        </p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors hover:scale-110 transform duration-300"><Linkedin size={20} /></a>
          <a href="#" className="hover:text-white transition-colors hover:scale-110 transform duration-300"><Twitter size={20} /></a>
          <a href="#" className="hover:text-white transition-colors hover:scale-110 transform duration-300"><Facebook size={20} /></a>
        </div>
      </div>
      
      <div>
        <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-6">Universes</h4>
        <ul className="space-y-3 text-sm">
          <li><a href="#" className="hover:text-white transition-colors">Marvel Cinematic</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Shonen Jump</a></li>
          <li><a href="#" className="hover:text-white transition-colors">DC Extended</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Star Wars</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-6">Support</h4>
        <ul className="space-y-3 text-sm">
          <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
          <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-white font-bold uppercase tracking-wider text-xs mb-6">Newsletter</h4>
        <p className="text-xs mb-4">Join the club. Get early access to limited drops.</p>
        <div className="flex border-b border-white pb-2 group focus-within:border-brand-accent">
            <input type="email" placeholder="Enter your email" className="bg-transparent w-full outline-none text-white placeholder-gray-600" />
            <button className="text-white uppercase font-bold text-xs hover:text-gray-300 transition-colors">Join</button>
        </div>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  useEffect(() => {
    // Initialize Lenis for smooth scrolling
    const lenis = new window.Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black cursor-none">
      <CustomCursor />
      <Preloader />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <NewArrivals />
        <CategoryGrid />
        <CardStack />
      </main>
      <Footer />
    </div>
  );
};

export default App;