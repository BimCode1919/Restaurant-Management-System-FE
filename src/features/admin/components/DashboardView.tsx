import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  stats?: {
    revenueToday: number;
    ordersToday: number;
    activeTables: number;
    lowStock: number;
  };

  salesData?: {
    name: string;
    revenue: number;
  }[];

  recentOrders?: {
    id: string;
    table: string;
    total: number;
    status: string;
  }[];
}

const DashboardView: React.FC<Props> = ({
  stats,
  salesData = [],
  recentOrders = [],
}) => {
  const cards = [
    {
      label: "Revenue Today",
      value: `$${stats?.revenueToday  ?? 0}`,
    },
    {
      label: "Orders Today",
      value: stats?.ordersToday ?? 0,
    },
    {
      label: "Active Tables",
      value: stats?.activeTables ?? 0,
    },
    {
      label: "Low Inventory",
      value: stats?.lowStock ?? 0,
    },
  ];

  return (
    <div className="space-y-10">

      {/* KPI CARDS */}
      <div className="grid grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
          >
            <p className="text-xs font-black uppercase text-gray-400 tracking-widest">
              {c.label}
            </p>

            <p className="text-3xl font-black mt-2 text-[#800020]">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* SALES CHART */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-6">
          Sales Overview
        </p>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#800020"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <p className="text-xs font-black uppercase text-gray-400 tracking-widest mb-6">
          Recent Orders
        </p>

        <div className="space-y-4">
          {recentOrders.length === 0 && (
            <p className="text-gray-400 italic">
              Orders list will appear here
            </p>
          )}

          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <p className="font-bold">Table {order.table}</p>
                <p className="text-xs text-gray-400">
                  Order #{order.id}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-[#800020]">
                  ${order.total}
                </p>
                <p className="text-xs text-gray-400">
                  {order.status}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};

export default DashboardView;