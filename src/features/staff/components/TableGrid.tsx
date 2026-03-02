import React from 'react';
import { TableResponse, TableStatus, BillResponse } from '../types';
import { OrderCard } from './OrderCard';

interface TableGridProps {
  tables: TableResponse[];
  onSelectTable: (table: TableResponse) => void;
  onViewDetail: (bill: BillResponse) => void;
}

export const TableGrid: React.FC<TableGridProps> = ({ tables, onSelectTable, onViewDetail }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tables.map((table: any) => {
        const tableStatus = String(table.status).toUpperCase();
        const isOccupied = tableStatus === 'OCCUPIED';
        const billData = table.currentBill;
        
        // Trường hợp 1: Có khách và CÓ dữ liệu Bill -> Hiện OrderCard
        const hasActiveBill = isOccupied && billData && (billData.id || billData.orderIds);

        if (hasActiveBill) {
          return (
            <OrderCard
              key={table.id}
              bill={billData}
              onViewDetail={() => onViewDetail(billData)}
            />
          );
        }

        // Trường hợp 2: Bàn có khách nhưng CHƯA có Bill (Dữ liệu bạn gửi cho bàn 01)
        if (isOccupied && !billData) {
          return (
            <div
              key={table.id}
              className="group relative bg-gray-50 border-2 border-red-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-4 cursor-not-allowed overflow-hidden"
            >
              <span className="absolute top-6 right-8 text-[10px] font-black text-red-500 bg-red-50 px-4 py-1.5 rounded-full uppercase tracking-widest border border-red-100">
                Occupied
              </span>
              <span className="text-7xl font-black text-red-200 tracking-tighter italic">
                {table.tableNumber}
              </span>
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-black text-red-400 uppercase tracking-[0.2em]">In Use</span>
                <p className="text-[10px] text-gray-400 font-bold uppercase">No active bill found</p>
              </div>
            </div>
          );
        }

        // Trường hợp 3: Bàn trống (Available) - Làm nổi bật đậm nét
        return (
          <div
            key={table.id}
            onClick={() => onSelectTable(table)}
            className="group relative bg-white border-2 border-gray-100 rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-4 hover:border-dark-gray hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <span className="absolute top-6 right-8 text-[10px] font-black text-olive bg-olive/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-olive/20">
              Ready
            </span>

            {/* Số bàn màu xám đậm, hover sẽ thành đen */}
            <span className="text-7xl font-black text-gray-400 group-hover:text-dark-gray transition-colors duration-300 tracking-tighter">
              {table.tableNumber}
            </span>

            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] group-hover:text-dark-gray transition-colors">
                Available
              </span>
              <p className="text-[10px] text-gray-400 font-bold uppercase group-hover:text-gray-500 transition-colors">
                Tap to open table
              </p>
            </div>

            {/* Nút cộng màu đen khi hover */}
            <div className="mt-4 size-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-dark-gray group-hover:text-white group-hover:rotate-90 transition-all duration-500 shadow-sm border border-gray-100">
              <span className="material-symbols-outlined text-3xl">add</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};