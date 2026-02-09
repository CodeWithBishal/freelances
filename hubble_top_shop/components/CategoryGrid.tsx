import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../constants';

const CategoryGrid: React.FC = () => {
    return (
        <section className="bg-black py-24 border-t border-gray-900 relative z-20">
            <div className="container mx-auto px-6 mb-16 flex flex-col md:flex-row items-end justify-between gap-8">
                <div>
                    <h2 className="text-4xl md:text-7xl font-display font-bold text-white mb-4 leading-tight">
                        Choose Your <br/> Fandom
                    </h2>
                </div>
                <div className="flex items-center gap-4 text-gray-400 text-sm md:text-base border-l border-gray-800 pl-6">
                    <p className="max-w-xs">
                        From the Avengers Tower to the Hidden Leaf Village, find the pieces that complete your collection.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    {CATEGORIES.map((cat) => (
                        <div 
                            key={cat.id} 
                            className={`relative group overflow-hidden bg-gray-900 rounded-xl ${cat.span} aspect-square md:aspect-auto min-h-[250px]`}
                        >
                            <div className="absolute inset-0 bg-gray-800 animate-pulse" /> {/* Placeholder while loading */}
                            <img 
                                src={cat.image} 
                                alt={cat.name} 
                                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-50 group-hover:scale-110 transition-all duration-1000 ease-in-out"
                                loading="lazy"
                            />
                            
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>

                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <div className="border-t border-white/20 pt-4 flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-xl md:text-2xl font-bold font-display text-white relative z-10 uppercase tracking-tight">
                                        {cat.name}
                                    </h3>
                                    
                                    <div className="bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-0 group-hover:scale-100">
                                        <ArrowUpRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;