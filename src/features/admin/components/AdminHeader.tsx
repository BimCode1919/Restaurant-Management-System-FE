import React from 'react';
import { AdminTab } from '../types';

interface Props {
  activeTab: AdminTab;
  label?: string;
}

const AdminHeader: React.FC<Props> = ({ activeTab, label }) => {
  return (
    <header className="h-24 flex items-center justify-between px-10 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-[50]">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">
          Culina / {activeTab}
        </p>
        <h2 className="text-2xl font-black text-dark-gray uppercase tracking-tighter">
          {label || activeTab}
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-4 py-2 rounded-full border border-gray-200 uppercase tracking-widest">
          {new Date().toDateString()}
        </span>
      </div>
    </header>
  );
};

export default AdminHeader;