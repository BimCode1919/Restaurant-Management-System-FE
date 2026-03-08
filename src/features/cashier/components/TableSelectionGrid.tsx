import React from 'react';
import { TableResponse, TableStatus } from '../../staff/types';

interface TableSelectionGridProps {
    tables: TableResponse[];
    onSelect: (table: TableResponse) => void;
    selectedTableId?: number;
}

export const TableSelectionGrid: React.FC<TableSelectionGridProps> = ({ tables, onSelect, selectedTableId }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table) => {
                const isSelected = selectedTableId === table.id;
                const readyCount = table.currentBill?.orders?.flatMap(o => o.items)
                    .filter(i => i.itemStatus === 'READY').length || 0;

                return (
                    <div
                        key={table.id}
                        onClick={() => onSelect(table)}
                        className={`relative bg-white border-2 rounded-[2.5rem] p-8 flex flex-col items-center gap-2 transition-all cursor-pointer overflow-hidden
              ${isSelected ? 'border-burgundy shadow-xl' : 'border-gray-100 hover:border-burgundy/30'}`}
                    >
                        {/* Cảnh báo nếu có món READY nhưng chưa thanh toán */}
                        {readyCount > 0 && (
                            <div className="absolute top-5 left-5">
                                <span className="flex h-2 w-2 rounded-full bg-olive animate-ping" />
                            </div>
                        )}

                        <span className={`text-5xl font-black italic tracking-tighter ${isSelected ? 'text-burgundy' : 'text-gray-300'}`}>
                            {table.tableNumber}
                        </span>

                        <div className="text-center">
                            <p className="text-[10px] font-black text-dark-gray uppercase tracking-widest">
                                Total: {table.currentBill?.finalPrice?.toLocaleString()}đ
                            </p>
                            <p className="text-[8px] text-gray-400 font-bold uppercase mt-1">
                                {table.currentBill?.orders?.length || 0} Orders Active
                            </p>
                        </div>

                        {isSelected && (
                            <div className="absolute top-4 right-6">
                                <span className="text-[8px] font-black text-white bg-burgundy px-3 py-1 rounded-full uppercase italic">
                                    Selected
                                </span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};