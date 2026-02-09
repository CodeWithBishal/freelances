import React, { useEffect, useState } from 'react';

const Preloader: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [animateOut, setAnimateOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimateOut(true);
            setTimeout(() => {
                setLoading(false);
            }, 800); // Matches transition duration
        }, 1500); // Initial load time

        return () => clearTimeout(timer);
    }, []);

    if (!loading) return null;

    return (
        <div 
            className={`fixed inset-0 z-[100] bg-black flex items-center justify-center transition-transform duration-800 ease-in-out origin-top ${animateOut ? '-translate-y-full' : 'translate-y-0'}`}
        >
            <div className={`text-white text-center transition-opacity duration-300 ${animateOut ? 'opacity-0' : 'opacity-100'}`}>
                <h1 className="text-6xl font-display font-black tracking-tighter mb-4 animate-pulse">Hubble</h1>
                <div className="w-48 h-1 bg-gray-800 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-white animate-[width_1.5s_ease-in-out_forwards]" style={{ width: '0%' }} id="loader-bar"></div>
                </div>
                <style>{`
                    @keyframes width {
                        0% { width: 0%; }
                        100% { width: 100%; }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Preloader;