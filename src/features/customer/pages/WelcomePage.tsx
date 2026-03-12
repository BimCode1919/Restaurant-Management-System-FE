import React, { useState } from 'react';
import ReservationOptionModal from '../components/ReservationOptionModal';

const WelcomePage: React.FC = () => {
    const [isOptionModalOpen, setIsOptionModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            {/* Logo Section */}
            <div className="mb-12 animate-in fade-in zoom-in duration-700">
                <div className="size-24 bg-burgundy rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-burgundy/30 mx-auto mb-6">
                    <span className="material-symbols-outlined text-5xl">restaurant</span>
                </div>
                <h1 className="text-5xl font-black text-dark-gray uppercase tracking-tighter italic leading-none">Culina</h1>
                <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Fine Dining Experience</p>
            </div>

            <div className="max-w-xs w-full space-y-4">
                <button 
                    onClick={() => setIsOptionModalOpen(true)}
                    className="w-full bg-burgundy text-white py-6 rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-burgundy/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    BOOK A TABLE NOW
                </button>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    Experience world-class dining <br/> at our restaurant.
                </p>
            </div>

            <ReservationOptionModal 
                isOpen={isOptionModalOpen} 
                onClose={() => setIsOptionModalOpen(false)} 
            />
        </div>
    );
};

export default WelcomePage;