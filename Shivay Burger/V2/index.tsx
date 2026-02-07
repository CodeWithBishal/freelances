import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Phone, MapPin, Clock, Instagram, Menu as MenuIcon, X, 
  ExternalLink, MessageCircle, Star, Utensils, Zap, Leaf, 
  ShoppingBag, Minus, Plus, Trash2, ArrowLeft, Bike, Store, CheckCircle 
} from 'lucide-react';

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

type CartItem = MenuItem & {
  quantity: number;
};

type OrderType = 'pickup' | 'delivery';

type OrderDetails = {
  name: string;
  phone: string;
  type: OrderType;
  address: string;
  notes: string;
};

type ViewState = 'home' | 'cart' | 'checkout' | 'success';

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

// --- Shared Components ---

const BackHeader = ({ title, onBack }: { title: string, onBack: () => void }) => (
  <div className="fixed top-0 left-0 w-full z-50 bg-brand-black border-b border-white/10 p-4 shadow-lg flex items-center gap-4">
    <button onClick={onBack} className="p-2 bg-white/10 rounded-full hover:bg-brand-yellow hover:text-black transition-colors">
      <ArrowLeft size={20} />
    </button>
    <h2 className="font-heading font-bold text-xl uppercase tracking-wider text-white">{title}</h2>
  </div>
);

// --- Sub-View Components ---

const Navbar = ({ cartCount, onCartClick }: { cartCount: number, onCartClick: () => void }) => {
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
              <span className="font-heading font-bold text-2xl md:text-3xl text-brand-yellow tracking-wider uppercase cursor-pointer" onClick={() => window.scrollTo(0,0)}>
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

          <div className="flex items-center gap-4">
             <button 
                onClick={onCartClick}
                className="relative p-2 text-white hover:text-brand-yellow transition-colors"
             >
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-brand-red text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                    {cartCount}
                  </span>
                )}
             </button>
             
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
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=2000&auto=format&fit=crop"
          alt="Delicious Burger" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/80 to-transparent"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
        <div className="mb-4">
           <div className="inline-block px-4 py-1 border border-brand-yellow rounded-full bg-brand-yellow/10 backdrop-blur-sm">
             <span className="text-brand-yellow font-body font-semibold tracking-wider text-xs md:text-sm">WELCOME TO SHIVAY BURGER</span>
           </div>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-white mb-6 uppercase leading-tight drop-shadow-2xl">
          The Ultimate <br/>
          <span className="text-brand-yellow">Taste of Happiness</span>
        </h1>
        
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
            Order Now
          </a>
        </div>
      </div>
    </div>
  );
};

const MenuSection = ({ 
  cart, 
  onAdd, 
  onRemove, 
  onUpdate 
}: { 
  cart: CartItem[], 
  onAdd: (item: MenuItem) => void,
  onRemove: (itemName: string) => void,
  onUpdate: (itemName: string, qty: number) => void
}) => {
  const [activeCategory, setActiveCategory] = useState('burger');
  const activeItems = menuData.find(c => c.id === activeCategory)?.items || [];

  const getQuantity = (itemName: string) => {
    return cart.find(i => i.name === itemName)?.quantity || 0;
  };

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

        <div className="sticky top-20 z-40 bg-brand-black/95 backdrop-blur-sm py-4 mb-8 -mx-4 px-4 md:static md:bg-transparent md:p-0">
          <div className="flex overflow-x-auto pb-2 gap-3 md:gap-4 md:justify-center no-scrollbar">
            {menuData.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-6 py-3 rounded-full font-heading font-bold uppercase tracking-wider text-sm transition-all border shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-brand-yellow text-brand-black border-brand-yellow shadow-[0_0_15px_rgba(255,193,7,0.4)]'
                    : 'bg-transparent text-gray-400 border-gray-700 hover:border-brand-yellow hover:text-white'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeItems.map((item, idx) => {
            const qty = getQuantity(item.name);
            return (
              <div key={idx} className="glass-card p-6 rounded-xl hover:bg-white/5 transition-colors group relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-brand-yellow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 
                 <div className="flex justify-between items-start gap-4 mb-4">
                   <div className="flex-1">
                     <h3 className="font-heading text-xl font-bold text-white mb-2 group-hover:text-brand-yellow transition-colors">{item.name}</h3>
                     {item.description && <p className="text-gray-400 text-sm font-body">{item.description}</p>}
                   </div>
                   <div className="text-right">
                     <span className="block font-heading text-2xl font-bold text-brand-red">₹{item.price}</span>
                   </div>
                 </div>
                 
                 <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                   <span className="text-xs text-gray-400 font-body uppercase tracking-wide">{menuData.find(c => c.id === activeCategory)?.title}</span>
                   
                   {qty === 0 ? (
                     <button 
                       onClick={() => onAdd(item)}
                       className="text-xs bg-white/10 hover:bg-brand-yellow hover:text-brand-black text-white px-4 py-2 rounded transition-colors font-bold uppercase"
                     >
                       Add +
                     </button>
                   ) : (
                     <div className="flex items-center gap-3 bg-brand-yellow text-brand-black rounded px-2 py-1">
                       <button onClick={() => onUpdate(item.name, -1)} className="p-1 hover:bg-black/10 rounded">
                         <Minus size={14} />
                       </button>
                       <span className="font-bold font-heading w-4 text-center">{qty}</span>
                       <button onClick={() => onUpdate(item.name, 1)} className="p-1 hover:bg-black/10 rounded">
                         <Plus size={14} />
                       </button>
                     </div>
                   )}
                 </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const StickyCartBar = ({ cart, onCheckout }: { cart: CartItem[], onCheckout: () => void }) => {
  if (cart.length === 0) return null;

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-brand-black border-t border-white/10 p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-gray-400 text-xs font-body uppercase">{count} items added</span>
          <span className="text-white text-xl font-heading font-bold">₹{total}</span>
        </div>
        <button 
          onClick={onCheckout}
          className="flex items-center gap-2 bg-brand-yellow hover:bg-yellow-500 text-brand-black px-6 py-3 rounded font-heading font-bold uppercase tracking-wider transition-all"
        >
          <span>View Cart</span>
          <ShoppingBag size={20} />
        </button>
      </div>
    </div>
  );
};

// --- View: Cart Page ---

const CartView = ({ 
  cart, 
  onBack, 
  onUpdate, 
  onRemove,
  onProceed
}: { 
  cart: CartItem[], 
  onBack: () => void,
  onUpdate: (name: string, delta: number) => void,
  onRemove: (name: string) => void,
  onProceed: () => void
}) => {
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-32 px-4">
      <BackHeader title="Your Cart" onBack={onBack} />
      
      <div className="max-w-2xl mx-auto">
        {cart.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <ShoppingBag size={64} className="mx-auto mb-4 text-gray-500" />
            <h3 className="text-2xl font-heading font-bold text-white">Your cart is empty</h3>
            <p className="text-gray-400 font-body mt-2">Add some delicious items from the menu!</p>
            <button onClick={onBack} className="mt-6 bg-white/10 px-6 py-2 rounded text-white font-bold uppercase">Browse Menu</button>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.name} className="glass-card p-4 rounded-lg flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-heading font-bold text-lg">{item.name}</h4>
                  <span className="text-brand-red font-bold">₹{item.price * item.quantity}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-white/10 rounded px-2 py-1">
                    <button onClick={() => onUpdate(item.name, -1)} className="p-1 hover:bg-white/20 rounded text-white"><Minus size={16} /></button>
                    <span className="font-bold font-heading text-white w-4 text-center">{item.quantity}</span>
                    <button onClick={() => onUpdate(item.name, 1)} className="p-1 hover:bg-white/20 rounded text-white"><Plus size={16} /></button>
                  </div>
                  <button onClick={() => onRemove(item.name)} className="text-gray-500 hover:text-brand-red p-2">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            <div className="border-t border-white/10 pt-4 mt-8 space-y-2">
              <div className="flex justify-between text-gray-400 font-body">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-white font-heading font-bold text-xl">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button 
              onClick={onProceed}
              className="w-full mt-8 bg-brand-yellow hover:bg-yellow-500 text-brand-black py-4 rounded font-heading font-bold text-lg uppercase tracking-wider"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- View: Checkout Page ---

const CheckoutView = ({ 
  cart, 
  onBack, 
  onSubmit 
}: { 
  cart: CartItem[], 
  onBack: () => void, 
  onSubmit: (details: OrderDetails) => void 
}) => {
  const [details, setDetails] = useState<OrderDetails>({
    name: '',
    phone: '',
    type: 'pickup',
    address: '',
    notes: ''
  });

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(details);
  };

  return (
    <div className="min-h-screen bg-brand-black pt-24 pb-10 px-4">
      <BackHeader title="Checkout" onBack={onBack} />
      
      <div className="max-w-xl mx-auto">
        <div className="glass-card p-6 rounded-xl mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-gray-400 font-body uppercase text-sm">Order Summary</h3>
            <span className="text-white font-bold">₹{total}</span>
          </div>
          <p className="text-sm text-gray-300 italic">{cart.length} items selected</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Type */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => setDetails({...details, type: 'pickup'})}
              className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                details.type === 'pickup' 
                  ? 'bg-brand-yellow/20 border-brand-yellow text-brand-yellow' 
                  : 'bg-transparent border-white/20 text-gray-400 hover:border-white/40'
              }`}
            >
              <Store size={24} />
              <span className="font-heading font-bold uppercase">Pickup</span>
            </button>
            <button 
              type="button"
              onClick={() => setDetails({...details, type: 'delivery'})}
              className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-all ${
                details.type === 'delivery' 
                  ? 'bg-brand-yellow/20 border-brand-yellow text-brand-yellow' 
                  : 'bg-transparent border-white/20 text-gray-400 hover:border-white/40'
              }`}
            >
              <Bike size={24} />
              <span className="font-heading font-bold uppercase">Delivery</span>
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-body uppercase">Full Name *</label>
              <input 
                required
                type="text" 
                value={details.name}
                onChange={(e) => setDetails({...details, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-brand-yellow focus:outline-none transition-colors"
                placeholder="Enter your name"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2 font-body uppercase">Phone Number *</label>
              <input 
                required
                type="tel" 
                value={details.phone}
                onChange={(e) => setDetails({...details, phone: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-brand-yellow focus:outline-none transition-colors"
                placeholder="Enter 10-digit number"
              />
            </div>

            {details.type === 'delivery' && (
              <div className="animate-fade-in">
                <label className="block text-gray-400 text-sm mb-2 font-body uppercase">Delivery Address *</label>
                <textarea 
                  required
                  value={details.address}
                  onChange={(e) => setDetails({...details, address: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-brand-yellow focus:outline-none transition-colors h-24"
                  placeholder="House No, Street, Landmark..."
                />
              </div>
            )}

            <div>
              <label className="block text-gray-400 text-sm mb-2 font-body uppercase">Special Instructions (Optional)</label>
              <textarea 
                value={details.notes}
                onChange={(e) => setDetails({...details, notes: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded p-3 text-white focus:border-brand-yellow focus:outline-none transition-colors h-20"
                placeholder="Less spicy, extra cheese, etc..."
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded font-heading font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-green-900/20"
          >
            <MessageCircle size={24} />
            Place Order on WhatsApp
          </button>
          <p className="text-center text-xs text-gray-500">
            Clicking this will open WhatsApp with your pre-filled order.
          </p>
        </form>
      </div>
    </div>
  );
};

// --- View: Success Page ---
const OrderSuccessView = ({ onHome }: { onHome: () => void }) => (
  <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      <h2 className="text-3xl font-heading font-bold text-white mb-4">Order Generated!</h2>
      <p className="text-gray-300 font-body mb-8">
        You should have been redirected to WhatsApp to send your order. If not, please try again.
      </p>
      <div className="space-y-4">
        <a 
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-brand-yellow text-brand-black py-3 rounded font-bold uppercase"
        >
          Open Chat
        </a>
        <button 
          onClick={onHome}
          className="block w-full bg-white/10 text-white py-3 rounded font-bold uppercase"
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
);

// --- Features & Gallery & Footer (Keep simple for context) ---
const Features = () => {
  const features = [
    { icon: <Utensils className="w-8 h-8 text-brand-black" />, title: "Wide Variety", desc: "From loaded burgers to Italian pastas." },
    { icon: <Zap className="w-8 h-8 text-brand-black" />, title: "Pocket-Friendly", desc: "Delicious meals starting at just ₹39." },
    { icon: <Leaf className="w-8 h-8 text-brand-black" />, title: "Freshly Made", desc: "Every order is prepared fresh." }
  ];
  return (
    <div className="relative -mt-20 z-20 px-4 max-w-7xl mx-auto mb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-brand-yellow p-8 rounded-lg shadow-xl flex flex-col items-center text-center">
            <div className="mb-4 bg-white/20 p-4 rounded-full">{feature.icon}</div>
            <h3 className="font-heading text-2xl font-bold text-brand-black mb-2 uppercase">{feature.title}</h3>
            <p className="font-body text-brand-black/80 font-medium">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Gallery = () => {
  const images = [
    "https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800",
    "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800",
    "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=800",
    "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800",
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=800",
    "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800"
  ];
  return (
    <section id="gallery" className="py-20 bg-brand-dark scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 uppercase">Food <span className="text-brand-red">Gallery</span></h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, idx) => (
            <div key={idx} className="relative aspect-square overflow-hidden rounded-lg group">
              <img src={src} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" alt="Gallery" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = () => (
  <section id="contact" className="py-20 bg-brand-dark scroll-mt-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-4xl font-heading font-bold text-white mb-8 uppercase">Visit Us <span className="text-brand-yellow">Today</span></h2>
          <div className="space-y-6">
            <div className="flex gap-4"><MapPin className="text-brand-yellow" /> <span className="text-gray-400">{CONTACT_INFO.address}</span></div>
            <div className="flex gap-4"><Phone className="text-brand-yellow" /> <span className="text-gray-400">+91 {CONTACT_INFO.phone}</span></div>
            <div className="flex gap-4"><Clock className="text-brand-yellow" /> <span className="text-gray-400">{CONTACT_INFO.timings}</span></div>
          </div>
        </div>
        <div className="h-[300px] w-full bg-brand-gray rounded-xl flex items-center justify-center text-center p-4">
           <div><MapPin size={40} className="mx-auto text-brand-red mb-2"/> <p className="text-white font-bold">Map Placeholder</p></div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-black py-10 border-t border-white/10 text-center md:text-left">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div>
        <span className="font-heading font-bold text-2xl text-white tracking-wider uppercase">Shivay <span className="text-brand-yellow">Burger</span></span>
        <p className="text-gray-500 text-sm mt-2 font-body">© {new Date().getFullYear()} Shivay Burger.</p>
      </div>
    </div>
  </footer>
);

const FloatingWA = () => (
  <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="fixed bottom-24 right-6 z-40 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 group">
    <MessageCircle size={32} className="fill-current" />
  </a>
);

// --- Main App Logic ---

const App = () => {
  const [view, setView] = useState<ViewState>('home');
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === item.name);
      if (existing) {
        return prev.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemName: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.name === itemName) {
          return { ...item, quantity: Math.max(0, item.quantity + delta) };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (itemName: string) => {
    setCart(prev => prev.filter(i => i.name !== itemName));
  };

  const handleCheckoutSubmit = (details: OrderDetails) => {
    // Generate WhatsApp Message
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const itemsList = cart.map(i => `- ${i.name} x${i.quantity} (₹${i.price * i.quantity})`).join('\n');
    
    let message = `*New Order: Shivay Burger* 🍔\n\n`;
    message += `*Customer:* ${details.name}\n`;
    message += `*Phone:* ${details.phone}\n`;
    message += `*Type:* ${details.type.toUpperCase()}\n`;
    if (details.type === 'delivery') message += `*Address:* ${details.address}\n`;
    if (details.notes) message += `*Notes:* ${details.notes}\n`;
    message += `\n*Order Items:*\n${itemsList}\n\n`;
    message += `*Total Amount: ₹${total}*\n`;
    message += `\nPlease confirm my order!`;

    const url = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
    setCart([]); // Clear cart
    setView('success');
    window.scrollTo(0,0);
  };

  // Views Logic
  const renderView = () => {
    switch(view) {
      case 'cart':
        return <CartView 
                  cart={cart} 
                  onBack={() => setView('home')} 
                  onUpdate={updateQuantity} 
                  onRemove={removeFromCart}
                  onProceed={() => setView('checkout')}
               />;
      case 'checkout':
        return <CheckoutView 
                  cart={cart} 
                  onBack={() => setView('cart')} 
                  onSubmit={handleCheckoutSubmit} 
               />;
      case 'success':
        return <OrderSuccessView onHome={() => setView('home')} />;
      default:
        return (
          <>
            <Navbar cartCount={cart.reduce((a,b) => a + b.quantity, 0)} onCartClick={() => setView('cart')} />
            <Hero />
            <Features />
            <MenuSection 
              cart={cart} 
              onAdd={addToCart} 
              onRemove={removeFromCart} 
              onUpdate={updateQuantity} 
            />
            <Gallery />
            <Contact />
            <Footer />
            <StickyCartBar cart={cart} onCheckout={() => setView('cart')} />
            {cart.length === 0 && <FloatingWA />}
          </>
        );
    }
  };

  return (
    <div className="bg-brand-black min-h-screen text-white font-body selection:bg-brand-yellow selection:text-black">
      {renderView()}
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
