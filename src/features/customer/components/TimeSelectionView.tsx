import React from 'react';
import { format, parseISO } from 'date-fns';

interface Props {
    date: string;
    time: string;
    partySize: number;
    onDateChange: (d: string) => void;
    onTimeChange: (t: string) => void;
    onSizeChange: (s: number) => void;
    onNext: () => void;
}

const TimeSelectionView: React.FC<Props> = ({ date, time, partySize, onDateChange, onTimeChange, onSizeChange, onNext }) => {
    const timeSlots = ["11:00", "12:00", "13:00", "18:00", "19:00", "20:00"];

    const now = new Date();
    const todayString = format(now, 'yyyy-MM-dd');
    const selectedDate = parseISO(date);

    const isPastDate = +selectedDate < +new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isToday = date === todayString;

    const isSlotDisabled = (slot: string) => {
        if (isPastDate) return true;

        if (!isToday) return false;

        const [hh, mm] = slot.split(':').map(Number);
        const slotMinutes = hh * 60 + mm;
        const currentMinutes = now.getHours() * 60 + now.getMinutes();

        return slotMinutes <= currentMinutes;
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <section>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">1. Select date</h3>
                <input
                    type="date"
                    value={date}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => onDateChange(e.target.value)}
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold text-dark-gray focus:ring-2 focus:ring-burgundy"
                />
            </section>

            <section>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">2. Time</h3>
                <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map(slot => {
                        const disabled = isSlotDisabled(slot);
                        return (
                            <button
                                key={slot}
                                onClick={() => {
                                    if (disabled) return;
                                    onTimeChange(slot);
                                }}
                                disabled={disabled}
                                className={`p-4 rounded-2xl font-black text-xs transition-all ${time === slot ? 'bg-burgundy text-white shadow-lg' : 'bg-gray-50 text-gray-400'} ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.02]'} `}
                            >
                                {slot}
                            </button>
                        );
                    })}
                </div>
            </section>

            <button
                disabled={!time}
                onClick={onNext}
                className="w-full py-5 bg-dark-gray text-white rounded-2xl font-black uppercase text-xs disabled:opacity-30 transition-all"
            >
                Check avaiable tables
            </button>
        </div>
    );
};

export default TimeSelectionView;