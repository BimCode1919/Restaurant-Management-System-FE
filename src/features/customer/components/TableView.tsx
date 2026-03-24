import React, { useEffect, useState } from 'react';
import { Table } from '../types';
import { reservationApi } from '../services/reservationApi';
import { authApi } from '../services/authApi';

interface Props {
    onSelect: (table: Table) => void;
    selectedIds: number[]; // Thêm prop này để highlight các bàn đã chọn
    minCapacity?: number;
}

const TableView: React.FC<Props> = ({ onSelect, selectedIds, minCapacity }) => {
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTables = async () => {
            try {
                setLoading(true);
                const res = await reservationApi.getAvailableTables();
                let allTables = res.data || [];

                // LOGIC LỌC BÀN:
                // Nếu minCapacity > 10 (Large Group), hiển thị tất cả bàn để khách chọn gộp.
                // Nếu là nhóm nhỏ, chỉ hiện các bàn có sức chứa phù hợp.
                let filteredTables = allTables;
                if (minCapacity !== undefined && minCapacity <= 10) {
                    filteredTables = allTables.filter(table => table.capacity >= minCapacity);
                }

                setTables(filteredTables);
            } catch (error: any) {
                if (error.response?.status === 401) {
                    try {
                        const authRes = await authApi.createGuestSession();
                        const data = (authRes as any).data?.data || (authRes as any).data || authRes;

                        const guestData = {
                            token: data.token,
                            refreshToken: data.refreshToken,
                            info: { role: 'CUSTOMER' }
                        };

                        localStorage.setItem('user', JSON.stringify(guestData));

                        const retryRes = await reservationApi.getAvailableTables();
                        setTables(retryRes.data || []);
                    } catch (authError) {
                        console.error("Không thể tạo phiên khách:", authError);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        loadTables();
    }, [minCapacity]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-black uppercase italic text-dark-gray">
                    {minCapacity && minCapacity > 10 ? 'Select Tables to Combine' : 'Available Tables'}
                </h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {minCapacity && minCapacity > 10
                        ? 'Pick multiple tables for your large group'
                        : 'Please select a table you would like to sit at'}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {tables.map(table => {
                    const isSelected = selectedIds.includes(table.id);

                    return (
                        <button
                            key={table.id}
                            onClick={() => onSelect(table)}
                            className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-2 relative shadow-sm ${isSelected
                                    ? 'border-burgundy bg-burgundy/5 ring-1 ring-burgundy'
                                    : 'border-gray-100 bg-white hover:border-burgundy/30'
                                }`}
                        >
                            <div className={`size-12 rounded-xl flex items-center justify-center transition-colors ${isSelected ? 'bg-burgundy text-white' : 'bg-gray-50 text-gray-400'
                                }`}>
                                <span className="material-symbols-outlined">
                                    {table.capacity >= 6 ? 'group' : 'chair'}
                                </span>
                            </div>

                            <span className={`font-black text-lg ${isSelected ? 'text-burgundy' : 'text-dark-gray'}`}>
                                Table {table.tableNumber}
                            </span>

                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter italic">
                                Capacity: {table.capacity} guests
                            </span>

                            {isSelected && (
                                <div className="absolute top-4 right-4 size-5 bg-burgundy text-white rounded-full flex items-center justify-center animate-in zoom-in">
                                    <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {tables.length === 0 && (
                <div className="text-center py-10 bg-gray-50 rounded-[2rem] border border-dashed">
                    <p className="text-sm font-bold text-gray-400 italic">No tables available for this size.</p>
                </div>
            )}
        </div>
    );
};

export default TableView;