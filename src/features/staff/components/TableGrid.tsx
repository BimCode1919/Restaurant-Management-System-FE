import React from 'react';
import { TableResponse, ItemStatus, TableStatus } from '../types';

interface TableGridProps {
  tables: TableResponse[];
  onSelectTable: (table: TableResponse) => void;
  onManageTable: (table: TableResponse) => void;
  selectedIds?: number[];
}

export const TableGrid: React.FC<TableGridProps> = ({ tables, onSelectTable, onManageTable, selectedIds = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tables.map((table) => {
        const isOccupied = table.status === TableStatus.OCCUPIED;
        const isReserved = table.status === TableStatus.RESERVED;
        const isSelected = selectedIds.includes(table.id);
        const bill = table.currentBill;

        // Logic đếm tiến độ món ăn chuyên sâu - GIỮ NGUYÊN
        const getOrderStats = () => {
          if (!bill?.orders) return null;
          const allItems = bill.orders.flatMap(o => o.items || []);
          if (allItems.length === 0) return null;

          const readyCount = allItems.filter(i => i.itemStatus === ItemStatus.READY).length;
          const servedCount = allItems.filter(i => i.itemStatus === ItemStatus.SERVED).length;

          return {
            done: readyCount + servedCount,
            total: allItems.length,
            isAlert: readyCount > 0,
            isFinished: servedCount === allItems.length
          };
        };

        const stats = getOrderStats();

        return (
          <div
            key={table.id}
            onClick={() => (isOccupied || isReserved) ? onManageTable(table) : onSelectTable(table)}
            className={`group relative bg-white border-2 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-4 transition-all duration-300 cursor-pointer overflow-hidden
                ${isSelected
                ? 'border-dark-gray bg-dark-gray/5 ring-4 ring-dark-gray/5 scale-[0.98]'
                : isOccupied
                  ? 'border-burgundy/10 hover:border-burgundy hover:shadow-2xl'
                  : isReserved
                    ? 'border-orange-200 bg-orange-50/30'
                    : 'border-gray-100 hover:border-dark-gray'}`}
          >
            {/* Check Icon khi chọn - Đổi sang màu Dark Gray */}
            {isSelected && (
              <div className="absolute top-6 left-8 bg-dark-gray text-white rounded-full p-1 animate-in zoom-in shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            )}

            {/* Status Badges */}
            <div className="absolute top-6 right-8 flex gap-2">
              {isOccupied && stats?.isAlert && (
                <span className="animate-bounce size-2 bg-burgundy rounded-full shadow-[0_0_10px_rgba(128,0,32,0.5)]"></span>
              )}
              <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border
                  ${isOccupied ? 'text-burgundy bg-burgundy/5 border-burgundy/10' :
                  isReserved ? 'text-orange-500 bg-orange-100 border-orange-200' :
                    'text-olive bg-olive/10 border-olive/20'}`}>
                {table.status}
              </span>
            </div>

            {/* Progress Tracker */}
            {isOccupied && stats && (
              <div className="absolute top-6 left-8 flex flex-col gap-1">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Kitchen Progress</span>
                <div className="flex gap-1">
                  {[...Array(stats.total)].map((_, i) => (
                    <div key={i} className={`h-1 w-4 rounded-full ${i < stats.done ? 'bg-olive' : 'bg-gray-200'}`} />
                  ))}
                </div>
              </div>
            )}

            {/* Table Number - Đổi màu Blue sang Burgundy khi được chọn */}
            <span className={`text-7xl font-black transition-colors duration-300 tracking-tighter italic
                ${isSelected ? 'text-burgundy' :
                isOccupied ? 'text-burgundy/20 group-hover:text-burgundy' :
                  isReserved ? 'text-orange-200 group-hover:text-orange-400' : 'text-gray-300 group-hover:text-dark-gray'}`}>
              {table.tableNumber}
            </span>

            {/* Info Footer */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-black text-dark-gray uppercase tracking-[0.2em]">
                {isOccupied ? `Total: ${bill?.finalPrice?.toLocaleString()} VND` :
                  isReserved ? 'Reserved for Guest' : 'Available'}
              </span>
              <p className="text-[10px] text-gray-400 font-bold uppercase">
                {isSelected ? 'Tap again to unselect' : (isOccupied ? `${stats?.done}/${stats?.total} Items Ready` : 'Tap to interact')}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};