import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { NEW_ARRIVALS } from '../constants';

const NewArrivals: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -300 : 300;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="bg-black py-24 border-b border-gray-900 relative z-20">
            <div className="container mx-auto px-6">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">Fresh Drops</h2>
                        <p className="text-gray-400">The latest figures from across the multiverse.</p>
                    </div>
                    
                    <div className="flex gap-2">
                        <button onClick={() => scroll('left')} className="p-3 border border-gray-700 rounded-full text-white hover:bg-white hover:text-black transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <button onClick={() => scroll('right')} className="p-3 border border-gray-700 rounded-full text-white hover:bg-white hover:text-black transition-colors">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>

                <div 
                    ref={scrollRef}
                    className="flex gap-8 overflow-x-auto pb-8 no-scrollbar snap-x snap-mandatory"
                >
                    {NEW_ARRIVALS.map((item) => (
                        <div key={item.id} className="min-w-[280px] md:min-w-[320px] snap-start group cursor-pointer">
                            <div className="relative aspect-[3/4] bg-gray-900 p-6 rounded-sm overflow-hidden mb-4 border border-gray-800">
                                <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 uppercase z-10">
                                    {item.tag}
                                </div>
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500 relative z-0"
                                    loading="lazy"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1 font-display">{item.name}</h3>
                            <p className="text-gray-400">₹ {item.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;