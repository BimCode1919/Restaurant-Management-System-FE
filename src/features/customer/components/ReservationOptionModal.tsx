import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const ReservationOptionModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSelectOption = (isLargeGroup: boolean) => {
        navigate('/reservation-flow', { state: { isLargeGroup } });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl relative overflow-hidden">
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-dark-gray">
                    <span className="material-symbols-outlined">close</span>
                </button>

                <h2 className="text-2xl font-black uppercase italic text-dark-gray mb-8 text-center">Choose party size</h2>

                <div className="grid gap-4">
                    {/* Option 1 */}
                    <button 
                        onClick={() => handleSelectOption(false)}
                        className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 text-left hover:border-burgundy transition-all group"
                    >
                        <span className="block font-black text-burgundy text-sm uppercase mb-1">Under 5 people</span>
                        <p className="text-xs text-gray-500 italic">Quick table booking, no deposit required.</p>
                    </button>

                    {/* Option 2 */}
                    <button 
                        onClick={() => handleSelectOption(true)}
                        className="p-6 bg-gray-900 text-white rounded-[2rem] text-left hover:scale-[1.02] transition-all"
                    >
                        <span className="block font-black text-burgundy-light text-sm uppercase mb-1">5 people or more</span>
                        <p className="text-xs text-white/60 italic">Deposit of 200,000 VND required to secure the reservation.</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReservationOptionModal;