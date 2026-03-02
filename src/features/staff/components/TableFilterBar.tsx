import React from 'react';
import { TableStatus } from '../types';

// Định nghĩa kiểu cho Filter: 'ALL' hoặc các giá trị của TableStatus
export type FilterType = 'ALL' | keyof typeof TableStatus;

interface TableFilterBarProps {
    search: string;
    setSearch: (value: string) => void;
    filter: FilterType;
    setFilter: (filter: FilterType) => void;
}

export const TableFilterBar: React.FC<TableFilterBarProps> = ({
    search,
    setSearch,
    filter,
    setFilter,
}) => {
    // Danh sách các tab dựa trên Enum TableStatus
    const filterTabs: { label: string; value: FilterType }[] = [
        { label: 'All Tables', value: 'ALL' },
        { label: 'Available', value: 'AVAILABLE' },
        { label: 'Occupied', value: 'OCCUPIED' },
        { label: 'Reserved', value: 'RESERVED' },
        { label: 'Maintenance', value: 'MAINTENANCE' },
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-4 mb-8 items-center bg-white p-2 rounded-2xl border border-gray-100 shadow-sm transition-all">
            {/* Search Input */}
            <div className="w-full lg:w-96 relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-burgundy transition-colors">
                    search
                </span>
                <input
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-burgundy/10 placeholder:text-gray-300 transition-all"
                    placeholder="Find table number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Filter Tabs */}
            <div
                className="flex gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0"
                style={{
                    msOverflowStyle: 'none',  /* IE and Edge */
                    scrollbarWidth: 'none',   /* Firefox */
                }}
            >
                <style>{`
                    div::-webkit-scrollbar {
                      display: none;
                    }
                `}</style>
                {filterTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setFilter(tab.value)}
                        className={`
              h-11 px-5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap
              ${filter === tab.value
                                ? 'bg-dark-gray text-white shadow-lg shadow-gray-200 scale-105 z-10'
                                : 'bg-transparent text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                            }
            `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
};