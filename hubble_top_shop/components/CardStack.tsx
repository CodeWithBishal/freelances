import React from 'react';
import { STACK_SECTIONS } from '../constants';
import { ArrowRight } from 'lucide-react';

const StackSection: React.FC<{ data: typeof STACK_SECTIONS[0], index: number; total: number }> = ({ data, index, total }) => {
    return (
        <div 
            className="sticky top-0 w-full flex items-center justify-center p-4"
            style={{ 
                height: '100vh',
                top: `${index * 50}px`, // Adjusted offset
                zIndex: 20 + index
            }}
        >
            <div 
                className="relative w-full max-w-[95vw] md:max-w-6xl h-[85vh] md:h-[80vh] rounded-3xl overflow-hidden shadow-2xl border border-white/20 transition-transform duration-500 ease-out"
                style={{
                    backgroundColor: '#0a0a0a', 
                    transformOrigin: 'top center',
                    boxShadow: '0 -20px 40px rgba(0,0,0,0.5)'
                }}
            >
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img 
                        src={data.image} 
                        alt={data.title} 
                        className="w-full h-full object-cover opacity-60 hover:scale-105 transition-transform duration-[2s]"
                        loading="lazy"
                    />
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
                </div>

                {/* Card Header/Tab */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-black/20 backdrop-blur-xl border-b border-white/10 flex items-center px-8 justify-between z-20">
                    <span className="text-xs font-mono text-gray-300 uppercase tracking-widest">
                        Collection 0{index + 1} <span className="text-gray-600 mx-2">/</span> 0{total}
                    </span>
                    <div className="flex gap-3">
                         <div className="w-10 h-1 bg-white/20 rounded-full"></div>
                    </div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end items-start p-6 md:p-12 pb-12 md:pb-16 mt-16 z-10">
                    <div className="max-w-xl transform transition-all duration-1000">
                        {/* Title */}
                        <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4 drop-shadow-2xl uppercase leading-tight tracking-tight">
                            {data.title}
                        </h2>

                        <div className="flex flex-col gap-4 items-start">
                            <p className="text-sm md:text-base text-gray-200 max-w-md font-light leading-relaxed">
                                Curated for the exceptional. Discover pieces that define your space.
                            </p>

                            <button className="group relative bg-white text-black px-6 py-3 rounded-none font-bold uppercase tracking-widest text-xs overflow-hidden hover:bg-brand-accent hover:text-white transition-colors duration-300">
                                <span className="relative z-10 flex items-center gap-2">
                                    {data.buttonText}
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-2 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CardStack: React.FC = () => {
    return (
        <div className="relative bg-black w-full min-h-screen z-20 pt-20">
            {/* Header removed as requested, added padding-top for spacing */}
            <div className="relative flex flex-col items-center w-full pb-32">
                {STACK_SECTIONS.map((section, index) => (
                    <StackSection key={section.id} data={section} index={index} total={STACK_SECTIONS.length} />
                ))}
            </div>
            
            {/* Spacer */}
            <div className="h-[20vh] bg-black w-full"></div>
        </div>
    );
};

export default CardStack;