import React, { useEffect, useState } from 'react';

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        {/* Background - Parallax Effect */}
        <div 
            className="absolute inset-0 z-0 w-full h-[120%] -top-[10%]"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        >
            <img 
                src="https://images.unsplash.com/photo-1608889476561-6242cfdbf622?q=80&w=2000&auto=format&fit=crop" 
                alt="Hero Background" 
                className="w-full h-full object-cover opacity-60 blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>

        <div 
            className="relative z-10 container mx-auto px-4 sm:px-6 md:px-8 h-full flex flex-col items-center justify-center text-center mt-16 sm:mt-0"
            style={{ transform: `translateY(${scrollY * 0.2}px)`, opacity: 1 - Math.min(1, scrollY / 700) }}
        >
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-black text-white mb-4 sm:mb-6 tracking-tighter leading-[0.9] sm:leading-none drop-shadow-2xl uppercase px-2">
                Legends & <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-500 animate-gradient-x">
                    HEROES
                </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-2xl mb-8 sm:mb-10 font-light tracking-wide px-4">
                The multiverse of premium collectibles. From Tokyo to New York, we bring the heroes home.
            </p>
            <div className="flex gap-4 px-4">
                <button className="bg-red-600 text-white border border-red-600 px-6 sm:px-10 py-3 sm:py-4 rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm hover:bg-transparent transition-all hover:scale-105 duration-300">
                    Start Collection
                </button>
            </div>
        </div>
        
        {/* Scroll Indicator */}
        <div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2"
            style={{ opacity: 1 - Math.min(1, scrollY / 300) }}
        >
            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-red-500 to-transparent animate-pulse"></div>
        </div>
        
        <style>{`
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
          }
          @keyframes gradient-x {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
        `}</style>
    </section>
  );
};

export default Hero;