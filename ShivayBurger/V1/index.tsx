import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Phone, MapPin, Clock, Instagram, Menu as MenuIcon, X, ExternalLink, MessageCircle, Star, Utensils, Zap, Leaf } from 'lucide-react';

// --- Types ---
type MenuItem = {
  name: string;
  price: number;
  description?: string;
};

type MenuCategory = {
  id: string;
  title: string;
  items: MenuItem[];
};

// --- Data ---
const menuData: MenuCategory[] = [
  {
    id: 'burger',
    title: 'Burgers',
    items: [
      { name: 'Aloo Tikki Burger', price: 39 },
      { name: 'Veg Tikki Burger', price: 49 },
      { name: 'Vegetable Burger', price: 59 },
      { name: 'Cheese Burst Burger', price: 69 },
      { name: 'Paneer Burger', price: 79 },
      { name: 'Paneer Cheese Burger', price: 99 },
      { name: 'Mexican Cheese Burger', price: 99 },
    ]
  },
  {
    id: 'fries',
    title: 'Fries',
    items: [
      { name: 'Salted Fries', price: 49 },
      { name: 'Masala Fries', price: 59 },
      { name: 'Peri Peri Fries', price: 69 },
      { name: 'Cheese Fries', price: 89 },
    ]
  },
  {
    id: 'pizza',
    title: 'Pizza',
    items: [
      { name: 'Corn Cheese Pizza', price: 59 },
      { name: 'Vegetable Pizza', price: 79 },
      { name: 'Margherita Pizza', price: 79 },
      { name: 'Italian Margherita Pizza', price: 89 },
      { name: 'Paneer Cheese Pizza', price: 99 },
      { name: 'Paneer Corn Pizza', price: 110 },
      { name: 'Capsicum Paneer Pizza', price: 110 },
      { name: 'Mexican Cheese Pizza', price: 120 },
      { name: 'All In One Pizza', price: 140 },
      { name: 'Creamy Cottage Cheese Pizza', price: 140 },
    ]
  },
  {
    id: 'momos',
    title: 'Momos',
    items: [
      { name: 'Veg Momos (Fried)', price: 39 },
      { name: 'Cheese Corn Momos (Fried)', price: 69 },
      { name: 'Paneer Momos (Fried)', price: 69 },
      { name: 'Veg Momos (Steam)', price: 39 },
      { name: 'Cheese Corn Momos (Steam)', price: 69 },
      { name: 'Paneer Momos (Steam)', price: 69 },
    ]
  },
  {
    id: 'maggi',
    title: 'Maggi',
    items: [
      { name: 'Plain Maggi', price: 39 },
      { name: 'Vegetable Maggi', price: 49 },
      { name: 'Masala Maggi', price: 49 },
      { name: 'Cheese Maggi', price: 79 },
      { name: 'Masala Cheese Maggi', price: 89 },
      { name: 'Vegetable Cheese Maggi', price: 89 },
    ]
  },
  {
    id: 'sandwich',
    title: 'Sandwich',
    items: [
      { name: 'Vegetable Sandwich', price: 39 },
      { name: 'Masala Sandwich', price: 49 },
      { name: 'Cheese Chutni', price: 69 },
      { name: 'Vegetable Cheese Sandwich', price: 79 },
      { name: 'Masala Cheese Sandwich', price: 89 },
      { name: 'Bombay Kachha Sandwich', price: 89 },
      { name: 'Bombay Grilled Sandwich', price: 99 },
      { name: 'Nutella Sandwich', price: 99 },
      { name: 'Jumbo Sandwich', price: 129 },
    ]
  },
  {
    id: 'pasta',
    title: 'Pasta',
    items: [
      { name: 'Red Sauce Pasta', price: 110 },
      { name: 'White Sauce Pasta', price: 110 },
      { name: 'Pink Sauce Pasta', price: 130 },
    ]
  },
  {
    id: 'beverages',
    title: 'Beverages',
    items: [
      { name: 'Cold Coffee', price: 49 },
      { name: 'Classic Cold Coffee', price: 69 },
      { name: 'Hazelnut Cold Coffee', price: 79 },
      { name: 'Cold Coffee With Ice Cream', price: 79 },
      { name: 'Oreo Shake', price: 79 },
      { name: 'Kitkat Choco Shake', price: 79 },
    ]
  },
  {
    id: 'mojito',
    title: 'Mojito',
    items: [
      { name: 'Lime & Mint Mojito', price: 69 },
      { name: 'Blue Curacao Mojito', price: 69 },
      { name: 'Green Apple Mojito', price: 79 },
      { name: 'Blueberry Mojito', price: 79 },
    ]
  },
  {
    id: 'juice_shake',
    title: 'Juice & Shake',
    items: [
      { name: 'Mausambi Juice', price: 39 },
      { name: 'Banana Shake', price: 49 },
      { name: 'Chiku Shake', price: 59 },
      { name: 'Strawberry Shake', price: 59 },
      { name: 'Butterscotch Shake', price: 69 },
      { name: 'Sitafal Shake', price: 69 },
    ]
  },
  {
    id: 'ice_cream',
    title: 'Ice Cream',
    items: [
      { name: 'Vanila Ice Cream', price: 30 },
      { name: 'Strawberry Ice Cream', price: 30 },
      { name: 'Butterscotch Ice Cream', price: 40 },
      { name: 'Chocolate Ice Cream', price: 50 },
    ]
  }
];

const CONTACT_INFO = {
  phone: '8878883540',
  whatsapp: '918878883540',
  address: 'Indore, MP',
  timings: '11:00 AM - 11:00 PM (Daily)',
  instagram: '#'
};

const WHATSAPP_LINK = `https://wa.me/${CONTACT_INFO.whatsapp}?text=Hi%20Shivay%20Burger,%20I'd%20like%20to%20place%20an%20order.`;

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'About', href: '#about' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-brand-black/95 backdrop-blur-md shadow-lg border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <span className="font-heading font-bold text-3xl text-brand-yellow tracking-wider uppercase">
                Shivay <span className="text-white">Burger</span>
              </span>
            </div>
            {/* Veg Symbol */}
            <div className="hidden sm:flex border border-green-500 p-1 w-6 h-6 items-center justify-center rounded-sm" title="100% Pure Veg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="font-body text-gray-300 hover:text-brand-yellow px-3 py-2 rounded-md text-sm font-semibold uppercase tracking-wide transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
             <a
              href={`tel:+91${CONTACT_INFO.phone}`}
              className="flex items-center gap-2 bg-brand-yellow hover:bg-yellow-500 text-brand-black px-6 py-2 rounded-full font-heading font-bold uppercase tracking-wide transition-all transform hover:scale-105"
            >
              <Phone size={18} className="fill-current" />
              <span>Call Now</span>
            </a>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-brand-gray inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-brand-black border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-brand-yellow block px-3 py-2 rounded-md text-base font-medium font-body"
              >
                {link.name}
              </a>
            ))}
             <a
              href={`tel:+91${CONTACT_INFO.phone}`}
              className="w-full mt-4 flex justify-center items-center gap-2 bg-brand-yellow text-brand-black px-4 py-3 rounded font-heading font-bold uppercase"
            >
              <Phone size={18} />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <div id="home" className="relative h-screen min-h-[600px] flex items-center justify-center bg-brand-black overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/assets/burger.jpeg"
          alt="Delicious Burger" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-transparent"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
        
        {/* Welcome Tag - Separated at top */}
        <div className="mb-4">
           <div className="inline-block px-4 py-1 border border-brand-yellow rounded-full bg-brand-yellow/10 backdrop-blur-sm">
             <span className="text-brand-yellow font-body font-semibold tracking-wider text-xs md:text-sm">WELCOME TO SHIVAY BURGER</span>
           </div>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white mb-6 uppercase leading-tight drop-shadow-2xl">
          The Ultimate <br/>
          <span className="text-brand-yellow">Taste of Happiness</span>
        </h1>
        
        {/* Dietary Tags - Moved below title for better emphasis */}
        <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
           <div className="flex items-center gap-2 px-4 py-1.5 border border-green-500 rounded-full bg-green-900/60 backdrop-blur-sm shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:scale-105 transition-transform">
              <div className="border border-green-500 p-0.5 w-4 h-4 flex items-center justify-center rounded-[2px]">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <span className="text-green-400 font-body font-semibold tracking-wider text-xs md:text-sm uppercase">100% Pure Veg</span>
           </div>
           
           <div className="flex items-center gap-2 px-4 py-1.5 border border-orange-400 rounded-full bg-orange-900/60 backdrop-blur-sm shadow-[0_0_10px_rgba(251,146,60,0.3)] hover:scale-105 transition-transform">
               <Leaf className="w-3 h-3 text-orange-400 fill-orange-400" />
               <span className="text-orange-400 font-body font-semibold tracking-wider text-xs md:text-sm uppercase">Jain Food Available</span>
           </div>
        </div>

        <p className="text-lg md:text-2xl text-gray-300 font-body max-w-2xl mx-auto mb-10 leading-relaxed">
          Serving the best fast food cravings in town. Fresh, hot, and delicious burgers, shakes, and more.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a 
            href="#menu"
            className="w-full sm:w-auto px-8 py-4 bg-brand-red hover:bg-red-700 text-white font-heading font-bold text-lg uppercase tracking-widest rounded transition-all transform hover:-translate-y-1 shadow-lg shadow-red-900/50"
          >
            View Full Menu
          </a>
          <a 
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-brand-black text-white font-heading font-bold text-lg uppercase tracking-widest rounded transition-all"
          >
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Utensils className="w-8 h-8 text-brand-black" />,
      title: "Wide Variety",
      desc: "From loaded burgers to Italian pastas and refreshing mojitos."
    },
    {
      icon: <Zap className="w-8 h-8 text-brand-black" />,
      title: "Pocket-Friendly",
      desc: "Delicious meals starting at just ₹39. Tasty doesn't have to be expensive."
    },
    {
      icon: <Leaf className="w-8 h-8 text-brand-black" />,
      title: "Freshly Made",
      desc: "Every order is prepared fresh with high-quality ingredients."
    }
  ];

  return (
    <div className="relative -mt-20 z-20 px-4 max-w-7xl mx-auto mb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-brand-yellow p-8 rounded-lg shadow-xl hover:shadow-2xl transition-transform hover:-translate-y-2 flex flex-col items-center text-center">
            <div className="mb-4 bg-white/20 p-4 rounded-full">
              {feature.icon}
            </div>
            <h3 className="font-heading text-2xl font-bold text-brand-black mb-2 uppercase">{feature.title}</h3>
            <p className="font-body text-brand-black/80 font-medium">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const MenuSection = () => {
  const [activeCategory, setActiveCategory] = useState('burger');

  const activeItems = menuData.find(c => c.id === activeCategory)?.items || [];

  return (
    <section id="menu" className="py-20 bg-brand-black scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-red font-heading font-bold tracking-widest uppercase text-lg">Our Menu</span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mt-2 mb-6 uppercase">
            Choose Your <span className="text-brand-yellow">Cravings</span>
          </h2>
          <div className="w-24 h-1 bg-brand-yellow mx-auto"></div>
        </div>

        {/* Category Tabs - Mobile Scrollable */}
        <div className="flex overflow-x-auto pb-6 mb-8 gap-3 md:gap-4 md:justify-center no-scrollbar">
          {menuData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-6 py-3 rounded-full font-heading font-bold uppercase tracking-wider text-sm transition-all border ${
                activeCategory === cat.id
                  ? 'bg-brand-yellow text-brand-black border-brand-yellow shadow-[0_0_15px_rgba(255,193,7,0.4)]'
                  : 'bg-transparent text-gray-400 border-gray-700 hover:border-brand-yellow hover:text-white'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeItems.map((item, idx) => (
            <div key={idx} className="glass-card p-6 rounded-xl hover:bg-white/5 transition-colors group relative overflow-hidden">
               {/* Decoration line */}
               <div className="absolute top-0 left-0 w-1 h-full bg-brand-yellow opacity-0 group-hover:opacity-100 transition-opacity"></div>
               
               <div className="flex justify-between items-start gap-4">
                 <div className="flex-1">
                   <h3 className="font-heading text-xl font-bold text-white mb-2 group-hover:text-brand-yellow transition-colors">{item.name}</h3>
                   {item.description && <p className="text-gray-400 text-sm font-body">{item.description}</p>}
                 </div>
                 <div className="text-right">
                   <span className="block font-heading text-2xl font-bold text-brand-red">₹{item.price}</span>
                 </div>
               </div>
               
               <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
                 <span className="text-xs text-gray-400 font-body uppercase tracking-wide">{menuData.find(c => c.id === activeCategory)?.title}</span>
                 <a 
                   href={WHATSAPP_LINK} 
                   target="_blank" 
                   rel="noreferrer"
                   className="text-xs bg-white/10 hover:bg-brand-yellow hover:text-brand-black text-white px-3 py-1 rounded transition-colors"
                 >
                   Add +
                 </a>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const images = [
    { src: "/assets/burger.jpeg", alt: "Burger" },
    { src: "/assets/pizza.jpeg", alt: "Pizza" },
    { src: "/assets/momo.jpeg", alt: "Momos" },
    { src: "/assets/sandwich.jpeg", alt: "Sandwich" },
    { src: "/assets/shakes.jpeg", alt: "Shakes" },
    { src: "/assets/fries.jpeg", alt: "Fries" },
  ];

  return (
    <section id="gallery" className="py-20 bg-brand-dark scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 uppercase">
            Food <span className="text-brand-red">Gallery</span>
          </h2>
          <p className="text-gray-400 font-body">A glimpse of our delicious offerings</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square overflow-hidden rounded-lg group">
              <img 
                src={img.src} 
                alt={img.alt} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-brand-yellow font-heading font-bold text-xl uppercase tracking-widest">{img.alt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-20 bg-brand-black relative overflow-hidden">
      {/* Abstract bg element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
             <div className="absolute -inset-4 border-2 border-brand-yellow/30 rounded-lg transform translate-x-4 translate-y-4"></div>
             <img 
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000" 
              alt="Restaurant Interior" 
              className="rounded-lg shadow-2xl relative z-10 w-full"
            />
          </div>
          <div>
            <span className="text-brand-yellow font-heading font-bold text-lg uppercase tracking-wider mb-2 block">Our Story</span>
            <h2 className="text-4xl font-heading font-bold text-white mb-6 uppercase">Quality Food, <br/> Great <span className="text-brand-red">Vibes</span></h2>
            <p className="text-gray-300 font-body mb-6 leading-relaxed">
              At Shivay Burger, we believe that great food brings people together. Located in the heart of Indore, we serve a variety of modern street food with a premium twist.
            </p>
            <p className="text-gray-300 font-body mb-8 leading-relaxed">
              Whether you're craving a cheesy burger, spicy momos, or a refreshing shake, we use only the freshest ingredients to ensure every bite is full of flavor. Come visit us for a memorable dining experience!
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-brand-gray/50 p-4 rounded text-center">
                <span className="block text-3xl font-heading font-bold text-brand-yellow mb-1">50+</span>
                <span className="text-sm text-gray-400 font-body uppercase">Menu Items</span>
              </div>
               <div className="bg-brand-gray/50 p-4 rounded text-center">
                <span className="block text-3xl font-heading font-bold text-brand-yellow mb-1">100%</span>
                <span className="text-sm text-gray-400 font-body uppercase">Fresh Taste</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-brand-dark scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div>
            <h2 className="text-4xl font-heading font-bold text-white mb-8 uppercase">Visit Us <span className="text-brand-yellow">Today</span></h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-brand-yellow/10 p-3 rounded-full text-brand-yellow">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold font-heading text-lg uppercase">Address</h4>
                  <p className="text-gray-400 font-body">{CONTACT_INFO.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-brand-yellow/10 p-3 rounded-full text-brand-yellow">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold font-heading text-lg uppercase">Phone</h4>
                   <a href={`tel:+91${CONTACT_INFO.phone}`} className="text-gray-400 font-body hover:text-brand-yellow transition-colors">
                    +91 {CONTACT_INFO.phone}
                   </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="bg-brand-yellow/10 p-3 rounded-full text-brand-yellow">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="text-white font-bold font-heading text-lg uppercase">Opening Hours</h4>
                  <p className="text-gray-400 font-body">{CONTACT_INFO.timings}</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <a 
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-8 py-3 rounded font-heading font-bold uppercase tracking-wider transition-all"
              >
                <MessageCircle size={20} />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="h-[400px] w-full bg-brand-gray rounded-xl overflow-hidden relative group">
             {/* Simulating a map */}
             <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/75.8577,22.7196,13,0/800x600?access_token=pk.placeholder')] bg-cover bg-center opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500"></div>
             
             <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40">
                <MapPin size={48} className="text-brand-red mb-4 animate-bounce" />
                <h3 className="text-2xl font-heading font-bold text-white mb-2">Locate Us</h3>
                <p className="text-gray-300 font-body mb-6 max-w-xs">Find us in the heart of Indore. Click below for directions.</p>
                <button className="bg-brand-yellow text-brand-black px-6 py-2 rounded font-heading font-bold uppercase hover:bg-white transition-colors">
                  Get Directions
                </button>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black py-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="font-heading font-bold text-2xl text-white tracking-wider uppercase">
            Shivay <span className="text-brand-yellow">Burger</span>
          </span>
          <p className="text-gray-500 text-sm mt-2 font-body">© {new Date().getFullYear()} Shivay Burger. All rights reserved.</p>
        </div>
        
        <div className="flex gap-6">
          <a href="#" className="text-gray-400 hover:text-brand-yellow transition-colors"><Instagram /></a>
          <a href="#" className="text-gray-400 hover:text-brand-yellow transition-colors"><MessageCircle /></a>
        </div>
      </div>
    </footer>
  );
};

const FloatingWA = () => {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 hover:-translate-y-1 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={32} className="fill-current" />
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-black px-3 py-1 rounded text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
        Order Now
      </span>
    </a>
  );
};

// --- Main App ---

const App = () => {
  return (
    <div className="bg-brand-black min-h-screen text-white font-body selection:bg-brand-yellow selection:text-black">
      <Navbar />
      <Hero />
      <Features />
      <MenuSection />
      <Gallery />
      <About />
      <Contact />
      <Footer />
      <FloatingWA />
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}