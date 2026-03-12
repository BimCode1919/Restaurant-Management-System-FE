import React, { useEffect, useState } from 'react';
import { Table } from '../types';
import { reservationApi } from '../services/reservationApi';
import { authApi } from '../services/authApi'; 

interface Props {
    onSelect: (table: Table) => void;
    minCapacity?: number;
}

const TableView: React.FC<Props> = ({ onSelect, minCapacity }) => {
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);

useEffect(() => {
    const loadTables = async () => {
        try {
            setLoading(true);
            const res = await reservationApi.getAvailableTables();
            let filteredTables = res.data || [];

            if (minCapacity !== undefined) {
                filteredTables = filteredTables.filter(table => table.capacity >= minCapacity);
            }

            setTables(filteredTables);
        } catch (error: any) {
            // Nếu lỗi 401 (chưa có token)
            if (error.response?.status === 401) {
                try {
                    // 1. Lấy token guest mới
                    const authRes = await authApi.createGuestSession();
                    const guestData = {
                        token: authRes.data.token,
                        refreshToken: authRes.data.refreshToken,
                        role: 'GUEST'
                    };
                    
                    // 2. Lưu vào localStorage để axiosClient tự đính kèm vào header
                    localStorage.setItem('user', JSON.stringify(guestData));
                    
                    // 3. Thử gọi lại API lấy bàn lần nữa
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
}, []);
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-black uppercase italic text-dark-gray">Available Tables</h2>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Please select a table you would like to sit at</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {tables.map(table => (
                    <button
                        key={table.id}
                        onClick={() => onSelect(table)}
                        className="bg-white p-6 rounded-[2rem] border-2 border-gray-100 hover:border-burgundy transition-all flex flex-col items-center gap-2 group shadow-sm"
                    >
                        <div className="size-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-burgundy/10 group-hover:text-burgundy transition-colors">
                            <span className="material-symbols-outlined">chair</span>
                        </div>
                        <span className="font-black text-lg text-dark-gray">Table {table.tableNumber}</span>
                       {/* <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter italic">Capacity: {table.capacity} guests</span> */}
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter italic">Tab to interact</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TableView;