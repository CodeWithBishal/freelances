import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, ShoppingCart, Plus } from 'lucide-react';
import { NEW_ARRIVALS } from '../constants';

const NewArrivals: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -350 : 350;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="bg-black py-24 border-b border-gray-900 relative z-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-violet-900/10 to-transparent pointer-events-none" />
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex items-end justify-between mb-16">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="h-px w-10 bg-amber-500"></span>
                            <span className="text-amber-500 uppercase tracking-widest text-xs font-bold">New Collection</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">Fresh Drops<span className="text-amber-500">.</span></h2>
                        <p className="text-gray-400 max-w-md">Secure the latest highly anticipated figures from across the multiverse before they vanish.</p>
                    </div>
                    
                    <div className="flex gap-4">
                        <button onClick={() => scroll('left')} className="p-4 border border-zinc-800 rounded-full text-white hover:bg-white hover:text-black transition-all hover:scale-105 active:scale-95 group">
                            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button onClick={() => scroll('right')} className="p-4 border border-zinc-800 rounded-full text-white hover:bg-white hover:text-black transition-all hover:scale-105 active:scale-95 group">
                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <div 
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto pb-12 no-scrollbar snap-x snap-mandatory"
                >
                    {NEW_ARRIVALS.map((item) => (
                        <div key={item.id} className="min-w-[300px] md:min-w-[340px] snap-start group cursor-pointer">
                            <div className="relative aspect-[3/4] bg-zinc-900/50 p-2 rounded-2xl overflow-hidden mb-6 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                                
                                {/* Background Gradient Radial */}
                                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/0 via-zinc-800/0 to-zinc-800/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Tag */}
                                <div className="absolute top-4 left-4 bg-zinc-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 uppercase tracking-wider border border-white/10 rounded-full z-10">
                                    {item.tag}
                                </div>
                                
                                {/* Image */}
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-contain transform group-hover:scale-110 group-hover:-rotate-2 transition-all duration-700 ease-out relative z-0 drop-shadow-2xl"
                                    loading="lazy"
                                />

                                {/* Floating Actions */}
                                <button className="absolute bottom-4 right-4 bg-white text-black p-3.5 rounded-full translate-y-20 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg shadow-white/10 hover:bg-amber-400 hover:scale-110 z-20 flex items-center justify-center">
                                    <ShoppingCart size={20} className="fill-current" />
                                </button>
                                
                                <div className="absolute bottom-4 left-4 flex gap-2 translate-y-20 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 z-20">
                                    <button className="bg-zinc-800/90 backdrop-blur text-white p-3 rounded-full hover:bg-zinc-700 transition-colors">
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-white font-display group-hover:text-amber-500 transition-colors">{item.name}</h3>
                                <div className="flex items-center justify-between">
                                    <p className="text-zinc-400 font-medium">₹ {item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;