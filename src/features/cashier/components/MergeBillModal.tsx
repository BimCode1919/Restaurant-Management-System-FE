import React, { useState } from 'react';
import { TableResponse } from '../types';

interface MergeBillModalProps {
    tables: TableResponse[];
    onClose: () => void;
    onConfirm: (billIds: number[]) => void;
    isProcessing: boolean;
}

export const MergeBillModal: React.FC<MergeBillModalProps> = ({
    tables, onClose, onConfirm, isProcessing
}) => {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggleTable = (billId: number) => {
        setSelectedIds(prev =>
            prev.includes(billId) ? prev.filter(id => id !== billId) : [...prev, billId]
        );
    };

    return (
        <div className="fixed inset-0 z-[200] bg-dark-gray/60 backdrop-blur-sm flex items-center justify-center p-4 font-display">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter italic text-burgundy">Merge Tables</h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select 2 or more tables to combine bills</p>
                    </div>
                    <button onClick={onClose} className="size-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-all">
                        <span className="material-symbols-outlined text-gray-400 font-bold">close</span>
                    </button>
                </div>

                {/* Body - Grid chọn bàn */}
                <div className="flex-1 overflow-y-auto p-8 grid grid-cols-3 gap-4">
                    {tables.map((table) => {
                        const billId = table.currentBill?.id;
                        const isSelected = selectedIds.includes(billId);

                        return (
                            <button
                                key={table.id}
                                onClick={() => toggleTable(billId)}
                                className={`relative p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 group
                  ${isSelected
                                        ? 'border-burgundy bg-burgundy/5'
                                        : 'border-gray-100 bg-white hover:border-gray-200'}`}
                            >
                                <span className={`text-2xl font-black italic transition-colors ${isSelected ? 'text-burgundy' : 'text-dark-gray'}`}>
                                    #{table.tableNumber}
                                </span>
                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">
                                    Bill: {billId}
                                </span>
                                {isSelected && (
                                    <div className="absolute top-3 right-3 size-5 bg-burgundy rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                        <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-gray-400 border border-gray-200 hover:bg-white transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={selectedIds.length < 2 || isProcessing}
                        onClick={() => onConfirm(selectedIds)}
                        className="flex-[2] py-4 bg-dark-gray text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-dark-gray/20 hover:bg-burgundy transition-all disabled:opacity-30 disabled:grayscale"
                    >
                        {isProcessing ? 'Merging...' : `Confirm Merge (${selectedIds.length} Bills)`}
                    </button>
                </div>
            </div>
        </div>
    );
};