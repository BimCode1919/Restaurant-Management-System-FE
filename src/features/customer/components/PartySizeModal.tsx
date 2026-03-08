import React, { useState } from 'react';

interface PartySizeModalProps {
    isOpen: boolean;
    onConfirm: (size: number) => void;
}

const PartySizeModal: React.FC<PartySizeModalProps> = ({ isOpen, onConfirm }) => {
    const [size, setSize] = useState(1);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex flex-col items-center text-center">
                    <div className="size-16 bg-burgundy/10 rounded-2xl flex items-center justify-center text-burgundy mb-6">
                        <span className="material-symbols-outlined text-3xl">groups</span>
                    </div>

                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-dark-gray mb-2">
                        Welcome!
                    </h2>
                    <p className="text-gray-500 text-sm font-medium mb-8">
                        How many people are dining at this table?
                    </p>

                    <div className="flex items-center gap-6 mb-8">
                        <button
                            onClick={() => setSize(Math.max(1, size - 1))}
                            className="size-12 rounded-xl border-2 border-gray-100 flex items-center justify-center text-2xl font-bold hover:bg-gray-50 active:scale-90 transition-all"
                        >
                            -
                        </button>
                        <span className="text-4xl font-black text-burgundy w-12">{size}</span>
                        <button
                            onClick={() => setSize(size + 1)}
                            className="size-12 rounded-xl border-2 border-gray-100 flex items-center justify-center text-2xl font-bold hover:bg-gray-50 active:scale-90 transition-all"
                        >
                            +
                        </button>
                    </div>

                    <button
                        onClick={() => onConfirm(size)}
                        className="w-full bg-burgundy text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-burgundy/20 hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Start Ordering
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PartySizeModal;